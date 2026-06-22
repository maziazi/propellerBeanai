import type {
  MindResult,
  DiscussionMessage,
  EmergentInsight,
  MergeSynthesis,
  GraphNode,
  GraphEdge,
  AnalysisRecord,
} from './types'

export const DEMO_QUESTION = 'Should I pivot to B2B SaaS?'

export const MOCK_MIND_RESULTS: Record<string, MindResult> = {
  fact: {
    mindKey: 'fact',
    content: `The B2B SaaS market reached **$197 billion** in 2023 and is projected to grow at 18.7% CAGR through 2028 (Gartner). Key data points:

- Average B2B SaaS company achieves 110–130% net revenue retention when product-market fit is established
- Median time to first $1M ARR is 18–24 months for funded startups; 28–36 months for bootstrapped
- Churn rates: best-in-class B2B SaaS targets < 5% annual churn vs. B2C at 20–40%
- CAC:LTV ratio should exceed 3:1; top quartile companies achieve 5:1+
- 67% of SaaS founders who pivoted from B2C to B2B reported improved unit economics within 12 months (SaaS Capital 2023)

Your current traction of **2,400 MAUs** in the consumer product translates to roughly 40–80 potential SMB prospects if conversion rates match industry benchmarks (Andreessen Horowitz B2B Conversion Report).`,
    sources: [
      { title: 'Gartner SaaS Market Forecast 2024', url: 'https://gartner.com', verified: true },
      { title: 'SaaS Capital Annual Survey 2023', url: 'https://saascapital.com', verified: true },
      { title: 'a16z B2B Conversion Benchmarks', url: 'https://a16z.com', verified: true },
      { title: 'OpenView SaaS Benchmarks', url: 'https://openviewpartners.com', verified: false },
    ],
    isExpanded: true,
  },
  feel: {
    mindKey: 'feel',
    content: `There's something real here — the **exhaustion** of fighting for attention in a crowded consumer space is palpable. When you talk about this pivot, there's genuine energy, not just logic.

B2C is emotionally draining: thousands of users who pay nothing, churn silently, and never tell you why. B2B feels different — fewer customers, but real conversations. Contracts. Commitment.

However, I sense **fear underneath the excitement**. The fear that B2B sales cycles will feel slow and bureaucratic. That you'll miss the dopamine of rapid consumer growth. That enterprise means losing your soul.

Pay attention to this: which path, when you imagine yourself doing it for 3 years, makes you feel *proud* rather than just successful? That answer matters more than any market size number.

The gut says: you've been ready for this shift for 6 months. Stop gathering data. The hesitation is protecting you from a bet you actually want to make.`,
    sources: [],
    isExpanded: false,
  },
  risk: {
    mindKey: 'risk',
    content: `Critical risks in this pivot that most analysis overlooks:

**1. Identity Crisis Risk (High)**
Pivoting from B2C to B2B mid-runway often creates a "nobody" problem — you're no longer a consumer company (lose community) but not yet a true B2B company (no sales infrastructure). 8 months of limbo can kill momentum.

**2. Talent Mismatch (Medium-High)**
Your current team was hired for product-led growth. B2B enterprise requires Account Executives, SDRs, and Customer Success Managers. Retraining has 60% failure rate; hiring takes 4–6 months.

**3. Sales Cycle vs. Runway (Critical)**
Enterprise contracts average 3–9 month close time. If runway is < 18 months, first B2B revenue may arrive too late. Seed-stage enterprise pivot has 34% failure rate within 24 months (FirstMark Capital).

**4. Hidden Assumption**
This analysis assumes your consumer users will convert to business buyers. Validate: have you spoken to 10+ potential B2B customers this month? If not, this is still a hypothesis.

**5. Competitor Response**
[REDACTED in Quick Scan — available in Full Analysis]`,
    sources: [
      { title: 'FirstMark Capital Pivot Study 2022', url: 'https://firstmark.com', verified: true },
      { title: 'Christoph Janz — Pivot Patterns', url: 'https://christophjanz.blogspot.com', verified: false },
    ],
    isExpanded: false,
  },
  gain: {
    mindKey: 'gain',
    content: `The upside here is significant and underappreciated:

**Immediate Opportunities:**

1. **Your Consumer Data = B2B Moat** — 2,400 MAUs means behavioral data that enterprise competitors don't have. This is a defensible wedge, not just a pivot.

2. **Bottom-Up PLG Entry** — Don't abandon your consumer users; convert power users into internal champions. Slack, Figma, Notion all did this. It costs $0 in CAC.

3. **Vertical SaaS Premium** — If you niche into a specific industry (e.g., hospitality, healthcare), average ACV jumps from $12K to $48K with no additional feature complexity (Bain & Company).

4. **Partnership Channels** — 3 integrations with existing enterprise software (Salesforce, HubSpot, Notion) could unlock **$200K+ in qualified pipeline** within 6 months.

5. **Grant Opportunities** — B2B SaaS companies in your vertical qualify for AWS Activate ($100K credits), Stripe Atlas benefits, and multiple accelerator programs that B2C doesn't access.

**Best-case scenario in 24 months:** $1.2M ARR, 85% gross margin, Series A ready.`,
    sources: [
      { title: 'Bain & Company Vertical SaaS Report', url: 'https://bain.com', verified: true },
      { title: 'Bessemer Venture Partners Cloud Report', url: 'https://bvp.com', verified: true },
    ],
    isExpanded: false,
  },
  wild: {
    mindKey: 'wild',
    content: `Contrarian take: **Don't pivot. Build a bridge.**

Everyone frames this as binary — B2C OR B2B. But the highest-value play might be **Prosumer SaaS**: a consumer product with B2B billing rails underneath.

Canva did this. Linear did this. Vercel is doing this right now.

**The Wild Move:** Instead of pivoting your product, pivot your *pricing model* this week. Add team seats, shared workspaces, and an invoice option to your current product. Zero code changes to features. Test B2B demand without rebuilding your identity.

If 3% of your 2,400 MAUs upgrade to a team plan at $79/month = **$5,688 MRR overnight**.

**Even Wilder:** What if the pivot isn't to B2B SaaS, but to **AI-native B2B infrastructure** — selling your product's underlying capability as an API to other developers? Your data moat becomes a platform moat. TAM expands from $197B to $450B+.

The most successful pivots aren't reversals — they're *expansions that feel like pivots to outsiders*.`,
    sources: [
      { title: 'Figma Prosumer Strategy Analysis', url: 'https://stratechery.com', verified: false },
    ],
    isExpanded: false,
  },
  merge: {
    mindKey: 'merge',
    content: `**Synthesis across all 6 minds:**

The evidence converges on a clear but nuanced recommendation. This is not a simple GO or NO — it's a structured conditional.

**Confidence: 74%** toward pivoting, but *only* with the following conditions met:

1. **Validate first (30 days):** Get 3 verbal commitments from potential B2B customers before changing anything in the product. Not interest — commitments.

2. **Don't abandon, expand:** As WILD correctly identified, add team billing infrastructure while keeping consumer product alive. Kill nothing until B2B shows 3 paying customers.

3. **Runway math must work:** RISK is right that 18 months minimum runway is required. If you're below that, raise a bridge round *before* pivoting, not after.

4. **Hire one AE first:** The talent mismatch risk is real. One experienced enterprise AE (even part-time) changes your probability of success from ~34% to ~62%.

**Verdict: WAIT — then GO**
Not because the opportunity is weak (GAIN is right, it's strong), but because the next 30 days of validation will dramatically reduce downside risk. The data supports this move. The timing must be earned.`,
    sources: [],
    isExpanded: true,
  },
}

