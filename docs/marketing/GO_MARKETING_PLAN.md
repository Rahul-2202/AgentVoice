# Go: Marketing Plan (V1 launch)

Status: Draft v0.1, for CEO review
Owner: marketing-lead
Task: K-8 (from product-manager, source K-7)
Inputs: `docs/PRD.md`, `docs/DESIGN.md` (PR #3, on main)

> **Evidence status.** Web access was approved by the CEO (T-84) and the competitor prices and the 76% statistic were checked on 17 October 2026. Prices come from secondary review sites and are dated 2026, so re-check each product's own pricing page before quoting. Items still marked **[verify]** were not confirmed. Nothing here is to be published or quoted externally until the CEO approves it (section 12).

No external posting, outreach, ads or social content happens without the CEO's approval (company rule, `17cbac00`).

---

## 1. Summary

Go is an AI member of a friend group's trip chat. The group plans in the chat it already uses. Go does the research, builds the itinerary, runs votes, books, and tracks money. Nobody has to do all the work alone, and the money stays visible.

**Launch goal:** show that a group can go from one chat message to a confirmed (demo) booking without leaving the trip room, and that friends want to start their next trip there.

V1 is a demo. Booking runs on fake ixigo with a simulated payment, and every ticket says DEMO. No money moves. Marketing must never imply real bookings or real payments in V1 (see section 10).

---

## 2. Market and competitors

### 2.1 Competitive set

Ranked by how directly they compete for the same job: "get our friend group to a booked trip."

| Product | Category | Positioning (as I understand it) | Pricing [verify] | Target users | Strengths | Gaps versus Go |
|---|---|---|---|---|---|---|
| WhatsApp / iMessage groups | Incumbent default | Where the plan already happens | Free | Everyone | Zero friction, where friends already are | No structure, no votes, no booking, money chased by hand. The 76% stall figure on the landing page is the gap. |
| Wanderlog | Collaborative itinerary | Shared trip planner with maps and lists; live collaboration | Free core; Pro about $39.99/yr (some sources say $49.99) | Planners, couples, groups | Map-first itineraries, live collaboration, Gmail booking scans, AI assistant in Pro | Plans, not a chat; no group decisions; no booking; no money. Go's chat-native flow is the difference. |
| Splitwise | Group expenses | Split bills among friends | Free; Pro about $39.99/yr ($4.99/mo), range $29.99 to $49.99 by source | Groups who share costs | Trusted brand for settle-up | Only the money. No plan, no booking. Go's budget view covers the trip, not only the split. |
| TripIt | Itinerary aggregator | Forwards confirmations into one itinerary | Free; Pro $49/yr (30-day trial) | Individual travellers, business | Gathers existing bookings; flight alerts | Single traveller, no planning, no group decisions. |
| Polarsteps | Travel log and social | Track and share a trip | Free core; Plus €29.99/yr or €8.99/mo (about $34.99/yr in USD) | Solo and couples | Strong sharing and storytelling; the Plus tier is mainly book discounts | Not a planner. Could be a post-trip Go feature (the "stamp"). |
| Layla | AI travel planner | Ask in plain language, get an itinerary and live prices | Premium about $49/yr (about $9.99/mo on iOS); free planning tier | Individual travellers | Strong research, live pricing, PDF export in paid tier | Mostly single-user. No group voting, no shared budget, no chat. Expedia-owned **[per review sites]**. |
| Mindtrip | AI travel planner with in-chat booking | Plan and book in one AI chat | Free for users; earns booking commissions | Individual travellers | Free, broad research, booking in chat | Single-user chat. No group decisions or shared budget. Pricing page sits behind a login. |
| OTAs (Booking.com, Airbnb, MakeMyTrip, ixigo, Kayak, Hopper) | Booking | Book the parts | Commission and fees | Individuals | Inventory, price, trust | No group decision layer. Go books through them (ixigo in V1), so they are partners as well as rivals. |
| Group-trip agencies and tour operators | Managed service | Someone plans for you | High, per-person **[verify]** | Older groups, reunions | Full service | Slow, expensive, no chat. Not the friend-group buyer. |

**Note on Google Trips:** Google shut the Trips app down on 5 August 2019. Saved places moved to Google Maps and reservations to Search. Offline access and automatic itinerary organisation did not carry over. It is a cautionary example: a big player left standalone trip planning, so Go must earn its place in the group chat.

### 2.2 Where Go wins

1. **It lives in the chat.** Competitors ask a group to leave the chat for an app. Go joins the chat.
2. **Decisions and money in one room.** Votes, bookings and the receipt sit next to the conversation that made them.
3. **Private budgets.** Go plans to the lowest private range without exposing anyone's number. No competitor I know does this **[verify]**.
4. **Passkey gate before any money moves.** Clear trust story for payments.

### 2.3 Gaps and threats

- **WhatsApp could copy a bot.** Incumbents may add AI helpers to chat. Go's defence is the trip-level structure (votes, budget, bookings) and the privacy model.
- **Splitwise-style settle-up is a known habit.** Users may not switch money tools. Go should integrate with settle-up (UPI in PRD) rather than ask people to change it.
- **Trust in AI bookings is low.** Friends may fear an AI spending their money. The passkey gate and "nothing books until you say yes" line answer this.
- **The live product is not ready yet.** Marketing must not run ahead of demo-able features. The V1 demo is the constraint.

---

## 3. Target audience

### 3.1 Primary: the friend-group organiser (age 22 to 34)

- Plans the trip, ends up doing the research and chasing money.
- Already runs a group chat for the trip.
- Wants fewer messages, one place for decisions, and no chasing.
- Trigger: "We said we'd go, and nothing has happened for three weeks."

### 3.2 Secondary: the friend in the group (same age range)

- Joins by link, states a private budget, votes, pays their share.
- Cares about not being judged on budget and not being charged without consent.
- Trigger: "I don't want to say my budget in front of everyone."

### 3.3 Not targeted in V1

- Corporate travel, families with children, and agencies. They have different buying triggers and needs (for example, car seats or expense policy).

### 3.4 Geography

- V1 demo context is India (ixigo, UPI in the PRD). Launch marketing targets **urban India, English and Hinglish, for friend groups in metros and tier-2 cities**. Expansion is out of scope.

---

## 4. Positioning and messaging

### 4.1 Positioning statement

For friend groups who plan trips in chat and lose momentum, Go is the AI member of your trip chat that does the research, runs the votes, books the trip, and keeps the money visible. Unlike planning apps, Go lives where your group already talks.

### 4.2 Core messages

1. **"Your group chat, now with a planner in it."** Hero message.
2. **"Nothing books until you say yes."** Trust message. Matches the payer's "yes book" and passkey gate.
3. **"Nobody's budget is shown to the group."** Privacy message. Go plans to the lowest private range.
4. **"One receipt. Nobody chases money."** Budget message.
5. **"Most group trips never leave the chat. Go gets them out."** Problem message. Use only as an unsourced voiceover claim, and never in a hook. Do not use "76%" as Go's own claim. See section 4.6.

### 4.6 The 76% statistic (checked)

The landing page's 76% figure traces to a Talker Research survey of 2,000 US women, commissioned by Discover Puerto Rico. It was reported in July 2026 through a CruiseHuddle press release and syndicated news coverage. Those reports also give 83 messages, about 19 hours of planning and 11 days of coordination per successful trip. I did not find the underlying report.

Implications:
- The sample is US women. Go's launch market is India (section 3.4). Using the stat as a headline would be a mismatch, and it carries a cruise-company framing.
- If used, attribute it fully ("Talker Research survey of 2,000 US women, 2026"), and get the CEO's approval first.
- Better: use Go's own pilot numbers (trips closed in chat per group) once the demo runs.

### 4.3 Messaging angles (test these)

| Angle | Hook | Best for |
|---|---|---|
| Stalled plan | "The trip has been 'soon' for three weeks." | Organiser, awareness |
| Money drama | "Nobody wants to be the one who chases."  | Member, consideration |
| Private budget | "Say your number. Only Go sees it." | Member, trust |
| Chat-native | "No new app for the group." | Everyone, install reduction |
| Demo honesty | "Try the full booking in demo. No money moves." | Early adopters, trial |

### 4.4 Tone

Follow `docs/DESIGN.md` section 3. Chat copy is lowercase and warm. Product and privacy copy is plain and calm. Never claim a live booking or payment in V1.

### 4.5 Words to avoid

- "Book real trips" or "book instantly" (V1 is demo).
- "Secure payments" without a qualifier (no money moves in V1).
- "Replaces your travel agent" (we are not a travel agency; avoid implied liability).
- "AI does everything" (the group still decides; Go suggests and waits).

---

## 5. Channels and sequencing

### 5.1 Channels

| Channel | Role | Phase |
|---|---|---|
| Landing page (vestrago.vercel.app) | Primary conversion: join waitlist or try demo | 0 to 3 |
| Invite link (the product itself) | Viral loop: organiser invites friends | 2 onward |
| Short-form video (Reels, Shorts, TikTok) | Awareness with the promo video and scripts | 1 to 3 |
| Founder and community posts (LinkedIn, X, relevant subreddits) | Early adopter feedback | 1 |
| Friend-group and creator seeding | Real trips, real chats | 2 |
| Travel and student-community partnerships | Scale, after V1 demo is stable | 3 |
| Paid social | Only after organic proves a hook | 4, optional |
| Email | Waitlist updates | 0 onward |

Every external channel needs CEO approval before any post goes live.

### 5.2 Sequencing

- **Phase 0: prepare (now to design lock).** Research, plan, scripts drafted internally. No posts.
- **Phase 1: design and scripts.** Designs first (per V1 order). Scripts written from approved screens.
- **Phase 2: promo video.** Video agent produces after design sign-off.
- **Phase 3: soft launch.** Waitlist, demo invite to 10 to 20 friend groups (CEO approval).
- **Phase 4: public launch.** Landing page, short-form video, community posts.
- **Phase 5: learn and iterate.** Weekly review of metrics; one new hook a week.

---

## 6. Content and video plan

Sequenced to V1 order: design first, then marketing content.

| # | Asset | Owner | Depends on | Notes |
|---|---|---|---|---|
| 1 | Brand and message brief (this doc, approved) | marketing-lead | CEO review | |
| 2 | Hero script (60 s) "your group chat, now with a planner" | marketing-script | Approved screens: trip room, decision card, ticket card, passkey confirmation | Uses messages 1 and 2. The passkey screen is needed for the "nothing books until you say yes" beat. |
| 3 | Privacy script (30 s) "nobody's budget is shown" | marketing-script | Budget, invite and private-budget (hidden from group) screens | Message 3. Lead with "Private budget"; the abstract "money drama" line needs a concrete scene. |
| 4 | Three 15 s cut-downs from "Stalled plan", "Money drama" and "Private budget" (not all five hooks) | marketing-script | Hero script | For social. "Chat-native" and "Demo honesty" go on end cards, not as openers. |
| 5 | Promo video, 60 s hero cut | marketing-video | Design sign-off, scripts approved | Use real screens only, mark demo status |
| 6 | Vertical social cuts (9:16) | marketing-video | Item 5 | |
| 7 | Landing page copy and hero | marketing-lead with design-lead | Scripts and screens | Needs CEO approval before publish |
| 8 | Demo walkthrough (screen recording) | marketing-video | Booking pipeline on fake ixigo working | Must show DEMO labels |

**Script inputs and turnaround** (from marketing-script, T-87; estimate, untested):
- Needs signed-off screens only, with full-resolution UI text, the DEMO ticket treatment and the DESIGN.md tone notes.
- Hero about 1 working day, privacy about 1 day, cut-downs about half a day after the hero is locked. About 3 working days including one revision, assuming no new claims or screen changes.
- Hinglish drafts need a native reviewer before anything ships.

**Rules for every asset:**
- Show screens as designed, and show the DEMO label on every ticket.
- Show Face ID or passkey step before any booking.
- Captions for every video.
- No real traveller names or real card details.
- CEO approval before any publish.

---

## 7. Launch milestones

These follow the V1 timeline and depend on dev and design progress. Dates are set by the CEO.

| Milestone | Exit criterion | Owner |
|---|---|---|
| M0: Plan approved | CEO approves this doc | marketing-lead |
| M1: Design lock | Trip Home, trip room, decision card, ticket card, budget, invite screens signed off | design-lead |
| M2: Scripts approved | Hero and privacy scripts approved | marketing-script, CEO |
| M3: Promo video v1 | 60 s hero cut reviewed | marketing-video |
| M4: Demo ready | Full booking pipeline on fake ixigo (V1 acceptance) | dev-lead |
| M5: Soft launch | Demo invites to 10 to 20 friend groups, feedback collected | marketing-lead, CEO |
| M6: Public launch | Landing page live, first short-form cut-downs posted | marketing-lead, CEO |
| M7: Review | First metrics review; decide next hooks | marketing-lead |

---

## 8. Metrics

### 8.1 North star

**Trips with a closed decision in chat** (a vote opened and closed by the group). This is the product's core behaviour.

### 8.2 Funnel

| Stage | Metric | Early target (soft launch) |
|---|---|---|
| Awareness | Landing page visits; video views and completion | Track baseline; no target until first week |
| Interest | Waitlist sign-ups or demo starts / visits | Set after first week of data |
| Activation | Trips started (six taps or one sentence) | Set after data |
| Invite | Members joined per trip (invite link used) | Average 4+ members per active trip |
| Decision | Votes closed per trip | At least one closed decision per trip |
| Booking (demo) | Demo bookings completed | Set after data |
| Retention | Second trip started by the same organiser | Set after data |

Targets are placeholders until M5 gives real data. Set them with the CEO.

### 8.3 Guardrails

- Zero reports of a booking or charge without approval.
- Zero private budgets or vault items shown to other members.
- Zero cross-group memory leaks.
- Unsubscribe and complaint rate on email and ads below an agreed threshold.

---

## 9. Budget

No budget is set. Office budget rules apply: $8 daily warning, $10 daily hard stop (`e42e3709`). Paid channels are off until phase 4 and need CEO approval.

---

## 10. Compliance and claims

- V1 is demo only. Every booking, ticket and payment is labelled DEMO in product and in marketing.
- Do not show a live price as current unless it is live. Prices carry a checked-at time (PRD 7.3).
- Calls: Go discloses it is an AI on every call. Marketing does not show calls in V1 unless the feature is live (`CALLS_MODE=off` by default).
- Testimonials and creator content need written consent and no real traveller data.
- Use of third-party brands (ixigo, airline logos, Splitwise, WhatsApp) in marketing needs legal review. **[confirm with CEO]**.
- Privacy: never say "shared with the group" about private budgets or vault contents.

---

## 11. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Marketing claims outrun the V1 demo | High | High | Gate every asset on built screens; DEMO labelling; claims review |
| Competitor or WhatsApp copies the bot idea | Medium | Medium | Lead with privacy and passkey gate; ship the trip-level structure |
| Trust in AI spending money is low | High | High | Passkey gate in every booking visual; "nothing books until you say yes" |
| Cold start: friends must all join | High | High | Invite-link onboarding in three taps; seed with real friend groups |
| Unverified or mismatched stats in copy | Medium | High | 76% is a US-women survey; do not use as Go's claim without attribution and approval |
| Ixigo page changes break the demo | Medium | Medium | No ixigo-specific claims beyond the demo; fake ixigo for demos |
| Scope creep from stretch items (WhatsApp nudges, voice notes) | Medium | Medium | Market only V1 features |
| Budget overrun on paid channels | Low | Medium | Paid is off until phase 4; daily budget caps |

---

## 12. Open items and checks

Needed before this plan is final:

1. Re-check competitor prices on each product's own pricing page (review-site prices vary by source). Add ixigo to the set.
2. Channel evidence: still open. Find recent, dated data on where Indian friend groups plan trips, and on short-form video reach for travel. Not yet researched.
3. Decide whether the landing page's 76% claim is replaced or attributed (section 4.6).
5. Legal review of third-party brand use in marketing.
6. CEO sets launch dates and metric targets (section 8).
7. Confirm which of the 38 screens are V1 (PRD open question 1), so the content plan uses only real screens.

---

## 13. Decisions requested from the CEO

1. Approve this plan as the basis for design-sync and scripts (phase 1).
2. Approve the web access needed for the research checks in section 12.
3. Confirm whether the launch targets urban India only, or also the wider English-speaking market.
4. Confirm the public-posting rule: each post or ad needs individual approval.
