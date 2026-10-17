// Fake ixigo connector for tests and the V1 demo. It returns deterministic
// offers, every one stamped with checkedAt, and every ticket is marked DEMO.
import { randomUUID } from 'node:crypto';

const CATALOG = {
  flight: [
    { provider: 'Demo Air', basePrice: 4200, durationMin: 135 },
    { provider: 'Sample Jet', basePrice: 5100, durationMin: 120 },
  ],
  bus: [{ provider: 'Demo Coaches', basePrice: 900, durationMin: 480 }],
  stay: [
    { provider: 'Demo Stay Hotel', basePrice: 6500, durationMin: 0 },
    { provider: 'Sample Inn', basePrice: 3400, durationMin: 0 },
  ],
};

export function createFakeIxigo({ now = () => Date.now() } = {}) {
  return {
    name: 'fake_ixigo',

    async search({ kind, from, to, date, travellers = 1 }) {
      const rows = CATALOG[kind];
      if (!rows) throw new Error(`unsupported kind: ${kind}`);
      const checkedAt = new Date(now()).toISOString();
      return rows.map((row, i) => ({
        id: `${kind}-${i}-${from ?? 'any'}-${to ?? 'any'}-${date ?? 'any'}`,
        kind,
        provider: row.provider,
        from,
        to,
        date,
        durationMin: row.durationMin,
        price: row.basePrice * travellers,
        currency: 'INR',
        refundable: true,
        checkedAt,
        demo: true,
      }));
    },

    async book({ offer, travellers = 1 }) {
      if (offer.demo !== true) throw new Error('fake_ixigo only books demo offers');
      return {
        ticketId: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}`,
        offerId: offer.id,
        kind: offer.kind,
        provider: offer.provider,
        travellers,
        status: 'BOOKED',
        label: 'DEMO',
        bookedAt: new Date(now()).toISOString(),
      };
    },
  };
}
