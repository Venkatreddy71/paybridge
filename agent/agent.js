const Anthropic = require('@anthropic-ai/sdk').default;
const Groq = require("groq-sdk");

const { SYSTEM_PROMPT } = require('./prompt');
const { TOOL_DEFINITIONS } = require('./tools');

const fxTool       = require('../backend/tools/fxTool');
const savingsTool  = require('../backend/tools/savingsTool');
const banksTool    = require('../backend/tools/banksTool');
const paymentTool  = require('../backend/tools/paymentTool');

// ✅ Clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


// ── Tool executor ──────────────────────────────────────────────────────────
async function executeTool(toolName, toolInput) {
  console.log(`[Agent] Executing tool: ${toolName}`, toolInput);

  switch (toolName) {
    case 'get_fx_rate':
      return await fxTool.getRate(
        toolInput.from_currency,
        toolInput.to_currency || 'INR'
      );

    case 'calculate_savings':
      return await savingsTool.calculate(
        toolInput.amount,
        toolInput.currency,
        toolInput.bank_name || 'typical'
      );

    case 'compare_all_banks':
      return await banksTool.compareAll(
        toolInput.amount,
        toolInput.currency
      );

    case 'get_payment_status':
      return paymentTool.getStatus(toolInput.payment_id);

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}


// ── Main agent function ────────────────────────────────────────────────────
async function runAgent(messages) {
  let currentMessages = [...messages];

  // Try agent loop (Anthropic first)
  for (let iteration = 0; iteration < 5; iteration++) {
    let response;

    try {
      console.log("[Agent] Trying Anthropic...");

      response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        tools: TOOL_DEFINITIONS,
        messages: currentMessages,
      });

    } catch (err) {
      console.log("[Agent] Anthropic failed → switching to Groq");
      console.log("Reason:", err.message);

      // 🔁 Fallback to Groq (simple response)
      try {
        const groqResponse = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...currentMessages
          ],
        });

        return {
          message: groqResponse.choices[0].message.content,
          toolResults: [],
        };

      } catch (groqErr) {
        console.error("[Agent] Groq also failed:", groqErr.message);

        return {
          message: "Both AI services are unavailable. Please try again later.",
          toolResults: [],
        };
      }
    }

    console.log(`[Agent] Stop reason: ${response.stop_reason}`);

    // ✅ Final response
    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text');

      return {
        message: textBlock?.text || 'I could not generate a response.',
        toolResults: [],
      };
    }

    // ✅ Tool usage
    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const toolResults = [];

      for (const toolUse of toolUseBlocks) {
        const result = await executeTool(toolUse.name, toolUse.input);

        toolResults.push({
          toolName: toolUse.name,
          input: toolUse.input,
          result,
        });

        currentMessages = [
          ...currentMessages,
          { role: 'assistant', content: response.content },
          {
            role: 'user',
            content: [{
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(result),
            }],
          },
        ];
      }

      continue;
    }

    break;
  }

  return {
    message: 'I had trouble processing that request. Please try again.',
    toolResults: [],
  };
}

module.exports = { runAgent };
