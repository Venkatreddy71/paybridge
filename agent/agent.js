const Anthropic = require('@anthropic-ai/sdk').default;
const { SYSTEM_PROMPT } = require('./prompt');
const { TOOL_DEFINITIONS } = require('./tools');
const fxTool       = require('../backend/tools/fxTool');
const savingsTool  = require('../backend/tools/savingsTool');
const banksTool    = require('../backend/tools/banksTool');
const paymentTool  = require('../backend/tools/paymentTool');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Tool executor — maps tool name to actual function ─────────────────────
async function executeTool(toolName, toolInput) {
  console.log(`[Agent] Executing tool: ${toolName}`, toolInput);

  switch (toolName) {
    case 'get_fx_rate':
      return await fxTool.getRate(toolInput.from_currency, toolInput.to_currency || 'INR');

    case 'calculate_savings':
      return await savingsTool.calculate(
        toolInput.amount,
        toolInput.currency,
        toolInput.bank_name || 'typical'
      );

    case 'compare_all_banks':
      return await banksTool.compareAll(toolInput.amount, toolInput.currency);

    case 'get_payment_status':
      return paymentTool.getStatus(toolInput.payment_id);

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// ── Main agent function ───────────────────────────────────────────────────
// Takes conversation history, returns agent response + any tool results
async function runAgent(messages) {
  let currentMessages = [...messages];

  // Agentic loop — keep running until no more tool calls
  for (let iteration = 0; iteration < 5; iteration++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      tools: TOOL_DEFINITIONS,
      messages: currentMessages,
    });

    console.log(`[Agent] Stop reason: ${response.stop_reason}`);

    // If Claude is done — return final text
    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text');
      return {
        message: textBlock?.text || 'I could not generate a response. Please try again.',
        toolResults: [],
      };
    }

    // If Claude wants to use tools
    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');
      const toolResults   = [];

      // Execute each tool Claude requested
      for (const toolUse of toolUseBlocks) {
        const result = await executeTool(toolUse.name, toolUse.input);
        toolResults.push({
          toolName: toolUse.name,
          input:    toolUse.input,
          result,
        });

        // Add tool result back to conversation
        currentMessages = [
          ...currentMessages,
          { role: 'assistant', content: response.content },
          {
            role: 'user',
            content: [{
              type:        'tool_result',
              tool_use_id: toolUse.id,
              content:     JSON.stringify(result),
            }],
          },
        ];
      }

      // Continue loop — Claude will now respond with tool results
      continue;
    }

    // Unexpected stop reason
    break;
  }

  return {
    message: 'I had trouble processing that request. Please try again.',
    toolResults: [],
  };
}

module.exports = { runAgent };