export const MOCK_MESSAGES: DiscussionMessage[] = [
  {
    id: 'msg_001',
    from: 'fact',
    to: 'all',
    content: 'Opening position: B2B SaaS market fundamentals are strong. 18.7% CAGR with improving unit economics. The quantitative case for pivoting is clear.',
    type: 'statement',
    round: 1,
    timestamp: Date.now() - 600000,
  },
  {
    id: 'msg_002',
    from: 'risk',
    to: 'fact',
    content: 'Pushing back on FACT: market size is irrelevant if runway doesn\'t survive the sales cycle. With 3–9 month enterprise close times, this could be a race you lose before you start.',
    type: 'response',
    round: 1,
    timestamp: Date.now() - 540000,
  },
  {
    id: 'msg_003',
    from: 'feel',
    to: 'all',
    content: 'The energy I\'m picking up is fear disguised as analysis. The real question isn\'t "should I pivot" — it\'s "why haven\'t I already started selling to businesses?"',
    type: 'statement',
    round: 1,
    timestamp: Date.now() - 480000,
  },
  {
    id: 'msg_004',
    from: 'gain',
    to: 'risk',
    content: 'Responding to RISK\'s runway concern: the consumer-to-B2B bridge strategy eliminates this problem entirely. We don\'t need to choose. PLG motion keeps revenue flowing while enterprise pipeline builds.',
    type: 'response',
    round: 2,
    timestamp: Date.now() - 420000,
  },
  {
    id: 'msg_005',
    from: 'wild',
    to: 'all',
    content: 'Everyone\'s debating the wrong question. The pivot nobody\'s considering: what if the 2,400 consumer MAUs ARE the product? License that dataset to enterprise players. Zero sales cycle. Pure margin.',
    type: 'wildcard',
    round: 2,
    timestamp: Date.now() - 360000,
  },
  {
    id: 'msg_006',
    from: 'risk',
    to: 'wild',
    content: 'WILD\'s data licensing idea has merit but triggers GDPR/CCPA compliance overhead that could cost $80–150K to properly implement. Not zero friction.',
    type: 'response',
    round: 2,
    timestamp: Date.now() - 300000,
  },
  {
    id: 'msg_007',
    from: 'fact',
    to: 'wild',
    content: 'Corroborating WILD\'s prosumer insight: Figma, Linear, and Notion all grew to $50M+ ARR without ever formally "pivoting" — they just added team features and invoicing. The market validated it.',
    type: 'response',
    round: 3,
    timestamp: Date.now() - 240000,
  },
  {
    id: 'msg_008',
    from: 'feel',
    to: 'gain',
    content: 'GAIN\'s optimism is grounded — I can feel the genuine opportunity here. But I want to name the grief: this pivot means saying goodbye to the consumer community you built. That\'s a real loss worth acknowledging.',
    type: 'response',
    round: 3,
    timestamp: Date.now() - 180000,
  },
  {
    id: 'msg_009',
    from: 'merge',
    to: 'all',
    content: 'Pattern emerging: FACT + GAIN + WILD all converge on a "bridge strategy" rather than hard pivot. RISK\'s concerns are valid but solvable. FEEL identifies the psychological readiness factor as the true variable.',
    type: 'statement',
    round: 3,
    timestamp: Date.now() - 120000,
  },
  {
    id: 'msg_010',
    from: 'user',
    to: 'all',
    content: 'RISK, you mentioned 34% failure rate for seed-stage pivots. What specifically causes most of them to fail — is it really the sales cycle, or something else?',
    type: 'user_question',
    round: 3,
    timestamp: Date.now() - 90000,
  },
  {
    id: 'msg_011',
    from: 'risk',
    to: 'all',
    content: 'Great question. The top 3 failure causes are: (1) Founders underestimate how different B2B sales *motion* is from B2C growth — it\'s not faster loops, it\'s relationship-building over months. (2) First ACV is set too low out of desperation, creating a bad precedent. (3) Team culture clash — PLG engineers find enterprise "customization requests" soul-crushing. The runway math is actually the solvable one.',
    type: 'response',
    round: 3,
    timestamp: Date.now() - 60000,
  },
  {
    id: 'msg_012',
    from: 'user',
    to: 'wild',
    content: 'WILD, your API licensing idea sounds interesting. Can you give a concrete example of how that would work for a product like mine?',
    type: 'user_question',
    round: 3,
    timestamp: Date.now() - 30000,
  },
  {
    id: 'msg_013',
    from: 'wild',
    to: 'all',
    content: 'Concrete example: your behavioral data from 2,400 MAUs gets packaged as an API endpoint. Enterprise HR tools, CRM platforms, or analytics companies pay $0.001–0.01 per API call. At 1M calls/month (small for enterprise), that\'s $1K–$10K MRR from a single integration. You\'re not a SaaS company anymore — you\'re infrastructure. Stripe started as "just an API for payments." The constraint is getting one lighthouse enterprise customer to prove the model.',
    type: 'response',
    round: 3,
    timestamp: Date.now() - 10000,
  },
]

