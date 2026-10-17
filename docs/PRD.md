# Go: Product Requirements Document (V1)

Status: Draft v0.1, for dev-lead review
Owner: product-manager
Source: vestrago.vercel.app (landing page and product docs). The full spec at `docs/superpowers/specs/2026-10-03-go-hackweek-design.md` (branch `docs/go-hackweek-spec`) was not accessible when this was written. Items marked **[confirm against spec]** must be checked against it.

---

## 1. Summary

Go is an AI member of a group trip chat. Friend groups plan trips in the chat they already use. Go does the research, builds the itinerary, runs votes, books flights, trains, buses, hotels and activities, and tracks the budget. Nobody has to do all the work alone, and money stays visible.

Go is a Vestra product, built as a hackweek project (5 to 9 October 2026) by two teams.

## 2. Problem

- Friend groups planning a trip often rely on one person who ends up doing all the research, booking and chasing money.
- Per the landing page, 76% of group trips never leave the group chat. Plans stall because nobody owns the work.
- Splitting costs is awkward, and people are uncomfortable stating their budget in front of the group.

## 3. Goals (V1)

1. Launch V1 this week with a working demo booking pipeline on mock booking services.
2. A group can go from a chat message to a confirmed, paid booking without leaving the trip room.
3. Each member can state a private budget, and Go plans to the group's lowest budget.
4. Every booking is confirmed by the payer and by Face ID before any money moves.
5. Demonstrate one real booking and one real phone call (V1 scope).

## 4. Non-goals (V1)

- Pooled money, escrow or holding funds.
- Working inside existing WhatsApp groups, iMessage, or any other existing group chat.
- Native iOS or Android apps. V1 is web.
- Multiple trips per group.
- Members flying from different cities (stretch).
- A member linking their own Bash account.
- Production rollout.

## 5. Target users

- **Organiser:** the friend who usually plans the trip. Starts the trip, invites friends, approves bookings.
- **Member:** joins by link, gives an origin city, a private budget and preferences, votes, and pays their share.
- **Payer:** the person who pays for a booking. Only the payer can say "yes book" and confirm with Face ID.

## 6. Core user flows

### 6.1 Start a trip
1. Organiser opens Go and taps through: where, when, who, budget, vibe, stay. Six taps, or one sentence.
2. Go creates the trip room and posts the first card.

Acceptance: a trip with destination, dates, group size, budget range and stay type exists after either path.

### 6.2 Invite
1. Organiser shares a link.
2. The friend opens the link and joins with a name, origin city, private budget and preferences. Three taps.
3. No install or account is required.

Acceptance: a joined member appears in the room with their name and does not see other members' private budgets.

### 6.3 Decide
1. Go posts options (flights, stays, activities) as cards with live prices and checked-at timestamps.
2. The group votes in the room. @mentions and reactions are allowed.
3. A decision closes when the vote closes. Go records the mandate.

Acceptance: a decision closes only when Go records the close. Votes after close are rejected.

### 6.4 Book
1. Go books only after a closed decision.
2. The payer types "yes book".
3. The payer confirms with Face ID.
4. Go places the booking through the booking connector and posts a ticket card with status.

Acceptance: no booking proceeds without a closed decision, a "yes book" from the payer, and a successful Face ID confirmation.

### 6.5 Settle
1. Expenses are recorded against the single receipt.
2. The budget shows totals, categories and who owes whom.
3. Members pay back over UPI.

Acceptance: the receipt totals match the sum of recorded expenses. Each debt shows the payer and the amount.

### 6.6 After the trip
1. The trip gets a stamp.
2. The crew can start the next trip.

## 7. Functional requirements

### 7.1 Trip room (chat)
- Group chat with photos, replies, reactions and @mentions.
- Anyone can @Go to ask for help.
- Go posts votes, plans, live bookings and calls as structured cards.
- Speaking rules: Go speaks when addressed, when a vote opens or closes, or when money or a booking is involved. It stays quiet otherwise.
- Catch-up: summarise missed messages on request.

