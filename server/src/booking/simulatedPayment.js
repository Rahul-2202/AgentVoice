// Simulated demo payment (PRD 3 goal 5). No money moves. Every receipt is marked DEMO.
import { randomUUID } from 'node:crypto';

export function createSimulatedPayment() {
  const charges = [];
  return {
    name: 'simulated',
    charges,
    async charge({ payerId, amount, currency, bookingKey }) {
      const receipt = {
        paymentId: `DEMO-PAY-${randomUUID().slice(0, 8).toUpperCase()}`,
        payerId,
        amount,
        currency,
        bookingKey,
        label: 'DEMO',
        moneyMoved: false,
      };
      charges.push(receipt);
      return receipt;
    },
  };
}