export const MOCK_EMERGENT_INSIGHTS: EmergentInsight[] = [
  {
    id: 'ei_001',
    content: 'FACT + WILD convergence: The prosumer pricing bridge (team seats on existing product) could generate $5K+ MRR within 30 days with zero feature development — a hypothesis neither mind raised independently.',
    involvedMinds: ['fact', 'wild'],
  },
  {
    id: 'ei_002',
    content: 'RISK + FEEL intersection: The primary blocker isn\'t market or product — it\'s the founder\'s psychological readiness for longer sales cycles. Addressing mindset before mechanics is the critical path.',
    involvedMinds: ['risk', 'feel'],
  },
  {
    id: 'ei_003',
    content: 'GAIN + MERGE synthesis: The 30-day validation window MERGE recommends isn\'t just risk mitigation — it\'s also the fastest way to unlock the partnership channels GAIN identified, turning validation into pipeline simultaneously.',
    involvedMinds: ['gain', 'merge'],
  },
]

export const MOCK_MERGE_SYNTHESIS: MergeSynthesis = {
  content: `After cross-mind deliberation across 3 rounds, the synthesis is clear: this is a structurally sound pivot opportunity being held back by solvable execution risks.

The consumer-to-B2B bridge strategy (not a hard pivot) resolves the runway tension RISK identified. The 30-day customer validation sprint MERGE recommends doubles as the pipeline-building moment GAIN outlined.

The single most important action: get 3 verbal B2B commitments this month. Everything else is downstream of that signal.`,
  confidence: 74,
  verdict: 'WAIT',
  actions: [
    'Run 30-day B2B validation: get 3 verbal commitments from potential customers',
    'Add team billing infrastructure to existing product (2-week engineering sprint)',
    'Identify and hire/contract one experienced enterprise AE within 60 days',
    'Audit runway: if < 18 months, initiate bridge raise before pivoting',
    'Map top 3 integration partners (Salesforce, HubSpot, Notion) for channel leverage',
  ],
}

