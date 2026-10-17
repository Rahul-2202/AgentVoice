# Go: Design Guide (V1)

Status: Draft v0.1, for design-lead review
Owner: product-manager (design-lead owns the visual system)
Source: vestrago.vercel.app and vestra.ai. The Go spec was not accessible, so screen-level detail is **[confirm against spec]**.

---

## 1. Design principles

1. **Calm return to "done".** Every screen should make the next step obvious and the trip feel settled.
2. **Chat first.** The trip room is the home. Other screens support it.
3. **Outcomes, not instructions.** Show results (a ticket, a total, a vote closed), not forms of setup.
4. **Visible money, visible decisions.** Prices always show a live check time. Who pays and who decided is always shown.
5. **Private stays private.** Budgets and vault items are never shown to other members.
6. **Warm, not loud.** Playful in chat, plainspoken in product copy, reassuring about privacy.

## 2. Reference sites

Use these as the primary references. Design-lead should study them before producing screens.

- **vestra.ai** (parent company). Design format to follow for brand, tone and layout.
  - Large bold headlines, one word in italic for emphasis.
  - Long single-column sections with a headline, short subhead, and a stacked list.
  - Feature sections alternate copy with a product mockup.
  - Generous whitespace between sections, full-width imagery.
  - Image-topped cards for features; bordered tiles for use cases.
  - Primary button "Get started", secondary "Book a call".
  - Small uppercase status labels ("RUNNING", "DONE", "NEEDS YOU").
  - Confident, short, verb-led copy with sentence fragments.
  - Vestra mark (SVG) to the left of the wordmark in the header and footer.
- **vestrago.vercel.app** (Go landing page). Product reference for screens and flows.
  - Phone mockups in iPhone frames with 9:41 status bars, beside copy.
  - Chat bubbles with avatars and reactions.
  - Ticket-style booking cards with airline logos.
  - Receipt-style budget page.
  - Map snippets in the itinerary.
  - Go shown as a friendly mascot face.
  - Chat copy in lowercase with emojis; product copy plainspoken.

**Inferred, not confirmed:** The vestra.ai page shows no hex values or font names. Colours and typefaces below are provisional. Design-lead should get the exact palette and fonts from the parent brand before the system is locked.

## 3. Brand and tone

| Context | Tone | Example |
|---|---|---|
| Trip room chat (Go) | Warm, casual, lowercase, emoji allowed | "ok, 3 votes in. booking tonight?" |
| Product copy | Plainspoken, short, reassuring | "Nothing books until you say yes." |
| Privacy and money | Calm, exact, no jargon | "Confirm with your passkey on the vault page. Nothing is charged until you do." |
| Errors | Direct, one next step | "That price changed. Check again?" |

Go's two personas: **Go** (the doer, runs bookings and plans) and **Nami** (the keeper, remembers member facts). Keep them distinct in copy and in iconography.

## 4. Colour (provisional)

Vestra imagery suggests warm gold, wheat and dusk tones, with sky blue in footers. Values below are placeholders until the brand palette is confirmed.

| Token | Use | Provisional value |
|---|---|---|
| `color.brand.gold` | Primary accent, primary buttons | `#C9A227` |
| `color.brand.wheat` | Secondary surfaces, cards | `#F3E9D2` |
| `color.brand.dusk` | Headlines, dark surfaces | `#2B2433` |
| `color.brand.sky` | Info, links, footer | `#8EC5E8` |
| `color.neutral.900` | Body text | `#1C1C1E` |
| `color.neutral.500` | Secondary text, timestamps | `#6E6E73` |
| `color.neutral.100` | Page background | `#FFFFFF` |
| `color.status.success` | Booked, done | `#2E7D4F` |
| `color.status.warning` | Needs you, price changed | `#B26A00` |
| `color.status.danger` | Failed booking, error | `#B3261E` |

Rules:
- Contrast of text on any background must meet WCAG AA (4.5:1 body, 3:1 large).
- Status colours are never the only signal; pair with an icon and label.
- Dark mode: define once the palette is confirmed.

## 5. Typography (provisional)

Font family not confirmed. Use a single geometric or grotesque sans for UI and headlines; reserve italic for one emphasised word per headline, as on vestra.ai.

| Style | Size / line height | Weight | Use |
|---|---|---|---|
| Display | 48 / 52 | Bold | Landing headlines |
| H1 | 32 / 38 | Bold | Screen titles (Trip Home) |
| H2 | 24 / 30 | Semibold | Section titles |
| Body | 16 / 24 | Regular | Chat, copy |
| Small | 14 / 20 | Regular | Timestamps, meta |
| Label | 12 / 16, uppercase, tracked | Semibold | Status labels, trip header |

## 6. Layout and spacing

- 4 px base grid. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Mobile first. Trip room is a single column with a bottom input bar.
- Desktop landing uses the vestra.ai pattern: single column, generous vertical rhythm (64 to 96 px between sections).
- Phone mockups on the landing page use iPhone frames with 9:41 status bars.

## 7. Components

### 7.1 Chat bubble
- Avatar, name, timestamp, body, reactions row.
- Go's messages use the Go mascot avatar and a distinct bubble tint (`color.brand.wheat`).
- @mentions highlighted in `color.brand.gold` text.

### 7.2 Decision card (vote)
- Title, options with live prices, checked-at timestamp.
- Vote buttons; closed state shows the decided option and who voted.
- Closed decisions are read-only.

### 7.3 Ticket card (booking)
- Airline or provider logo, route or stay name, dates, status label (BOOKED, PENDING, NEEDS YOU).
- Checked-in state shown when applicable.
- Tapping opens the ticket details.

### 7.4 Budget receipt
- Receipt-style layout: line items, categories, total.
- "Who owes whom" section with UPI pay action per debt.
- Private budget ranges never appear here.

### 7.5 Vault
- Locked state shows a passkey prompt (Face ID or fingerprint) on the vault page. Contents hidden until success.
- Cards and logins shown only to the owner.

### 7.6 Buttons
- Primary: "Get started", "Yes, book", "Vote". Filled `color.brand.gold`.
- Secondary: "Book a call", "Not now". Outline.
- Money-moving actions always require the payer's passkey confirmation on the vault page.

### 7.7 Inline controls
- "Approve" / "Hold" on decisions; "Handle it" / "Not now" on Go's suggestions.

### 7.8 Keyboard chips
- Used only in demo UI, not in product screens.

## 8. Screens

Trip Home, Itinerary, Bookings, Budget, trip room, Vault, invite landing, decision and booking flows. Full list of 38 screens: `/screens` on vestrago.vercel.app. **[confirm against spec]** which are V1.

Each screen needs:
- Empty state
- Loading state (live price fetch)
- Error state (booking failed, price changed, passkey failed)
- Success state

## 9. Motion

- Keep motion short (150 to 250 ms).
- Use motion to show progress during live search and booking.
- Respect reduced-motion settings.

## 10. Accessibility

- WCAG AA contrast.
- Touch targets at least 44 by 44 px.
- Every status has text and an icon, not colour alone.
- Chat messages readable by screen readers, with sender and time.

## 11. Deliverables for design-lead

1. Final palette and typography, confirmed with the parent brand.
2. Component library covering section 7.
3. Screens for every V1 screen in section 8, with all four states.
4. Landing page sections mirroring vestra.ai format for Go.
5. Handoff notes per screen for dev-lead.

Design-lead creates Linear tickets for each deliverable above.

## 12. Open questions

1. Exact brand hex values and font family from vestra.ai.
2. Dark mode in V1 or later?
3. Is the Go mascot final artwork or placeholder?
4. Which of the 38 screens are V1?