### 7.2 Itinerary
- Day-by-day booklet.
- Map and places for each day.

### 7.3 Bookings
- Tickets for flights, stays and activities.
- Checked-in status per ticket.
- Live price and checked-at timestamp on every price.

### 7.4 Budget
- One receipt for the trip.
- Totals and categories.
- Who owes whom, with UPI payback.
- Private budget answers: each member gives a range privately. Go plans to the lowest range, and no one else sees the individual answer.

### 7.5 Vault
- Stores each member's cards and logins.
- Locked by default. Contents are visible only after Face ID.
- Only the owner's vault is decryptable by the owner.

### 7.6 Memory (Nami)
- Keeps per-member facts from the group conversation, for example dietary needs or preferred airline.
- Facts are visible to the member they describe and are never shared across groups.

### 7.7 Alerts
- Alerts only for votes, mentions and money. No other push notifications in V1.

### 7.8 Live search and booking
- Flights, trains, buses and hotels via the ixigo MCP, with live prices and checked-at timestamps.
- Phone calls to businesses (for example a restaurant table or a villa's late checkout). Each call opens with a disclosure that Go is an AI.
- A browser is the backup path when the MCP has no result.

### 7.9 Hard booking rules
- No spend above the group's cap.
- Refundable options by default.
- No price shown without a live check.
- No card is charged without the payer's approval.

## 8. V1 screens

Trip Home, Itinerary, Bookings, Budget, plus the trip room, Vault (Face ID gated), invite landing and decision cards. The full set is 38 screens (`/screens` on the landing site). **[confirm against spec]** which of the 38 are V1.

## 9. Stretch (not V1)

Telegram bridge, WhatsApp nudges, voice notes, flight-delay autopilot, single-use cards, members flying from different cities.

## 10. Acceptance criteria for V1

- [ ] Trip can be started by six taps or one sentence.
- [ ] Invite link joins a member in three taps with no account.
- [ ] A vote opens, closes and records a decision.
- [ ] A booking runs end to end on mock services, gated by closed decision, "yes book" and Face ID.
- [ ] One real booking completes through ixigo.
- [ ] One real phone call completes with the AI disclosure.
- [ ] Budget receipt totals match recorded expenses.
- [ ] Vault contents are hidden until Face ID succeeds.
- [ ] Private budgets are never shown to other members.
- [ ] Memory facts never cross group boundaries.
- [ ] Alerts fire only for votes, mentions and money.

## 11. Privacy and safety rules (must never break)

- Never charge a card without a traveller's approval.
- Never share personal data between groups.
- Private budgets and vault contents stay private to their owner.
- Go discloses it is an AI on every call.

## 12. Dependencies and risks

- ixigo MCP availability and pricing. Mitigation: browser backup, mock services for demos.
- Face ID support on the web. **[confirm with dev-lead]**
- Phone-call provider. **[confirm with dev-lead]**
- Hackweek timeline is short; scope creep is the main risk. Stretch items stay out of V1.

## 13. Open questions

1. Are the 38 screens all in V1, or a subset? (Spec)
2. Which booking connector is the mock for demo, and which is the real one for the single live booking?
3. Where is the vault key held and how is it recovered if a member loses their device?
4. What is the exact tie-break rule when private budgets are far apart?

## 14. Ticket breakdown (for dev-lead)

Dev-lead creates Linear tickets from sections 6 to 10. Suggested epics:
1. Trip room and speaking rules
2. Trip setup (six taps and one sentence)
3. Invite and member onboarding
4. Voting and decisions
5. Live search and booking connectors (ixigo, mock)
6. Phone-call flow with AI disclosure
7. Budget, expenses and settle-up
8. Vault with Face ID
9. Memory (Nami) and group isolation
10. Alerts and notifications
11. Itinerary, Bookings and Trip Home screens
