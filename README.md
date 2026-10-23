# SignalMerch

SignalMerch is a portfolio-stage lead-discovery application for promotional-products and branded-apparel teams. It turns timely Southern California business and event signals into a reviewable opportunity queue.

## Business Problem

Merchandise sellers often learn about openings, acquisitions, tournaments, festivals, and growth events after buyers have already selected a vendor. Manually monitoring local news is slow, inconsistent, and difficult to turn into a repeatable sales workflow.

## Solution

SignalMerch runs a targeted Google News search through SerpApi, converts recent results into structured opportunities, assigns a transparent rule-based fit score, and gives a user lightweight saved/contacted workflow tools. Demo records keep the interface explorable without an API key; live scans require a user-provided SerpApi credential.

## Technical Implementation

- Next.js 16, React 19, TypeScript, and CSS
- vinext/Vite build targeting a Cloudflare-compatible runtime
- Server-side SerpApi request so the credential is never exposed to the browser
- Client-side filtering and localStorage persistence for saved leads
- Source and contact-research links for human verification
- Node test runner and ESLint for basic verification

```text
Browser UI -> /api/search -> SerpApi Google News results
     |                            |
     +-> filters/status           +-> normalized lead records
     +-> localStorage shortlist   +-> source URLs for review
```

## Business Value

The prototype demonstrates how a marketing or sales team could reduce manual monitoring, prioritize time-sensitive triggers, and create a consistent research-to-outreach handoff. Any revenue or pipeline impact would need to be measured in a real deployment.

## My Role

The project owner defined the business problem, target signals, Southern California search strategy, qualification workflow, and desired user experience. The application was implemented and iterated with AI-assisted development tools, with the owner directing requirements, testing behavior, and integration choices. This repository does not claim that every line was independently hand-coded without AI assistance.

## Verified Results

- The application builds successfully with the documented toolchain.
- Live search code calls SerpApi only from the server route.
- Saved-lead state persists locally in the browser.
- Source and contact-research actions are implemented.
- Dashboard quantities and dollar figures shown in the seeded UI are illustrative demo data, not measured business outcomes.

## Setup

Prerequisites: Node.js 22.13 or later and a SerpApi key for live discovery.

```bash
npm install
cp .env.example .env.local
# Replace the placeholder in .env.local with your own key.
npm run dev
```

Open the local URL printed by the development server. Without `SERPAPI_KEY`, the interface remains usable with demo records, while a scan returns a configuration message.

## Commands

```bash
npm run dev      # local development
npm run build    # production build
npm test         # build and smoke tests
npm run lint     # static analysis
```

## Environment

| Variable | Required | Purpose |
| --- | --- | --- |
| `SERPAPI_KEY` | Live scans only | Server-side access to SerpApi search results |

Never commit a populated environment file. `.env.example` contains a placeholder only.

## Demo and Screenshots

Run `npm run dev` to explore the seeded interface. For a portfolio walkthrough, show the opportunity feed, run a live scan with your own key, save a lead, and use the source/contact actions while explaining that every result requires human qualification.

## Known Limitations

- Rule-based scoring is a prioritization aid, not an AI prediction or proof of purchase intent.
- Live discovery currently uses one fixed Southern California news query.
- Saved state is device-local; there is no shared account database.
- Contact discovery opens a search rather than enriching or emailing a person automatically.
- Seeded companies, usage counts, pipeline values, and performance deltas are demo content.

## Project Status

Portfolio prototype. Suitable for demonstrating workflow design and API integration, but not presented as a production sales system.