export const MOCK_GRAPH_NODES: GraphNode[] = [
  { id: 'q1', label: 'Pivot to B2B SaaS?', type: 'initial', position: { x: 400, y: 50 } },
  { id: 'fact1', label: 'Market: $197B, 18.7% CAGR', type: 'source', mindKey: 'fact', position: { x: 100, y: 200 } },
  { id: 'fact2', label: '2,400 MAUs → 40–80 B2B prospects', type: 'source', mindKey: 'fact', position: { x: 100, y: 320 } },
  { id: 'feel1', label: 'Founder readiness signal', type: 'source', mindKey: 'feel', position: { x: 700, y: 200 } },
  { id: 'risk1', label: 'Runway vs. sales cycle', type: 'conflict', mindKey: 'risk', position: { x: 250, y: 420 } },
  { id: 'risk2', label: 'Talent mismatch risk', type: 'conflict', mindKey: 'risk', position: { x: 100, y: 500 } },
  { id: 'gain1', label: 'PLG → Enterprise bridge', type: 'source', mindKey: 'gain', position: { x: 550, y: 320 } },
  { id: 'gain2', label: '$1.2M ARR potential (24mo)', type: 'source', mindKey: 'gain', position: { x: 700, y: 420 } },
  { id: 'wild1', label: 'Prosumer pricing wedge', type: 'emergent', mindKey: 'wild', position: { x: 400, y: 350 } },
  { id: 'merge1', label: 'WAIT → GO (30-day gate)', type: 'initial', mindKey: 'merge', position: { x: 400, y: 580 } },
  { id: 'ei1', label: 'Emergent: Bridge Strategy', type: 'emergent', position: { x: 400, y: 470 } },
]

export const MOCK_GRAPH_EDGES: GraphEdge[] = [
  { id: 'e1', source: 'q1', target: 'fact1', type: 'solid', mindKey: 'fact' },
  { id: 'e2', source: 'q1', target: 'feel1', type: 'solid', mindKey: 'feel' },
  { id: 'e3', source: 'q1', target: 'risk1', type: 'solid', mindKey: 'risk' },
  { id: 'e4', source: 'q1', target: 'gain1', type: 'solid', mindKey: 'gain' },
  { id: 'e5', source: 'q1', target: 'wild1', type: 'solid', mindKey: 'wild' },
  { id: 'e6', source: 'fact1', target: 'fact2', type: 'solid', mindKey: 'fact' },
  { id: 'e7', source: 'gain1', target: 'gain2', type: 'solid', mindKey: 'gain' },
  { id: 'e8', source: 'risk1', target: 'risk2', type: 'dashed', mindKey: 'risk' },
  { id: 'e9', source: 'wild1', target: 'ei1', type: 'dashed' },
  { id: 'e10', source: 'fact2', target: 'ei1', type: 'dashed', mindKey: 'fact' },
  { id: 'e11', source: 'gain1', target: 'ei1', type: 'dashed', mindKey: 'gain' },
  { id: 'e12', source: 'ei1', target: 'merge1', type: 'solid', mindKey: 'merge' },
  { id: 'e13', source: 'risk1', target: 'merge1', type: 'solid', mindKey: 'risk' },
  { id: 'e14', source: 'feel1', target: 'merge1', type: 'solid', mindKey: 'feel' },
]

export const MOCK_HISTORY: AnalysisRecord[] = [
  { id: 'demo-001', question: 'Should I pivot to B2B SaaS?', type: 'quick', confidence: 74, createdAt: Date.now() - 3600000 },
  { id: 'pbai_r_abc123', question: 'Open a restaurant in Bali', type: 'full', confidence: 61, createdAt: Date.now() - 86400000 },
  { id: 'pbai_r_def456', question: 'Should I quit my job?', type: 'quick', confidence: 55, createdAt: Date.now() - 172800000 },
  { id: 'pbai_r_ghi789', question: 'Launch new product line in Q3', type: 'full', confidence: 82, createdAt: Date.now() - 259200000 },
  { id: 'pbai_r_jkl012', question: 'Hire 5 engineers or outsource?', type: 'quick', confidence: 68, createdAt: Date.now() - 432000000 },
]
