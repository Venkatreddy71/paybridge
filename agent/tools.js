// ── PayBridge Agent Tool Definitions ─────────────────────────────────────────
// These are passed to Claude as available tools (function calling)

const TOOL_DEFINITIONS = [
  {
    name: 'get_fx_rate',
    description: 'Fetch the current live interbank exchange rate between two currencies. Use this whenever the user asks about rates or before calculating savings.',
    input_schema: {
      type: 'object',
      properties: {
        from_currency: {
          type: 'string',
          description: 'Source currency code e.g. USD, EUR, GBP',
        },
        to_currency: {
          type: 'string',
          description: 'Target currency code e.g. INR',
          default: 'INR',
        },
      },
      required: ['from_currency'],
    },
  },

  {
    name: 'calculate_savings',
    description: 'Calculate and compare what the exporter would receive via their bank vs PayBridge for a given invoice. Returns exact INR amounts and the rupee saving.',
    input_schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'Invoice amount in foreign currency',
        },
        currency: {
          type: 'string',
          description: 'Currency of the invoice e.g. USD, EUR, GBP',
        },
        bank_name: {
          type: 'string',
          description: 'Name of the exporter\'s bank e.g. HDFC, SBI, ICICI. If unknown use "typical"',
        },
      },
      required: ['amount', 'currency'],
    },
  },

  {
    name: 'compare_all_banks',
    description: 'Compare what the exporter would receive from ALL major Indian banks vs PayBridge for a given amount. Use when user wants to know which bank is best or asks for a comparison.',
    input_schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'Invoice amount in foreign currency',
        },
        currency: {
          type: 'string',
          description: 'Currency code e.g. USD, EUR',
        },
      },
      required: ['amount', 'currency'],
    },
  },

  {
    name: 'get_payment_status',
    description: 'Check the status of a payment in the PayBridge system. Returns current stage of settlement.',
    input_schema: {
      type: 'object',
      properties: {
        payment_id: {
          type: 'string',
          description: 'Payment ID or reference number. If user doesn\'t have one, use "latest"',
        },
      },
      required: ['payment_id'],
    },
  },
];

module.exports = { TOOL_DEFINITIONS };
