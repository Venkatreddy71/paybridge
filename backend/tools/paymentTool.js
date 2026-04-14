// Mock payment database for demo
const MOCK_PAYMENTS = {
  'PB-001': {
    id:            'PB-001',
    client:        'Acme Corp, USA',
    amount:        '$10,000',
    inr_expected:  '₹8,34,090',
    status:        'converting',
    stage:         2,
    stages: [
      { name: 'Payment received',      done: true,  time: '10:15 AM' },
      { name: 'Converting USD → INR',  done: false, time: 'in progress' },
      { name: 'INR transfer initiated', done: false, time: 'pending' },
      { name: 'Funds in your account', done: false, time: 'est. 4:30 PM' },
    ],
    eta: '4:30 PM today',
  },
  'PB-002': {
    id:            'PB-002',
    client:        'TechFlow GmbH, Germany',
    amount:        '€15,000',
    inr_expected:  '₹13,37,475',
    status:        'settled',
    stage:         4,
    stages: [
      { name: 'Payment received',      done: true, time: 'Yesterday 2:00 PM' },
      { name: 'Converting EUR → INR',  done: true, time: 'Yesterday 2:45 PM' },
      { name: 'INR transfer initiated', done: true, time: 'Yesterday 3:00 PM' },
      { name: 'Funds in your account', done: true, time: 'Today 9:20 AM' },
    ],
    eta: 'Completed',
  },
  'latest': {
    id:            'PB-001',
    client:        'Acme Corp, USA',
    amount:        '$10,000',
    inr_expected:  '₹8,34,090',
    status:        'converting',
    stage:         2,
    stages: [
      { name: 'Payment received',      done: true,  time: '10:15 AM' },
      { name: 'Converting USD → INR',  done: false, time: 'in progress' },
      { name: 'INR transfer initiated', done: false, time: 'pending' },
      { name: 'Funds in your account', done: false, time: 'est. 4:30 PM' },
    ],
    eta: '4:30 PM today',
  },
};

function getStatus(paymentId = 'latest') {
  const payment = MOCK_PAYMENTS[paymentId] || MOCK_PAYMENTS['latest'];
  return {
    ...payment,
    checked_at: new Date().toISOString(),
    note: 'Demo data — in production this would reflect real settlement status',
  };
}

module.exports = { getStatus };
