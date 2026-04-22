import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import { Plus, Minus, Maximize2, RotateCcw, X, ExternalLink, Search, ArrowLeft } from 'lucide-react';

/**
 * THE AI CAPITAL GRAPH
 * Interactive map of economic relationships across frontier AI companies.
 * Period: ChatGPT launch (Nov 2022) → April 21, 2026
 *
 * Sources are linked per-deal. Node size ≈ valuation/market cap (log scale).
 * Edge thickness ≈ deal magnitude (log scale). Arrows always point in the
 * direction capital flows: investor→recipient, customer→supplier for compute
 * and chip commitments, acquirer→target for M&A, lender→borrower for debt,
 * holder→company for equity stakes.
 */

// ————————————————————————————————————————————————
// DATA
// ————————————————————————————————————————————————

// Approx. valuations as of April 2026 (public market cap or last private round)
// Values in $B USD. Used for node sizing, not economic commentary.
const COMPANIES = [
  // Hyperscalers
  { id: 'microsoft', name: 'Microsoft', val: 3800, sector: 'hyperscaler', public: true },
  { id: 'google', name: 'Alphabet', val: 2400, sector: 'hyperscaler', public: true },
  { id: 'amazon', name: 'Amazon', val: 2500, sector: 'hyperscaler', public: true },
  { id: 'meta', name: 'Meta', val: 1700, sector: 'hyperscaler', public: true },

  // Chips
  { id: 'nvidia', name: 'NVIDIA', val: 4300, sector: 'chips', public: true },
  { id: 'broadcom', name: 'Broadcom', val: 1500, sector: 'chips', public: true },
  { id: 'tsmc', name: 'TSMC', val: 1000, sector: 'chips', public: true },
  { id: 'amd', name: 'AMD', val: 350, sector: 'chips', public: true },
  { id: 'asml', name: 'ASML', val: 400, sector: 'chips', public: true },
  { id: 'intel', name: 'Intel', val: 160, sector: 'chips', public: true },

  // Cloud / neocloud / networking
  { id: 'oracle', name: 'Oracle', val: 800, sector: 'cloud', public: true },
  { id: 'coreweave', name: 'CoreWeave', val: 40, sector: 'neocloud', public: true },
  { id: 'cisco', name: 'Cisco', val: 250, sector: 'networking', public: true },

  // AI labs (private)
  { id: 'openai', name: 'OpenAI', val: 852, sector: 'ai-lab', public: false },
  { id: 'anthropic', name: 'Anthropic', val: 380, sector: 'ai-lab', public: false },
  { id: 'xai', name: 'xAI', val: 250, sector: 'ai-lab', public: false, note: 'now SpaceX subsidiary (Feb 2026)' },
  { id: 'mistral', name: 'Mistral', val: 14, sector: 'ai-lab', public: false },
  { id: 'scale', name: 'Scale AI', val: 29, sector: 'ai-data', public: false },

  // Musk-sphere
  { id: 'spacex', name: 'SpaceX', val: 1250, sector: 'space-ai', public: false },
  { id: 'tesla', name: 'Tesla', val: 900, sector: 'automotive-ai', public: true },

  // Infrastructure JV
  { id: 'stargate', name: 'Stargate', val: 500, sector: 'jv', public: false, note: 'OpenAI/SoftBank/Oracle/MGX JV' },

  // Capital / investors
  { id: 'softbank', name: 'SoftBank', val: 200, sector: 'investor', public: true },
  { id: 'mgx', name: 'MGX', val: 100, sector: 'sovereign', public: false, note: 'Abu Dhabi sovereign AI fund' },
  { id: 'qatar', name: 'QIA', val: 50, sector: 'sovereign', public: false, note: 'Qatar Investment Authority' },
  { id: 'thrive', name: 'Thrive Capital', val: 20, sector: 'investor', public: false },
  { id: 'valor', name: 'Valor Equity', val: 15, sector: 'investor', public: false },
  { id: 'apollo', name: 'Apollo', val: 90, sector: 'investor', public: true },
  { id: 'fidelity', name: 'Fidelity', val: 60, sector: 'investor', public: false },
];

// Deal types
const TYPES = {
  investment: { label: 'Equity investment', color: '#5eead4' },
  'equity-stake': { label: 'Equity stake / warrants', color: '#86efac' },
  compute: { label: 'Compute commitment', color: '#f59e0b' },
  'chip-supply': { label: 'Chip supply', color: '#c084fc' },
  acquisition: { label: 'M&A / acquisition', color: '#f87171' },
  'jv-equity': { label: 'JV ownership', color: '#fbbf24' },
  debt: { label: 'Debt / financing', color: '#94a3b8' },
};

// Sector colors for nodes
const SECTOR_COLORS = {
  hyperscaler: '#60a5fa',
  chips: '#c084fc',
  cloud: '#fbbf24',
  neocloud: '#fb923c',
  networking: '#a3a3a3',
  'ai-lab': '#f472b6',
  'ai-data': '#ec4899',
  'space-ai': '#fb7185',
  'automotive-ai': '#fb7185',
  jv: '#facc15',
  investor: '#34d399',
  sovereign: '#10b981',
};

// Deals — every material publicly disclosed commitment from ChatGPT → Apr 2026
// value = $B. dir = arrow direction: 'right' = from→to, 'left' = reverse
// (most flow capital from 'from' → 'to'; supply flows supplier→customer)
const DEALS = [
  // ——— OpenAI ↔ Microsoft
  {
    id: 'msft-openai-2019-2023', from: 'microsoft', to: 'openai', value: 13, type: 'investment',
    year: 2023, date: 'Jan 2023',
    title: 'Microsoft "third phase" investment (cumulative ~$13B by restructuring)',
    note: '$1B in 2019, ~$2B through 2022, $10B Jan 2023 — part cash, part Azure credits.',
    source: 'https://fortune.com/2023/01/23/microsoft-investing-10-billion-open-ai-chatgpt/',
  },
  {
    id: 'msft-openai-stake-2025', from: 'microsoft', to: 'openai', value: 135, type: 'equity-stake',
    year: 2025, date: 'Oct 2025',
    title: 'Microsoft 27% stake in OpenAI Group PBC (~$135B)',
    note: 'Crystallized when OpenAI recapitalized into a Public Benefit Corp. Ended Microsoft exclusive cloud rights.',
    source: 'https://www.cnbc.com/2025/10/28/open-ai-for-profit-microsoft.html',
  },

  // ——— OpenAI → NVIDIA (chips) + NVIDIA → OpenAI (equity)
  {
    id: 'nvda-openai-inv', from: 'nvidia', to: 'openai', value: 100, type: 'investment',
    year: 2025, date: 'Sep 2025',
    title: 'NVIDIA — up to $100B LOI (not yet definitive)',
    note: 'Investment vests as each of 10GW of NVIDIA systems comes online. Jensen called it "the biggest AI infrastructure project in history."',
    source: 'https://openai.com/index/openai-nvidia-systems-partnership/',
  },
  {
    id: 'openai-nvda-chips', from: 'openai', to: 'nvidia', value: 500, type: 'chip-supply',
    year: 2025, date: 'Sep 2025',
    title: '10GW of NVIDIA Vera Rubin systems (~millions of GPUs)',
    note: 'First GW online H2 2026. Analysts estimate ~$500B in NVIDIA revenue if fully deployed.',
    source: 'https://nvidianews.nvidia.com/news/openai-and-nvidia-announce-strategic-partnership-to-deploy-10gw-of-nvidia-systems',
  },

  // ——— OpenAI ↔ AMD
  {
    id: 'amd-openai-chips', from: 'openai', to: 'amd', value: 90, type: 'chip-supply',
    year: 2025, date: 'Oct 2025',
    title: 'AMD — 6GW of Instinct MI450+ GPUs over multiple generations',
    note: 'First 1GW deploys H2 2026. AMD called the opportunity "tens of billions" in revenue; analysts peg ~$90B cumulative hardware.',
    source: 'https://openai.com/index/openai-amd-strategic-partnership/',
  },
  {
    id: 'amd-openai-warrants', from: 'openai', to: 'amd', value: 96, type: 'equity-stake',
    year: 2025, date: 'Oct 2025',
    title: 'AMD warrants → OpenAI for up to 160M shares (~10% of AMD) at $0.01',
    note: 'Vests in tranches tied to deployment milestones + AMD share-price targets (up to $600). At target, worth ~$96B.',
    source: 'https://ir.amd.com/news-events/press-releases/detail/1260/amd-and-openai-announce-strategic-partnership-to-deploy-6-gigawatts-of-amd-gpus',
  },

  // ——— OpenAI ← Oracle
  {
    id: 'oracle-openai', from: 'openai', to: 'oracle', value: 300, type: 'compute',
    year: 2025, date: 'Jul–Sep 2025',
    title: 'Oracle — $300B / 4.5GW / 5-yr cloud deal, starting 2027',
    note: 'One of the largest cloud contracts ever signed. ~$60B/yr commit. Flagship Abilene TX campus already live on GB200.',
    source: 'https://openai.com/index/five-new-stargate-sites/',
  },

  // ——— OpenAI ↔ Broadcom (custom silicon)
  {
    id: 'avgo-openai', from: 'openai', to: 'broadcom', value: 60, type: 'chip-supply',
    year: 2025, date: 'Oct 2025',
    title: 'Broadcom — 10GW of OpenAI-designed custom accelerators',
    note: 'OpenAI designs; Broadcom fabricates and integrates w/ Ethernet networking. First systems H2 2026; full rollout through 2029.',
    source: 'https://openai.com/index/openai-and-broadcom-announce-strategic-collaboration/',
  },

  // ——— OpenAI ← SoftBank
  {
    id: 'sftb-openai', from: 'softbank', to: 'openai', value: 40, type: 'investment',
    year: 2025, date: 'Mar–Dec 2025',
    title: 'SoftBank — $40B (completed Dec 2025) at $300B val',
    note: 'Largest private tech funding round on record. ~$10B syndicated out. SoftBank now ~11% of OpenAI.',
    source: 'https://www.cnbc.com/2025/03/31/openai-closes-40-billion-in-funding-the-largest-private-fundraise-in-history-softbank-chatgpt.html',
  },

  // ——— OpenAI ← Amazon
  {
    id: 'amzn-openai', from: 'openai', to: 'amazon', value: 38, type: 'compute',
    year: 2025, date: 'Nov 2025',
    title: 'AWS — $38B 7-year compute deal',
    note: 'First AWS contract. Hundreds of thousands of NVIDIA GPUs, option for tens of millions of CPUs. Full capacity target by end 2026.',
    source: 'https://www.cnbc.com/2025/11/03/open-ai-amazon-aws-cloud-deal.html',
  },

  // ——— CoreWeave ↔ OpenAI
  {
    id: 'crwv-openai', from: 'openai', to: 'coreweave', value: 22.4, type: 'compute',
    year: 2025, date: 'Mar–Sep 2025',
    title: 'CoreWeave — $22.4B compute stack ($11.9B + $4B + $6.5B)',
    note: 'Original 5-yr deal March 2025, expanded May, again in September. ~25% of CoreWeave\'s ~$88B backlog.',
    source: 'https://tomtunguz.com/openai-hardware-spending-2025-2035/',
  },
  {
    id: 'openai-crwv-stock', from: 'openai', to: 'coreweave', value: 0.35, type: 'equity-stake',
    year: 2025, date: 'Mar 2025',
    title: '$350M of CoreWeave stock granted to OpenAI pre-IPO',
    note: 'In addition to the $11.9B compute contract.',
    source: 'https://www.nextplatform.com/2025/03/11/what-a-tangled-openai-web-we-coreweave/',
  },

  // ——— OpenAI secondary + restructure round
  {
    id: 'secondary-openai-500b', from: 'thrive', to: 'openai', value: 6.6, type: 'investment',
    year: 2025, date: 'Oct 2025',
    title: '$6.6B employee secondary @ $500B valuation',
    note: 'Thrive + SoftBank + Dragoneer + MGX + T. Rowe Price. Made OpenAI the most valuable private company (briefly).',
    source: 'https://www.cnbc.com/2025/10/02/openai-share-sale-500-billion-valuation.html',
  },

  // ——— Stargate JV
  {
    id: 'stargate-openai', from: 'openai', to: 'stargate', value: 19, type: 'jv-equity',
    year: 2025, date: 'Jan 2025',
    title: 'OpenAI — 40% of Stargate JV ($19B commit)',
    note: 'Announced at White House Jan 21, 2025. $500B / 10GW US AI buildout by 2029.',
    source: 'https://en.wikipedia.org/wiki/Stargate_LLC',
  },
  {
    id: 'stargate-sftb', from: 'softbank', to: 'stargate', value: 19, type: 'jv-equity',
    year: 2025, date: 'Jan 2025',
    title: 'SoftBank — 40% of Stargate JV ($19B commit)',
    note: 'Masayoshi Son is chairman of Stargate LLC.',
    source: 'https://en.wikipedia.org/wiki/Stargate_LLC',
  },
  {
    id: 'stargate-oracle', from: 'oracle', to: 'stargate', value: 7, type: 'jv-equity',
    year: 2025, date: 'Jan 2025',
    title: 'Oracle — ~7% of Stargate JV',
    source: 'https://en.wikipedia.org/wiki/Stargate_LLC',
  },
  {
    id: 'stargate-mgx', from: 'mgx', to: 'stargate', value: 7, type: 'jv-equity',
    year: 2025, date: 'Jan 2025',
    title: 'MGX (Abu Dhabi) — ~7% of Stargate JV',
    source: 'https://en.wikipedia.org/wiki/Stargate_LLC',
  },

  // ——— Anthropic ← Amazon
  {
    id: 'amzn-anth-8b', from: 'amazon', to: 'anthropic', value: 8, type: 'investment',
    year: 2024, date: 'Sep 2023 – Nov 2024',
    title: 'Amazon — $8B cumulative (initial $4B Sep 2023 + $4B Nov 2024)',
    note: 'Established AWS as Anthropic\'s primary cloud + training partner. Trainium commitment was a key deal point.',
    source: 'https://www.anthropic.com/news/anthropic-amazon-trainium',
  },
  {
    id: 'amzn-anth-25b', from: 'amazon', to: 'anthropic', value: 25, type: 'investment',
    year: 2026, date: 'Apr 2026',
    title: 'Amazon — up to $25B more ($5B now + $20B milestone-tied)',
    note: 'Could take Amazon\'s total Anthropic position to $33B.',
    source: 'https://www.aboutamazon.com/news/company-news/amazon-invests-additional-5-billion-anthropic-ai',
  },
  {
    id: 'anth-amzn-compute', from: 'anthropic', to: 'amazon', value: 100, type: 'compute',
    year: 2026, date: 'Apr 2026',
    title: 'Anthropic — $100B+ / 10-yr commitment to AWS Trainium + 5GW',
    note: 'Locks Claude onto AWS custom silicon for the decade. Project Rainier is the anchor cluster.',
    source: 'https://www.aboutamazon.com/news/company-news/amazon-invests-additional-5-billion-anthropic-ai',
  },

  // ——— Anthropic ← Google
  {
    id: 'goog-anth', from: 'google', to: 'anthropic', value: 3, type: 'investment',
    year: 2024, date: '2023–2024',
    title: 'Google — $3B cumulative, ~10% stake',
    source: 'https://www.cnbc.com/2025/01/22/google-agrees-to-new-1-billion-investment-in-anthropic.html',
  },
  {
    id: 'goog-anth-2025', from: 'google', to: 'anthropic', value: 1, type: 'investment',
    year: 2025, date: 'Jan 2025',
    title: 'Google — additional $1B follow-on',
    source: 'https://techcrunch.com/2025/01/22/anthropic-reportedly-secures-an-additional-1b-from-google/',
  },
  {
    id: 'anth-goog-tpu-2025', from: 'anthropic', to: 'google', value: 30, type: 'compute',
    year: 2025, date: 'Oct 2025',
    title: 'Anthropic — up to 1M TPUs, >1GW capacity (tens of $B)',
    note: 'Largest TPU commitment ever made. Expands Claude training onto Google Ironwood TPUs.',
    source: 'https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services',
  },
  {
    id: 'anth-goog-tpu-2027', from: 'anthropic', to: 'google', value: 50, type: 'compute',
    year: 2026, date: 'Apr 2026',
    title: 'Anthropic — 3.5GW more TPU capacity starting 2027',
    note: 'Built by Broadcom for Google. Announced alongside $30B run-rate milestone.',
    source: 'https://www.anthropic.com/news/google-broadcom-partnership-compute',
  },

  // ——— Anthropic ← Microsoft + NVIDIA (Nov 2025 tripartite)
  {
    id: 'msft-anth', from: 'microsoft', to: 'anthropic', value: 5, type: 'investment',
    year: 2025, date: 'Nov 2025',
    title: 'Microsoft — up to $5B in Anthropic',
    source: 'https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/',
  },
  {
    id: 'nvda-anth', from: 'nvidia', to: 'anthropic', value: 10, type: 'investment',
    year: 2025, date: 'Nov 2025',
    title: 'NVIDIA — up to $10B in Anthropic (first deep partnership)',
    note: 'Tripartite deal with Microsoft. Pushed Anthropic valuation to ~$350B.',
    source: 'https://blogs.nvidia.com/blog/microsoft-nvidia-anthropic-announce-partnership/',
  },
  {
    id: 'anth-msft-azure', from: 'anthropic', to: 'microsoft', value: 30, type: 'compute',
    year: 2025, date: 'Nov 2025',
    title: 'Anthropic — $30B Azure compute + 1GW capacity',
    note: 'Makes Claude the only frontier model available on all three major clouds.',
    source: 'https://blogs.microsoft.com/blog/2025/11/18/microsoft-nvidia-and-anthropic-announce-strategic-partnerships/',
  },
  {
    id: 'anth-nvda-gpu', from: 'anthropic', to: 'nvidia', value: 50, type: 'chip-supply',
    year: 2025, date: 'Nov 2025',
    title: 'Anthropic — 1GW of NVIDIA Grace Blackwell + Vera Rubin',
    source: 'https://blogs.nvidia.com/blog/microsoft-nvidia-anthropic-announce-partnership/',
  },

  // ——— Meta ecosystem
  {
    id: 'meta-scale', from: 'meta', to: 'scale', value: 14.3, type: 'acquisition',
    year: 2025, date: 'Jun 2025',
    title: 'Meta — $14.3B for 49% of Scale AI (no voting)',
    note: 'Structured as acqui-hire. Alexandr Wang joined Meta as Chief AI Officer; Jason Droege promoted to Scale CEO.',
    source: 'https://scale.com/blog/scale-ai-announces-next-phase-of-company-evolution',
  },
  {
    id: 'meta-crwv-1', from: 'meta', to: 'coreweave', value: 14.2, type: 'compute',
    year: 2025, date: 'Sep 2025',
    title: 'Meta — $14.2B CoreWeave deal (through 2031)',
    note: 'Includes access to NVIDIA GB300 systems. Diversifies CoreWeave away from Microsoft concentration.',
    source: 'https://www.bloomberg.com/news/articles/2025-09-30/coreweave-inks-14-billion-meta-deal-in-latest-sign-of-ai-demand',
  },
  {
    id: 'meta-crwv-2', from: 'meta', to: 'coreweave', value: 21, type: 'compute',
    year: 2026, date: 'Apr 2026',
    title: 'Meta — additional $21B CoreWeave expansion (2027–2032)',
    note: 'Includes initial deployments of NVIDIA Vera Rubin. Meta now ~40% of CoreWeave\'s ~$88B backlog.',
    source: 'https://www.cnbc.com/2026/04/09/meta-commits-to-spending-additional-21-billion-with-coreweave-.html',
  },

  // ——— xAI capital stack
  {
    id: 'xai-series-e', from: 'valor', to: 'xai', value: 20, type: 'investment',
    year: 2026, date: 'Jan 2026',
    title: 'xAI Series E — $20B @ $230B val',
    note: 'Valor (lead), Fidelity, QIA, Baron, Stepstone, MGX, Cisco, NVIDIA. Upsized from $15B target.',
    source: 'https://siliconangle.com/2026/01/06/xai-raises-20b-funding-round-backed-nvidia-cisco/',
  },
  {
    id: 'nvda-xai-spv', from: 'nvidia', to: 'xai', value: 2, type: 'investment',
    year: 2025, date: 'Oct 2025',
    title: 'NVIDIA — $2B equity into xAI Colossus-2 SPV',
    note: 'Part of a $7.5B equity / $12.5B debt SPV that buys NVIDIA GPUs and leases them to xAI for 5 years.',
    source: 'https://invezz.com/news/2025/10/08/elon-musks-xai-secures-20b-boost-as-nvidia-apollo-and-valor-back-data-centre-expansion/',
  },
  {
    id: 'apollo-xai-debt', from: 'apollo', to: 'xai', value: 12.5, type: 'debt',
    year: 2025, date: 'Oct 2025',
    title: 'Apollo + Diameter — $12.5B GPU-backed debt (Colossus-2 SPV)',
    source: 'https://invezz.com/news/2025/10/08/elon-musks-xai-secures-20b-boost-as-nvidia-apollo-and-valor-back-data-centre-expansion/',
  },
  {
    id: 'tesla-xai', from: 'tesla', to: 'xai', value: 2, type: 'investment',
    year: 2026, date: 'Pending',
    title: 'Tesla — ~$2B committed (subject to shareholder vote)',
    source: 'https://sacra.com/c/xai/',
  },
  {
    id: 'xai-nvda-chips', from: 'xai', to: 'nvidia', value: 25, type: 'chip-supply',
    year: 2025, date: '2024–2026',
    title: 'xAI — GPUs for Colossus/Colossus 2 (~1M+ H100-equiv, scaling to 550k Rubin)',
    note: 'Colossus 2 targeted at ~2GW. xAI burning ~$1B/mo on compute buildout.',
    source: 'https://siliconangle.com/2026/01/06/xai-raises-20b-funding-round-backed-nvidia-cisco/',
  },
  {
    id: 'spacex-xai-prior', from: 'spacex', to: 'xai', value: 2, type: 'investment',
    year: 2024, date: '2024',
    title: 'SpaceX — prior direct investment in xAI',
    source: 'https://sacra.com/c/xai/',
  },
  {
    id: 'spacex-xai-acq', from: 'spacex', to: 'xai', value: 250, type: 'acquisition',
    year: 2026, date: 'Feb 2026',
    title: 'SpaceX acquires xAI — all-stock, $1.25T combined valuation',
    note: 'Largest M&A deal in history. Creates vertically-integrated "orbital AI" play ahead of SpaceX mid-2026 IPO.',
    source: 'https://www.cnbc.com/2026/02/03/musk-xai-spacex-biggest-merger-ever.html',
  },

  // ——— CoreWeave anchors
  {
    id: 'msft-crwv', from: 'microsoft', to: 'coreweave', value: 10, type: 'compute',
    year: 2023, date: '2023–',
    title: 'Microsoft — CoreWeave anchor customer (62–67% of revenue in 2024–25)',
    note: 'Originally signed to ensure GPU overflow capacity for OpenAI workloads on Azure.',
    source: 'https://mlq.ai/research/coreweave/',
  },
  {
    id: 'nvda-crwv-equity', from: 'nvidia', to: 'coreweave', value: 4, type: 'equity-stake',
    year: 2026, date: '2023–Jan 2026',
    title: 'NVIDIA — ~$4B cumulative in CoreWeave (incl. $2B Jan 2026)',
    note: 'NVIDIA held ~6% pre-IPO; added $250M in 2025 and another $2B in Jan 2026.',
    source: 'https://www.fool.com/investing/2026/04/14/5-reasons-investors-not-bet-against-coreweave/',
  },
  {
    id: 'nvda-crwv-spend', from: 'nvidia', to: 'coreweave', value: 6.3, type: 'compute',
    year: 2025, date: '2025',
    title: 'NVIDIA — $6.3B of CoreWeave services through 2032',
    note: 'NVIDIA purchases compute from its own major GPU customer — classic circular financing pattern.',
    source: 'https://www.fool.com/investing/2026/04/14/5-reasons-investors-not-bet-against-coreweave/',
  },

  // ——— NVIDIA → Intel
  {
    id: 'nvda-intel', from: 'nvidia', to: 'intel', value: 5, type: 'equity-stake',
    year: 2025, date: 'Sep–Dec 2025',
    title: 'NVIDIA — $5B / 4% of Intel @ $23.28/share',
    note: 'Announced Sep 2025, closed Dec 26 2025. Intel to build NVLink-integrated x86 CPUs + RTX-powered PC SoCs. Shares were up ~$37 on close.',
    source: 'https://nvidianews.nvidia.com/news/nvidia-and-intel-to-develop-ai-infrastructure-and-personal-computing-products',
  },

  // ——— Google-Broadcom TPU (ongoing)
  {
    id: 'goog-avgo-tpu', from: 'google', to: 'broadcom', value: 100, type: 'chip-supply',
    year: 2025, date: 'Long-term',
    title: 'Google → Broadcom — custom TPU manufacturing (multi-gen)',
    note: 'Broadcom CEO Hock Tan projects >$100B in AI chip revenue in 2027 alone from this class of customer.',
    source: 'https://www.theregister.com/2026/04/07/broadcom_google_chip_deal_anthropic_customer/',
  },

  // ——— Mistral capital
  {
    id: 'asml-mistral', from: 'asml', to: 'mistral', value: 1.5, type: 'investment',
    year: 2025, date: 'Sep 2025',
    title: 'ASML — €1.3B for ~11% of Mistral (Series C, $14B val)',
    note: 'First-of-its-kind strategic partnership: lithography maker invests in foundation model lab.',
    source: 'https://mistral.ai/news/mistral-ai-raises-1-7-b-to-accelerate-technological-progress-with-ai',
  },
  {
    id: 'nvda-mistral', from: 'nvidia', to: 'mistral', value: 0.3, type: 'investment',
    year: 2025, date: 'Sep 2025',
    title: 'NVIDIA — participation in Mistral Series C',
    source: 'https://siliconangle.com/2025/09/09/mistral-ai-raises-2b-led-chip-equipment-maker-asml-14b-valuation/',
  },

  // ——— OpenAI Mar 2026 round (memoryhole this was mentioned)
  {
    id: 'openai-122b', from: 'thrive', to: 'openai', value: 122, type: 'investment',
    year: 2026, date: 'Mar 2026',
    title: 'OpenAI — $122B round @ $852B valuation',
    note: 'Primary round preceding targeted late-2026 / early-2027 IPO (reportedly at $1T+).',
    source: 'https://intuitionlabs.ai/articles/oracle-openai-300b-deal-analysis',
  },

  // ——— Anthropic Series F/G
  {
    id: 'anth-series-f', from: 'fidelity', to: 'anthropic', value: 13, type: 'investment',
    year: 2025, date: 'Sep 2025',
    title: 'Anthropic Series F — $13B @ $183B val',
    note: 'Co-led by Iconiq, Fidelity, Lightspeed. QIA participated.',
    source: 'https://en.wikipedia.org/wiki/Anthropic',
  },
  {
    id: 'anth-series-g', from: 'fidelity', to: 'anthropic', value: 30, type: 'investment',
    year: 2026, date: 'Feb 2026',
    title: 'Anthropic Series G — $30B @ $380B val',
    source: 'https://en.wikipedia.org/wiki/Anthropic',
  },
];

// ————————————————————————————————————————————————
// UTILS
// ————————————————————————————————————————————————

const fmtB = (v) => (v >= 1 ? `$${v.toFixed(v >= 10 ? 0 : 1)}B` : `$${(v * 1000).toFixed(0)}M`);

// Size ranges compressed from the original version — a modest log curve keeps
// the "NVIDIA is enormous vs. Mistral is small" signal legible without shouting.
const nodeRadius = (val) => {
  if (!val) return 14;
  const r = 10 + 6 * Math.log10(Math.max(1, val));
  return Math.max(14, Math.min(32, r));
};

const edgeWidth = (val) => {
  const w = 0.8 + 0.9 * Math.log10(Math.max(1, val));
  return Math.max(1.2, Math.min(3.5, w));
};

// Muted defaults — color only surfaces when the user expresses intent
// (hover/select, a solo'd type filter, or a focused company).
const EDGE_NEUTRAL = '#3a4454';
const NODE_RING_NEUTRAL = '#2a3140';
const EDGE_OP_BASE = 0.45;
const EDGE_OP_HIGH = 0.9;
const EDGE_OP_DIM = 0.12;

// Mobile haptics — no-op on iOS Safari (vibrate disabled by Apple), functional
// on Android / Capacitor. Kept cheap so it never blocks interaction.
const haptic = (ms = 8) => {
  try { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms); } catch {}
};

// ————————————————————————————————————————————————
// HOOK
// ————————————————————————————————————————————————

function useMediaQuery(q) {
  const [m, setM] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(q).matches : false
  );
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(q);
    const h = (e) => setM(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [q]);
  return m;
}

// ————————————————————————————————————————————————
// COMPONENT
// ————————————————————————————————————————————————

export default function AICapitalMap() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 1000, h: 720 });

  // Hydrate from URL on first render. Invalid values are silently dropped.
  const initialUrlState = useMemo(() => {
    if (typeof window === 'undefined') return {};
    const q = new URLSearchParams(window.location.search);
    const out = {};
    const focus = q.get('focus');
    if (focus && COMPANIES.some(c => c.id === focus)) out.focusedCompany = focus;
    const typesRaw = q.get('types');
    if (typesRaw) {
      const validKeys = Object.keys(TYPES);
      const parsed = typesRaw.split(',').map(s => s.trim()).filter(t => validKeys.includes(t));
      if (parsed.length > 0) out.activeTypes = new Set(parsed);
    }
    const v = q.get('view');
    if (v === 'table' || v === 'graph') out.view = v;
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeTypes, setActiveTypes] = useState(() => initialUrlState.activeTypes || new Set(Object.keys(TYPES)));
  const [focusedCompany, setFocusedCompany] = useState(initialUrlState.focusedCompany || null);   // id | null
  const [detail, setDetail] = useState(null);                   // { kind, id } | null
  const [hovered, setHovered] = useState(null);                 // { kind, id } | null
  const [view, setView] = useState(initialUrlState.view || 'graph');
  const [searchOpen, setSearchOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  // Refs so d3 handlers always read the latest setters / focused id
  // without forcing a simulation rebuild.
  const simRef = useRef(null);
  const zoomRef = useRef(null);
  const zoomSvgRef = useRef(null);
  const positionsRef = useRef(new Map());
  const hoverSetRef = useRef(setHovered);
  const detailSetRef = useRef(setDetail);
  const focusSetRef = useRef(setFocusedCompany);
  const focusedRef = useRef(focusedCompany);
  hoverSetRef.current = setHovered;
  detailSetRef.current = setDetail;
  focusSetRef.current = setFocusedCompany;
  focusedRef.current = focusedCompany;

  // Inject fonts once
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Resize observer — rounds to integers and skips no-op updates.
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const cr = e.contentRect;
        const w = Math.max(320, Math.round(cr.width));
        const h = Math.max(420, Math.round(cr.height));
        setDims(prev => (prev.w === w && prev.h === h) ? prev : { w, h });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Lock body scroll while the mobile bottom sheet is open.
  useEffect(() => {
    if (!isMobile || !detail) return;
    const y = window.scrollY;
    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      window.scrollTo(0, y);
    };
  }, [isMobile, detail]);

  // ⌘K / Ctrl+K toggles the quick-jump search anywhere on the page.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  // Sync URL to state. replaceState so it doesn't clutter browser history.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = new URLSearchParams();
    if (focusedCompany) q.set('focus', focusedCompany);
    const allKeys = Object.keys(TYPES);
    if (activeTypes.size !== allKeys.length) {
      const ordered = allKeys.filter(k => activeTypes.has(k));
      if (ordered.length) q.set('types', ordered.join(','));
    }
    if (view !== 'graph') q.set('view', view);
    const qs = q.toString();
    const target = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    const current = window.location.pathname + window.location.search;
    if (target !== current) window.history.replaceState({}, '', target);
  }, [focusedCompany, activeTypes, view]);

  // Derived data — type filter combined with company focus (1-hop ego).
  const filteredDeals = useMemo(() => {
    let deals = DEALS.filter(d => activeTypes.has(d.type));
    if (focusedCompany) {
      deals = deals.filter(d => d.from === focusedCompany || d.to === focusedCompany);
    }
    return deals;
  }, [activeTypes, focusedCompany]);

  const activeNodeIds = useMemo(() => {
    const s = new Set();
    filteredDeals.forEach(d => { s.add(d.from); s.add(d.to); });
    if (focusedCompany) s.add(focusedCompany);   // keep visible even if isolated
    return s;
  }, [filteredDeals, focusedCompany]);

  const filteredNodes = useMemo(
    () => COMPANIES.filter(c => activeNodeIds.has(c.id)),
    [activeNodeIds]
  );

  // ——— D3 build effect
  useEffect(() => {
    if (view !== 'graph') return;
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = dims.w, h = dims.h;
    svg.attr('viewBox', `0 0 ${w} ${h}`);

    const positions = positionsRef.current;

    // In focus mode, arrange partners on a ring, grouped angularly by deal type.
    // Same-type edges then pull in nearly-parallel bundles — much easier to read.
    const focusTargets = new Map();  // nodeId -> { x, y }
    if (focusedCompany) {
      const partners = filteredNodes.filter(n => n.id !== focusedCompany);
      if (partners.length > 0) {
        const primaryType = new Map();  // partnerId -> deal type
        for (const p of partners) {
          const deals = filteredDeals.filter(d =>
            (d.from === focusedCompany && d.to === p.id) ||
            (d.from === p.id && d.to === focusedCompany)
          );
          if (deals.length === 0) continue;
          // Primary type = type of the biggest deal between focused and partner.
          const primary = deals.reduce((a, b) => (b.value > a.value ? b : a));
          primaryType.set(p.id, primary.type);
        }
        const typeOrder = Object.keys(TYPES);
        const groups = typeOrder
          .map(t => ({ t, ids: partners.filter(p => primaryType.get(p.id) === t).map(p => p.id) }))
          .filter(g => g.ids.length > 0);
        const total = groups.reduce((n, g) => n + g.ids.length, 0);
        const gapBetweenGroups = (total > 1 && groups.length > 1) ? 0.18 : 0;
        const totalGap = gapBetweenGroups * groups.length;
        const usable = 2 * Math.PI - totalGap;
        const ringR = Math.min(w, h) * 0.34;
        let current = -Math.PI / 2;  // start at top (12 o'clock)
        for (const g of groups) {
          const slice = (g.ids.length / total) * usable;
          for (let i = 0; i < g.ids.length; i++) {
            const frac = g.ids.length === 1 ? 0.5 : (i + 0.5) / g.ids.length;
            const theta = current + slice * frac;
            focusTargets.set(g.ids[i], {
              x: w / 2 + ringR * Math.cos(theta),
              y: h / 2 + ringR * Math.sin(theta),
            });
          }
          current += slice + gapBetweenGroups;
        }
        focusTargets.set(focusedCompany, { x: w / 2, y: h / 2 });
      }
    }

    const nodes = filteredNodes.map(n => {
      const target = focusTargets.get(n.id);
      const saved = positions.get(n.id);
      // In focus mode: seed x/y at the target position so the layout snaps
      // cleanly; force-x/y then hold it in place with some settling play.
      const x = target ? target.x : (saved?.x ?? w / 2 + (Math.random() - 0.5) * 120);
      const y = target ? target.y : (saved?.y ?? h / 2 + (Math.random() - 0.5) * 120);
      const out = { ...n, r: nodeRadius(n.val), x, y };
      if (target) { out._tx = target.x; out._ty = target.y; }
      // Pin the focused node at dead center.
      if (focusedCompany && n.id === focusedCompany) { out.fx = target.x; out.fy = target.y; }
      return out;
    });
    const nodeById = new Map(nodes.map(n => [n.id, n]));

    // Keep raw deal under `deal:` so React state never receives d3's mutated link.
    const links = filteredDeals.map(d => ({
      id: d.id,
      type: d.type,
      deal: d,
      source: nodeById.get(d.from),
      target: nodeById.get(d.to),
      w: edgeWidth(d.value),
    })).filter(l => l.source && l.target);

    // Single neutral arrow marker — inherits edge stroke via context-stroke.
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10).attr('refY', 0)
      .attr('markerWidth', 4).attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'context-stroke');

    // Capture rect — catches pan gestures on empty space and plain-click clears
    // focus+detail. Inside `viewport` go all the layers so they move with pan/zoom.
    const captureRect = svg.append('rect')
      .attr('class', 'capture-rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'transparent');

    const viewport = svg.append('g').attr('class', 'viewport');

    // Halos sit behind everything. Fade them out when a company is focused.
    const haloLayer = viewport.append('g')
      .attr('class', 'halos')
      .attr('pointer-events', 'none')
      .style('opacity', focusedRef.current ? 0 : 1);
    const linkLayer = viewport.append('g').attr('class', 'links');
    const nodeLayer = viewport.append('g').attr('class', 'nodes');
    const labelLayer = viewport.append('g').attr('class', 'labels').attr('pointer-events', 'none');

    // Zoom/pan behavior
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .filter((event) => {
        // Allow pan with primary button, pinch, wheel. Block right-click.
        if (event.type === 'mousedown') return event.button === 0;
        return true;
      })
      .on('zoom', (event) => {
        viewport.attr('transform', event.transform);
      });
    svg.call(zoom).on('dblclick.zoom', null);   // disable dblclick-to-zoom (conflicts with rapid tapping)
    zoomRef.current = zoom;
    zoomSvgRef.current = svg;

    // Clicks on empty space clear focus+detail. `defaultPrevented` is set by
    // d3-zoom after a real pan, so plain clicks still pass through.
    captureRect.on('click', (event) => {
      if (event.defaultPrevented) return;
      detailSetRef.current(null);
      focusSetRef.current(null);
    });

    // Links
    const linkSel = linkLayer.selectAll('path')
      .data(links, d => d.id)
      .enter().append('path')
      .attr('class', 'dlink')
      .attr('data-id', d => d.id)
      .attr('data-type', d => d.type)
      .attr('fill', 'none')
      .attr('stroke', EDGE_NEUTRAL)
      .attr('stroke-width', d => d.w)
      .attr('stroke-opacity', EDGE_OP_BASE)
      .attr('marker-end', 'url(#arrow)')
      .style('cursor', 'pointer')
      .on('click', (e, d) => {
        e.stopPropagation();
        haptic(8);
        detailSetRef.current({ kind: 'deal', id: d.id });
      });
    if (!isMobile) {
      linkSel
        .on('mouseenter', function (e, d) {
          hoverSetRef.current({ kind: 'deal', id: d.id });
          d3.select(this).transition().duration(140).ease(d3.easeCubicOut)
            .attr('stroke-width', d.w + 1.2);
        })
        .on('mouseleave', function (e, d) {
          hoverSetRef.current(null);
          d3.select(this).transition().duration(180).ease(d3.easeCubicOut)
            .attr('stroke-width', d.w);
        });
    }

    // In focus mode, link-distance can be shorter so the ring stays tight,
    // and link strength relaxes a hair so the angular arrangement dominates.
    const focusMode = !!focusedCompany;
    const linkDistance = focusMode ? 110 : 130;
    const linkStrength = focusMode ? 0.25 : 0.5;
    const chargeStrength = focusMode ? -520 : -720;

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => linkDistance + d.source.r + d.target.r).strength(linkStrength))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(w / 2, h / 2).strength(focusMode ? 0 : 0.04))
      .force('collision', d3.forceCollide().radius(d => d.r + 10).strength(0.9))
      .force('x', d3.forceX(d => (d._tx != null ? d._tx : w / 2)).strength(d => d._tx != null ? 0.42 : 0.04))
      .force('y', d3.forceY(d => (d._ty != null ? d._ty : h / 2)).strength(d => d._ty != null ? 0.42 : 0.04))
      .alpha(positions.size > 0 ? 0.3 : 0.8)
      .alphaDecay(0.035);
    simRef.current = sim;

    // Nodes
    const nodeSel = nodeLayer.selectAll('g')
      .data(nodes, d => d.id)
      .enter().append('g')
      .attr('class', 'dnode')
      .attr('data-id', d => d.id)
      .style('cursor', 'pointer')
      .on('click', (e, d) => {
        e.stopPropagation();
        haptic(10);
        detailSetRef.current({ kind: 'node', id: d.id });
        if (!isMobile) {
          if (focusedRef.current === d.id) {
            focusSetRef.current(null);
          } else {
            focusSetRef.current(d.id);
            haptic(16);
          }
        }
      });
    if (!isMobile) {
      nodeSel
        .on('mouseenter', function (e, d) {
          hoverSetRef.current({ kind: 'node', id: d.id });
          d3.select(this).select('circle.dnode-core')
            .transition().duration(160).ease(d3.easeCubicOut)
            .attr('r', d.r + 2)
            .attr('stroke-width', 3);
        })
        .on('mouseleave', function (e, d) {
          hoverSetRef.current(null);
          d3.select(this).select('circle.dnode-core')
            .transition().duration(200).ease(d3.easeCubicOut)
            .attr('r', d.r)
            .attr('stroke-width', 2);
        })
        .call(
          d3.drag()
            .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.25).restart(); d.fx = d.x; d.fy = d.y; })
            .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
            .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
        );
    }

    nodeSel.append('circle')
      .attr('class', 'dnode-core')
      .attr('r', d => d.r)
      .attr('fill', '#0b1018')
      .attr('stroke', NODE_RING_NEUTRAL)
      .attr('stroke-width', 2);

    // Labels
    const labelSel = labelLayer.selectAll('g')
      .data(nodes, d => d.id)
      .enter().append('g')
      .attr('class', 'dlabel')
      .attr('data-id', d => d.id);

    labelSel.append('text')
      .text(d => d.name)
      .attr('font-family', 'Fraunces, Georgia, serif')
      .attr('font-size', d => Math.min(16, 10 + d.r * 0.22))
      .attr('font-weight', 500)
      .attr('fill', '#e7d9c0')
      .attr('paint-order', 'stroke')
      .attr('stroke', '#0b1018')
      .attr('stroke-width', 3.5)
      .attr('stroke-linejoin', 'round')
      .attr('text-anchor', 'middle')
      .attr('y', d => d.r + 14);

    labelSel.append('text')
      .text(d => d.val ? fmtB(d.val) : '')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', 10)
      .attr('fill', '#7d8ba0')
      .attr('paint-order', 'stroke')
      .attr('stroke', '#0b1018')
      .attr('stroke-width', 3)
      .attr('text-anchor', 'middle')
      .attr('y', d => d.r + 28);

    let tickCount = 0;
    const renderHalos = () => {
      const bySector = new Map();
      for (const n of nodes) {
        if (!bySector.has(n.sector)) bySector.set(n.sector, []);
        bySector.get(n.sector).push(n);
      }
      // Build hull paths per sector.
      const lineGen = d3.line().curve(d3.curveCatmullRomClosed.alpha(0.7));
      const data = [];
      for (const [sector, ns] of bySector) {
        if (ns.length >= 3) {
          const pts = ns.map(n => [n.x, n.y]);
          const hull = d3.polygonHull(pts);
          if (!hull) continue;
          const cx = d3.mean(hull, p => p[0]);
          const cy = d3.mean(hull, p => p[1]);
          // Expand outward by node radius + padding.
          const expanded = hull.map(([x, y]) => {
            const dx = x - cx, dy = y - cy;
            const dist = Math.hypot(dx, dy) || 1;
            const pad = 22;
            return [x + (dx / dist) * pad, y + (dy / dist) * pad];
          });
          data.push({ sector, kind: 'hull', path: lineGen(expanded) });
        } else {
          // 1-2 nodes: cluster of circles, one per node.
          for (const n of ns) data.push({ sector, kind: 'circle', x: n.x, y: n.y, r: n.r + 26, id: n.id });
        }
      }

      const hulls = haloLayer.selectAll('path.halo-hull').data(data.filter(d => d.kind === 'hull'), d => d.sector);
      hulls.enter().append('path').attr('class', 'halo-hull')
        .attr('fill', d => SECTOR_COLORS[d.sector] || '#888')
        .attr('fill-opacity', 0.06)
        .attr('stroke', 'none')
        .merge(hulls)
        .attr('d', d => d.path)
        .attr('fill', d => SECTOR_COLORS[d.sector] || '#888');
      hulls.exit().remove();

      const circles = haloLayer.selectAll('circle.halo-circle').data(data.filter(d => d.kind === 'circle'), d => d.id);
      circles.enter().append('circle').attr('class', 'halo-circle')
        .attr('fill', d => SECTOR_COLORS[d.sector] || '#888')
        .attr('fill-opacity', 0.06)
        .attr('stroke', 'none')
        .merge(circles)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .attr('fill', d => SECTOR_COLORS[d.sector] || '#888');
      circles.exit().remove();
    };

    sim.on('tick', () => {
      linkSel.attr('d', d => {
        const sx = d.source.x, sy = d.source.y;
        const tx = d.target.x, ty = d.target.y;
        const dx = tx - sx, dy = ty - sy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const ux = dx / dist, uy = dy / dist;
        const ex = tx - ux * (d.target.r + 4);
        const ey = ty - uy * (d.target.r + 4);
        const sx2 = sx + ux * (d.source.r + 2);
        const sy2 = sy + uy * (d.source.r + 2);
        const curve = Math.min(60, dist * 0.1);
        const mx = (sx2 + ex) / 2 + (-uy) * curve;
        const my = (sy2 + ey) / 2 + (ux) * curve;
        return `M${sx2},${sy2} Q${mx},${my} ${ex},${ey}`;
      });
      nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
      labelSel.attr('transform', d => `translate(${d.x},${d.y})`);
      // Halo geometry only needs a refresh every 4th tick (enough for smooth feel).
      if ((tickCount++ & 3) === 0) renderHalos();
    });
    // Final pass on simulation end so halos settle at final positions.
    sim.on('end.halo', () => renderHalos());
    renderHalos();

    sim.on('end', () => {
      nodes.forEach(n => { positions.set(n.id, { x: n.x, y: n.y }); });
    });
    const snapshotInterval = setInterval(() => {
      nodes.forEach(n => {
        if (Number.isFinite(n.x) && Number.isFinite(n.y)) {
          positions.set(n.id, { x: n.x, y: n.y });
        }
      });
    }, 400);

    // Fade the whole viewport in on each rebuild. Combined with position
    // preservation via positionsRef, nodes that carry over appear to "breathe
    // back in" rather than snap — and new ones fade in naturally.
    viewport.style('opacity', 0)
      .transition().duration(260).ease(d3.easeCubicOut)
      .style('opacity', 1);

    return () => {
      clearInterval(snapshotInterval);
      sim.stop();
      if (simRef.current === sim) simRef.current = null;
    };
  }, [filteredNodes, filteredDeals, dims.w, dims.h, view, isMobile]);

  // ——— Highlight effect
  useEffect(() => {
    if (view !== 'graph') return;
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const target = detail || hovered;                       // what the panel describes
    const solo = activeTypes.size === 1 ? [...activeTypes][0] : null;
    const focus = focusedCompany;

    const dealById = new Map();
    DEALS.forEach(d => dealById.set(d.id, d));

    svg.selectAll('path.dlink').each(function () {
      const id = this.getAttribute('data-id');
      const d = dealById.get(id);
      if (!d) return;
      const isTargetDeal = target?.kind === 'deal' && target.id === id;
      const endpointOfTargetNode = target?.kind === 'node' && (d.from === target.id || d.to === target.id);
      const endpointOfFocus = focus && (d.from === focus || d.to === focus);
      const soloActive = solo && d.type === solo;

      let stroke = EDGE_NEUTRAL;
      if (isTargetDeal || endpointOfTargetNode || soloActive || endpointOfFocus) {
        stroke = TYPES[d.type].color;
      }
      let opacity = EDGE_OP_BASE;
      if (target) {
        if (isTargetDeal || endpointOfTargetNode) opacity = EDGE_OP_HIGH;
        else opacity = EDGE_OP_DIM;
      } else if (soloActive || endpointOfFocus) {
        opacity = EDGE_OP_HIGH;
      }
      d3.select(this)
        .transition('hi').duration(160).ease(d3.easeCubicOut)
        .attr('stroke', stroke).attr('stroke-opacity', opacity);
    });

    svg.selectAll('g.dnode').each(function () {
      const id = this.getAttribute('data-id');
      const company = COMPANIES.find(c => c.id === id);
      if (!company) return;
      const isTargetNode = target?.kind === 'node' && target.id === id;
      const isFocusNode = focus === id;
      const endpointOfTargetDeal = target?.kind === 'deal' && (() => {
        const d = dealById.get(target.id);
        return d && (d.from === id || d.to === id);
      })();
      // If we're in focus mode, every visible node is either the focus or a partner.
      const partnerOfFocus = focus && focus !== id;

      let ring = NODE_RING_NEUTRAL;
      if (isTargetNode || isFocusNode || endpointOfTargetDeal || partnerOfFocus) {
        ring = SECTOR_COLORS[company.sector] || '#888';
      }
      let op = 1;
      if (target && !(isTargetNode || endpointOfTargetDeal)) op = 0.35;
      const sel = d3.select(this);
      sel.select('circle.dnode-core')
        .transition('hi').duration(180).ease(d3.easeCubicOut)
        .attr('stroke', ring);
      sel.transition('hi').duration(180).ease(d3.easeCubicOut).attr('opacity', op);
    });

    svg.selectAll('g.dlabel').each(function () {
      const id = this.getAttribute('data-id');
      let op = 1;
      if (target) {
        const isRelated = (target.kind === 'node' && target.id === id) ||
          (target.kind === 'deal' && (() => {
            const d = dealById.get(target.id);
            return d && (d.from === id || d.to === id);
          })());
        op = isRelated ? 1 : 0.3;
      }
      d3.select(this)
        .transition('hi').duration(180).ease(d3.easeCubicOut)
        .attr('opacity', op);
    });
  }, [hovered, detail, focusedCompany, activeTypes, filteredDeals, view]);

  // Fade halos when a company is focused; restore otherwise.
  useEffect(() => {
    if (!svgRef.current) return;
    const layer = d3.select(svgRef.current).select('g.halos');
    if (layer.empty()) return;
    layer.transition().duration(220).style('opacity', focusedCompany ? 0 : 1);
  }, [focusedCompany]);

  const stats = useMemo(() => {
    const byType = {};
    let total = 0;
    filteredDeals.forEach(d => {
      byType[d.type] = (byType[d.type] || 0) + d.value;
      total += d.value;
    });
    return { total, byType, count: filteredDeals.length };
  }, [filteredDeals]);

  // Deal-type counts for chip labels. Respects the current company focus
  // but ignores the active-types filter (so counts don't lie to you after
  // soloing a type).
  const typeCounts = useMemo(() => {
    const base = focusedCompany
      ? DEALS.filter(d => d.from === focusedCompany || d.to === focusedCompany)
      : DEALS;
    const acc = {};
    for (const k of Object.keys(TYPES)) acc[k] = 0;
    for (const d of base) acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, [focusedCompany]);

  const toggleType = (t, shift) => {
    haptic(8);
    const all = Object.keys(TYPES);
    if (shift) {
      const s = new Set(activeTypes);
      if (s.has(t)) { if (s.size > 1) s.delete(t); }
      else { s.add(t); }
      setActiveTypes(s);
      return;
    }
    if (activeTypes.size === 1 && activeTypes.has(t)) {
      setActiveTypes(new Set(all));
    } else {
      setActiveTypes(new Set([t]));
    }
  };
  const pickCompany = (id) => {
    haptic(16);
    setFocusedCompany(id);
    setDetail({ kind: 'node', id });
    setSearchOpen(false);
  };
  const resetTypes = () => { haptic(12); setActiveTypes(new Set(Object.keys(TYPES))); };
  const clearFocus = () => { haptic(18); setFocusedCompany(null); setDetail(null); };
  const clearAll = () => { haptic(18); setFocusedCompany(null); setDetail(null); setActiveTypes(new Set(Object.keys(TYPES))); };

  const zoomBy = (factor) => {
    const svg = zoomSvgRef.current;
    const zoom = zoomRef.current;
    if (!svg || !zoom) return;
    svg.transition().duration(180).call(zoom.scaleBy, factor);
  };
  const zoomIn = () => { haptic(6); zoomBy(1.35); };
  const zoomOut = () => { haptic(6); zoomBy(1 / 1.35); };
  const resetZoom = () => {
    haptic(8);
    const svg = zoomSvgRef.current;
    const zoom = zoomRef.current;
    if (!svg || !zoom) return;
    svg.transition().duration(220).call(zoom.transform, d3.zoomIdentity);
  };

  const panelTarget = detail || hovered;
  const panelNode = panelTarget?.kind === 'node' ? COMPANIES.find(c => c.id === panelTarget.id) : null;
  const panelDeal = panelTarget?.kind === 'deal' ? DEALS.find(d => d.id === panelTarget.id) : null;
  const nodeConnections = useMemo(() => {
    if (!panelNode) return [];
    return DEALS.filter(d => d.from === panelNode.id || d.to === panelNode.id)
      .sort((a, b) => b.value - a.value);
  }, [panelNode]);

  const typesAllActive = activeTypes.size === Object.keys(TYPES).length;

  return (
    <div style={{
      background: '#070a10',
      color: '#e7d9c0',
      fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
      minHeight: '100vh',
      padding: isMobile ? 14 : 20,
    }}>
      <Link to="/research" aria-label="Back to research"
        style={{
          position: 'fixed',
          top: 'max(12px, env(safe-area-inset-top))',
          left: 14,
          zIndex: 200,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 12px',
          background: 'rgba(11,16,24,0.78)',
          backdropFilter: 'blur(10px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(10px) saturate(1.4)',
          border: '1px solid #1a2233',
          borderRadius: 999,
          color: '#c6d1e0',
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 11,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderBottom: 'none',
          transition: 'color 180ms, border-color 180ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.borderColor = '#3b4656'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#c6d1e0'; e.currentTarget.style.borderColor = '#1a2233'; }}>
        <ArrowLeft size={13} strokeWidth={1.75} />
        <span>Back</span>
      </Link>
      <style>{`
        .chip {
          font-family: "IBM Plex Mono", monospace;
          font-size: ${isMobile ? 13 : 11}px;
          letter-spacing: 0.02em;
          padding: ${isMobile ? '12px 14px' : '5px 10px'};
          ${isMobile ? 'min-height: 44px; display: inline-flex; align-items: center;' : ''}
          border-radius: 999px;
          border: 1px solid #26303e;
          background: transparent;
          color: #8da0b8;
          cursor: pointer;
          transition: all 120ms;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .chip:hover { border-color: #4a5668; color: #c6d1e0; }
        .chip.active { background: #141a26; border-color: #3b4656; color: #e7d9c0; }
        .chip.solo { font-weight: 500; }
        .chip-reset {
          font-family: "IBM Plex Mono", monospace;
          font-size: ${isMobile ? 13 : 11}px;
          padding: ${isMobile ? '12px 14px' : '5px 10px'};
          ${isMobile ? 'min-height: 44px; display: inline-flex; align-items: center;' : ''}
          border-radius: 999px;
          background: #1a2233;
          color: #f59e0b;
          border: 1px solid #3b4656;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .h-serif { font-family: Fraunces, Georgia, serif; font-weight: 500; letter-spacing: -0.01em; }
        .mono { font-family: "IBM Plex Mono", monospace; }
        a { color: #fbbf24; text-decoration: none; border-bottom: 1px dotted #6b5a2e; }
        a:hover { color: #fcd34d; border-bottom-color: #fcd34d; }
        a.src-link {
          color: #6b7a8f;
          border-bottom: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1;
          flex-shrink: 0;
          transition: all 120ms;
        }
        a.src-link:hover { color: #f59e0b; background: #1a2233; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0b1018; }
        ::-webkit-scrollbar-thumb { background: #26303e; border-radius: 3px; }
        .rel-scroll::-webkit-scrollbar { width: 8px; }
        .rel-scroll::-webkit-scrollbar-thumb { background: #4a5668; }
        .rel-scroll::-webkit-scrollbar-thumb:hover { background: #5e6d82; }
        .chip-row {
          display: flex;
          gap: 6px;
          align-items: center;
          ${isMobile ? 'overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px;' : 'flex-wrap: wrap;'}
        }
        svg text { user-select: none; }
        .sheet-enter { animation: sheetIn 200ms ease-out; }
        @keyframes sheetIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1600, margin: '0 auto', marginBottom: isMobile ? 12 : 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="mono" style={{ color: '#6b7a8f', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              The AI Capital Graph · Nov 2022 → Apr 2026
            </div>
            <h1 className="h-serif" style={{ fontSize: isMobile ? 30 : 44, margin: '4px 0 2px', lineHeight: 1.05, color: '#fdf6e3' }}>
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Who owes</span> <span style={{ color: '#f59e0b' }}>what</span> <span style={{ fontStyle: 'italic', fontWeight: 400 }}>to whom</span>.
            </h1>
            <div style={{ color: '#8da0b8', fontSize: 14, maxWidth: 720, marginTop: 8 }}>
              Every major publicly-disclosed investment, compute commitment, chip supply agreement, equity stake,
              and M&amp;A deal between the key AI players since ChatGPT shipped. Tap a company for its orbit,
              a chip to solo a deal type, or an arrow for details.
            </div>
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Stat label="Deals shown" value={stats.count} />
              <Stat label="Total committed" value={`$${Math.round(stats.total)}B`} accent />
              <Stat label="Companies" value={filteredNodes.length} />
            </div>
          )}
        </div>
        {isMobile && (
          <div style={{ display: 'flex', gap: 18, marginTop: 10 }}>
            <Stat label="Deals" value={stats.count} />
            <Stat label="Committed" value={`$${Math.round(stats.total)}B`} accent />
            <Stat label="Cos" value={filteredNodes.length} />
          </div>
        )}
      </div>

      {/* Focus breadcrumb */}
      {focusedCompany && (
        <div style={{
          maxWidth: 1600, margin: '0 auto 10px', padding: '10px 14px',
          background: '#0b1018', border: '1px solid #1a2233', borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, flexWrap: 'wrap',
        }}>
          <span className="mono" style={{ color: '#6b7a8f', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Focused</span>
          <span className="h-serif" style={{ color: '#fdf6e3', fontSize: 16 }}>
            {COMPANIES.find(c => c.id === focusedCompany)?.name}
          </span>
          <span className="mono" style={{ color: '#6b7a8f', fontSize: 11 }}>
            · {filteredDeals.length} deal{filteredDeals.length === 1 ? '' : 's'}
          </span>
          <button onClick={clearFocus} className="mono"
            style={{
              marginLeft: 'auto',
              fontSize: isMobile ? 12 : 11, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: isMobile ? '11px 14px' : '7px 12px', borderRadius: 999,
              background: '#1a2233', color: '#f59e0b',
              border: '1px solid #3b4656', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              minHeight: isMobile ? 44 : undefined,
            }}>
            <X size={14} strokeWidth={2} /> Clear focus
          </button>
        </div>
      )}

      {/* Filters bar */}
      <div style={{
        maxWidth: 1600, margin: '0 auto 14px', padding: isMobile ? '10px 12px' : 14,
        background: '#0b1018', border: '1px solid #1a2233', borderRadius: 8,
        display: 'flex', gap: isMobile ? 10 : 18, flexWrap: 'wrap', alignItems: 'center'
      }}>
        <div className="chip-row" style={{ flex: 1, minWidth: 0 }}>
          {!isMobile && (
            <span className="mono" style={{ color: '#6b7a8f', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 4, flexShrink: 0 }}>Types</span>
          )}
          {!typesAllActive && (
            <button className="chip-reset" onClick={resetTypes} title="Reset to all types">All</button>
          )}
          {Object.entries(TYPES).map(([key, t]) => {
            const active = activeTypes.has(key);
            const solo = active && activeTypes.size === 1;
            const count = typeCounts[key] || 0;
            const empty = count === 0;
            const baseStyle = active
              ? { borderColor: t.color, color: t.color, background: solo ? `${t.color}26` : `${t.color}10` }
              : {};
            const style = empty ? { ...baseStyle, opacity: 0.45 } : baseStyle;
            return (
              <button key={key}
                className={`chip ${active ? 'active' : ''} ${solo ? 'solo' : ''}`}
                onClick={(e) => toggleType(key, e.shiftKey)}
                style={style}
                title={isMobile ? t.label : `${t.label} — click to solo, shift-click to add`}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 3, background: t.color, marginRight: 6, verticalAlign: 'middle' }} />
                {t.label}
                <span style={{ marginLeft: 6, opacity: 0.6, fontVariantNumeric: 'tabular-nums' }}>· {count}</span>
              </button>
            );
          })}
          <button onClick={() => { haptic(8); setSearchOpen(true); }}
            className="chip"
            title={isMobile ? 'Search companies' : 'Search companies (⌘K)'}
            style={{ borderColor: '#3b4656', color: '#8da0b8', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Search size={13} strokeWidth={1.75} />
            {!isMobile && <span style={{ opacity: 0.7, fontSize: 10, letterSpacing: '0.05em' }}>⌘K</span>}
          </button>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2, background: '#070a10', border: '1px solid #26303e', borderRadius: 6, padding: 2, flexShrink: 0 }}>
            {['graph', 'table'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className="mono"
                style={{
                  padding: '5px 12px', background: view === v ? '#1a2233' : 'transparent',
                  color: view === v ? '#e7d9c0' : '#6b7a8f', border: 'none', borderRadius: 4,
                  fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer'
                }}>{v}</button>
            ))}
          </div>
        )}
      </div>

      {isMobile && (
        <div style={{ maxWidth: 1600, margin: '0 auto 10px', display: 'flex', gap: 2, background: '#0b1018', border: '1px solid #1a2233', borderRadius: 6, padding: 2 }}>
          {['graph', 'table'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className="mono"
              style={{
                flex: 1, padding: '8px 12px', background: view === v ? '#1a2233' : 'transparent',
                color: view === v ? '#e7d9c0' : '#6b7a8f', border: 'none', borderRadius: 4,
                fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer'
              }}>{v}</button>
          ))}
        </div>
      )}

      {/* Main grid */}
      <div style={{
        maxWidth: 1600, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 360px',
        gap: 14
      }}>
        <div ref={containerRef} style={{
          background: 'radial-gradient(ellipse at center, #0c121d 0%, #070a10 80%)',
          border: '1px solid #1a2233', borderRadius: 8,
          minHeight: isMobile ? '60vh' : 720,
          height: isMobile && view === 'graph' ? '65vh' : undefined,
          position: 'relative', overflow: 'hidden',
          touchAction: 'manipulation',
        }}>
          {view === 'graph' ? (
            <>
              <svg ref={svgRef} width="100%" height={isMobile ? '100%' : dims.h} style={{ display: 'block', touchAction: 'none' }} />
              <GraphControls
                isMobile={isMobile}
                onZoomIn={zoomIn} onZoomOut={zoomOut} onResetZoom={resetZoom}
                showResetAll={!!focusedCompany || !typesAllActive}
                onResetAll={clearAll} />
              <Legend isMobile={isMobile} />
            </>
          ) : (
            <TableView deals={filteredDeals} onPick={(d) => setDetail({ kind: 'deal', id: d.id })} detail={detail} />
          )}
        </div>

        {!isMobile && (
          <div style={{
            background: '#0b1018', border: '1px solid #1a2233', borderRadius: 8,
            height: view === 'graph' ? dims.h : 'calc(100vh - 260px)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            {!panelTarget && (
              <div style={{ padding: 18, overflowY: 'auto' }}><IntroPanel stats={stats} /></div>
            )}
            {panelTarget && panelDeal && (
              <div style={{ padding: 18, overflowY: 'auto' }}><DealPanel deal={panelDeal} /></div>
            )}
            {panelTarget && panelNode && (
              <NodePanel node={panelNode} conns={nodeConnections}
                focused={focusedCompany === panelNode.id}
                onClearFocus={clearFocus}
                onFocus={() => { haptic(16); setFocusedCompany(panelNode.id); }}
                fillHeight />
            )}
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {isMobile && detail && (panelDeal || panelNode) && (
        <BottomSheet onClose={() => setDetail(null)}>
          {panelDeal && <DealPanel deal={panelDeal} />}
          {panelNode && (
            <NodePanel node={panelNode} conns={nodeConnections}
              focused={focusedCompany === panelNode.id}
              onClearFocus={clearFocus}
              onFocus={() => { haptic(16); setFocusedCompany(panelNode.id); }} />
          )}
        </BottomSheet>
      )}

      {searchOpen && (
        <CompanySearch isMobile={isMobile} onClose={() => setSearchOpen(false)} onPick={pickCompany} />
      )}

      {/* Footer */}
      <div style={{ maxWidth: 1600, margin: '18px auto 0', color: '#5e6a7e', fontSize: 11, fontFamily: '"IBM Plex Mono", monospace', lineHeight: 1.6 }}>
        <div>
          Valuations sourced from company filings, press releases, Bloomberg, Reuters, CNBC, SEC 8-Ks, Anthropic/OpenAI/NVIDIA/AMD newsrooms,
          Motley Fool, SiliconANGLE, and Wikipedia as of Apr 21, 2026. Deal values are committed totals; many are multi-year and not yet disbursed.
          NVIDIA–OpenAI $100B LOI remained non-definitive as of Dec 2025. AMD–OpenAI warrant value realizes only at milestone hurdles.
        </div>
        <div style={{ marginTop: 6 }}>
          Built as a single-pane view of the capital flows shaping the AI compute economy. Not investment advice — cross-check figures before acting.
        </div>
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————
// SUB-COMPONENTS
// ————————————————————————————————————————————————

function Stat({ label, value, accent }) {
  return (
    <div>
      <div className="mono" style={{ color: '#6b7a8f', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
      <div className="h-serif" style={{ fontSize: 24, color: accent ? '#f59e0b' : '#fdf6e3', lineHeight: 1, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function Legend({ isMobile }) {
  return (
    <div style={{
      position: 'absolute', bottom: 12, left: 12,
      background: 'rgba(11,16,24,0.88)', backdropFilter: 'blur(6px)',
      border: '1px solid #1a2233', borderRadius: 6,
      padding: '10px 12px', fontSize: 11, color: '#8da0b8',
      fontFamily: '"IBM Plex Mono", monospace',
      maxWidth: isMobile ? 200 : 260,
      pointerEvents: 'none',
    }}>
      <div style={{ color: '#6b7a8f', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>How to read</div>
      <div style={{ lineHeight: 1.6 }}>
        <div>• Tap company → focus its orbit</div>
        <div>• Tap edge → deal details</div>
        <div>• Tap type{!isMobile && ' (shift to add)'}</div>
      </div>
    </div>
  );
}

function IntroPanel({ stats }) {
  const sorted = Object.entries(stats.byType).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <div className="mono" style={{ color: '#6b7a8f', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>At this filter setting</div>
      <div className="h-serif" style={{ fontSize: 22, color: '#fdf6e3', marginTop: 4, lineHeight: 1.15 }}>
        <span style={{ color: '#f59e0b' }}>${Math.round(stats.total)}B</span> across {stats.count} deals
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="mono" style={{ color: '#6b7a8f', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Breakdown by type</div>
        {sorted.map(([t, v]) => (
          <div key={t} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1a2233' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#c6d1e0' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: TYPES[t].color, display: 'inline-block' }} />
              {TYPES[t].label}
            </div>
            <div className="mono" style={{ color: TYPES[t].color, fontSize: 12 }}>${Math.round(v)}B</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, padding: 12, background: '#0e141f', border: '1px solid #1a2233', borderRadius: 6, fontSize: 12, color: '#8da0b8', lineHeight: 1.5 }}>
        <div style={{ color: '#fdf6e3', marginBottom: 4, fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic' }}>Notes on "circularity"</div>
        Several arrows loop back on themselves — NVIDIA invests in OpenAI, which buys NVIDIA chips; AMD grants OpenAI warrants, which OpenAI pays for with AMD GPU purchases; NVIDIA invests in CoreWeave, then buys compute from CoreWeave. This structural circularity is a defining feature of the current build-out.
      </div>
    </div>
  );
}

function DealPanel({ deal }) {
  const from = COMPANIES.find(c => c.id === deal.from);
  const to = COMPANIES.find(c => c.id === deal.to);
  const tColor = TYPES[deal.type].color;
  let hostname = '';
  if (deal.source && typeof deal.source === 'string') {
    try { hostname = new URL(deal.source).hostname.replace(/^www\./, ''); } catch (e) { hostname = ''; }
  }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: 2, background: tColor, display: 'inline-block' }} />
        <span className="mono" style={{ color: tColor, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {TYPES[deal.type].label}
        </span>
      </div>
      <div className="h-serif" style={{ fontSize: 14, color: '#8da0b8', marginTop: 4 }}>
        <span style={{ color: '#fdf6e3' }}>{from?.name}</span>
        <span style={{ color: '#4a5668', margin: '0 6px' }}>→</span>
        <span style={{ color: '#fdf6e3' }}>{to?.name}</span>
      </div>
      <div className="h-serif" style={{ fontSize: 30, color: tColor, marginTop: 10, lineHeight: 1.1, fontWeight: 500 }}>
        {fmtB(deal.value)}
      </div>
      <div className="mono" style={{ color: '#6b7a8f', fontSize: 11, marginTop: 2 }}>{deal.date} · FY {deal.year}</div>
      <div style={{ marginTop: 18, fontSize: 14, color: '#e7d9c0', lineHeight: 1.5 }}>{deal.title}</div>
      {deal.note && (
        <div style={{ marginTop: 10, fontSize: 13, color: '#8da0b8', lineHeight: 1.55, fontStyle: 'italic', borderLeft: `2px solid ${tColor}`, paddingLeft: 10 }}>
          {deal.note}
        </div>
      )}
      {hostname && (
        <div style={{ marginTop: 18 }}>
          <div className="mono" style={{ color: '#6b7a8f', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Source</div>
          <a href={deal.source} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, wordBreak: 'break-all' }}>
            {hostname} <ExternalLink size={12} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: '-2px' }} />
          </a>
        </div>
      )}
    </div>
  );
}

function NodePanel({ node, conns, focused, onFocus, onClearFocus, fillHeight }) {
  const sectorColor = SECTOR_COLORS[node.sector] || '#888';
  const inbound = conns.filter(c => c.to === node.id);
  const outbound = conns.filter(c => c.from === node.id);
  const inboundTotal = inbound.reduce((a, c) => a + c.value, 0);
  const outboundTotal = outbound.reduce((a, c) => a + c.value, 0);

  const outerStyle = fillHeight
    ? { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, padding: 18, paddingBottom: 0 }
    : {};

  return (
    <div style={outerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 10, height: 10, borderRadius: 6, background: sectorColor, display: 'inline-block' }} />
        <span className="mono" style={{ color: sectorColor, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {node.sector.replace('-', ' ')}
        </span>
      </div>
      <div className="h-serif" style={{ fontSize: 30, color: '#fdf6e3', lineHeight: 1 }}>{node.name}</div>
      {node.val ? (
        <div className="mono" style={{ color: sectorColor, fontSize: 13, marginTop: 8 }}>
          {node.public ? 'Public market cap' : 'Last private valuation'}: ~${node.val >= 1000 ? `${(node.val / 1000).toFixed(2)}T` : `${node.val}B`}
        </div>
      ) : null}
      {node.note && <div style={{ color: '#8da0b8', fontSize: 12, marginTop: 6, fontStyle: 'italic' }}>{node.note}</div>}

      <div style={{ marginTop: 14 }}>
        {focused ? (
          <button onClick={onClearFocus}
            style={{
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.08em',
              padding: '10px 14px', borderRadius: 999,
              background: `${sectorColor}26`, color: sectorColor,
              border: `1px solid ${sectorColor}`, textTransform: 'uppercase', cursor: 'pointer',
            }}>
            ✓ Focused — tap to clear
          </button>
        ) : (
          <button onClick={onFocus}
            style={{
              fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, letterSpacing: '0.08em',
              padding: '10px 14px', borderRadius: 999,
              background: 'transparent', color: '#8da0b8',
              border: '1px solid #3b4656', textTransform: 'uppercase', cursor: 'pointer',
            }}>
            Focus on {node.name}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 18, paddingTop: 14, borderTop: '1px solid #1a2233' }}>
        <div>
          <div className="mono" style={{ color: '#6b7a8f', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Capital / supply received</div>
          <div className="h-serif" style={{ fontSize: 22, color: '#fdf6e3', marginTop: 2 }}>${Math.round(inboundTotal)}B</div>
          <div style={{ fontSize: 11, color: '#6b7a8f' }} className="mono">{inbound.length} deals</div>
        </div>
        <div>
          <div className="mono" style={{ color: '#6b7a8f', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Capital / supply deployed</div>
          <div className="h-serif" style={{ fontSize: 22, color: '#fdf6e3', marginTop: 2 }}>${Math.round(outboundTotal)}B</div>
          <div style={{ fontSize: 11, color: '#6b7a8f' }} className="mono">{outbound.length} deals</div>
        </div>
      </div>

      {conns.length > 0 && (
        <div style={{
          marginTop: 16,
          ...(fillHeight ? { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' } : {}),
        }}>
          <div className="mono" style={{ color: '#6b7a8f', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 8, flexShrink: 0 }}>
            <span>All relationships</span>
            <span style={{ color: '#8da0b8', fontSize: 11, letterSpacing: '0.05em', textTransform: 'none' }}>{conns.length}</span>
          </div>
          <div style={{ position: 'relative', ...(fillHeight ? { flex: 1, minHeight: 0 } : {}) }}>
            <div className="rel-scroll" style={{
              height: '100%',
              ...(fillHeight ? { overflowY: 'auto', paddingRight: 10, paddingBottom: 18 } : {}),
            }}>
              {conns.map(c => {
                const other = c.from === node.id ? COMPANIES.find(x => x.id === c.to) : COMPANIES.find(x => x.id === c.from);
                const dir = c.from === node.id ? '→' : '←';
                return (
                  <div key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid #1a2233', fontSize: 12, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#c6d1e0' }}>
                        <span style={{ color: '#6b7a8f' }}>{dir}</span> {other?.name}
                      </div>
                      <div style={{ color: TYPES[c.type].color, fontSize: 10, fontFamily: '"IBM Plex Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
                        {TYPES[c.type].label} · {c.date}
                      </div>
                    </div>
                    <div className="mono" style={{ color: '#fdf6e3', fontSize: 12, whiteSpace: 'nowrap' }}>{fmtB(c.value)}</div>
                    {c.source && typeof c.source === 'string' && (
                      <a href={c.source} target="_blank" rel="noopener noreferrer"
                        className="src-link" title="Open source" aria-label="Open source in new tab"
                        onClick={(e) => e.stopPropagation()}>
                        <ExternalLink size={14} strokeWidth={1.75} />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
            {fillHeight && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 10,
                height: 40, pointerEvents: 'none',
                background: 'linear-gradient(to bottom, rgba(11,16,24,0), rgba(11,16,24,0.95))',
              }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TableView({ deals, onPick, detail }) {
  const [sortKey, setSortKey] = useState('value');
  const [sortDir, setSortDir] = useState('desc');
  const sorted = [...deals].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'number') return sortDir === 'desc' ? bv - av : av - bv;
    return sortDir === 'desc' ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
  });
  const H = ({ k, label, w }) => (
    <th style={{ padding: '10px 12px', textAlign: k === 'value' ? 'right' : 'left', fontWeight: 500, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7a8f', cursor: 'pointer', width: w }}
      onClick={() => { setSortDir(sortKey === k && sortDir === 'desc' ? 'asc' : 'desc'); setSortKey(k); }}>
      {label} {sortKey === k ? (sortDir === 'desc' ? '↓' : '↑') : ''}
    </th>
  );
  return (
    <div style={{ padding: 16, overflow: 'auto', maxHeight: '72vh' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"IBM Plex Sans", sans-serif' }}>
        <thead style={{ position: 'sticky', top: 0, background: '#0c121d', borderBottom: '1px solid #26303e' }}>
          <tr>
            <H k="date" label="Date" />
            <H k="from" label="From" />
            <H k="to" label="To" />
            <H k="type" label="Type" />
            <H k="value" label="Value" w="100px" />
            <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7a8f', fontWeight: 500 }}>Title</th>
            <th style={{ padding: '10px 8px', textAlign: 'center', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7a8f', fontWeight: 500, width: 50 }}>Src</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(d => {
            const from = COMPANIES.find(c => c.id === d.from);
            const to = COMPANIES.find(c => c.id === d.to);
            const tColor = TYPES[d.type].color;
            const isSel = detail?.kind === 'deal' && detail.id === d.id;
            return (
              <tr key={d.id} onClick={() => onPick(d)}
                style={{ cursor: 'pointer', background: isSel ? '#1a2233' : 'transparent', borderBottom: '1px solid #15202e' }}>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#8da0b8', whiteSpace: 'nowrap' }} className="mono">{d.date}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#e7d9c0' }}>{from?.name}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#e7d9c0' }}>{to?.name}</td>
                <td style={{ padding: '10px 12px', fontSize: 11, color: tColor, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }} className="mono">{TYPES[d.type].label}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#fdf6e3', textAlign: 'right', whiteSpace: 'nowrap' }} className="mono">{fmtB(d.value)}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#c6d1e0' }}>{d.title}</td>
                <td style={{ padding: '6px 8px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                  {d.source && typeof d.source === 'string' && (
                    <a href={d.source} target="_blank" rel="noopener noreferrer"
                      className="src-link" title="Open source" aria-label="Open source in new tab">
                      <ExternalLink size={14} strokeWidth={1.75} />
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BottomSheet({ children, onClose }) {
  return (
    <>
      <div onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)', zIndex: 50 }} />
      <div className="sheet-enter"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          maxHeight: '75vh', overflowY: 'auto',
          background: '#0b1018',
          borderTopLeftRadius: 16, borderTopRightRadius: 16,
          borderTop: '1px solid #1a2233',
          padding: '12px 18px calc(18px + env(safe-area-inset-bottom))',
          zIndex: 51,
        }}>
        <div onClick={onClose}
          style={{ width: 40, height: 4, borderRadius: 2, background: '#26303e', margin: '4px auto 14px', cursor: 'pointer' }} />
        {children}
      </div>
    </>
  );
}


function GraphControls({ isMobile, onZoomIn, onZoomOut, onResetZoom, showResetAll, onResetAll }) {
  const size = isMobile ? 44 : 36;
  const fontSize = isMobile ? 20 : 17;
  return (
    <div style={{
      position: 'absolute', top: 12, right: 12,
      display: 'flex', flexDirection: 'column', gap: 6, zIndex: 2,
    }}>
      <IconButton size={size} onClick={onZoomIn} title="Zoom in"><Plus size={isMobile ? 20 : 17} strokeWidth={1.75} /></IconButton>
      <IconButton size={size} onClick={onZoomOut} title="Zoom out"><Minus size={isMobile ? 20 : 17} strokeWidth={1.75} /></IconButton>
      <IconButton size={size} onClick={onResetZoom} title="Reset zoom"><Maximize2 size={isMobile ? 18 : 15} strokeWidth={1.75} /></IconButton>
      {showResetAll && (
        <IconButton size={size} emphasis onClick={onResetAll} title="Reset filters & focus">
          <RotateCcw size={isMobile ? 18 : 15} strokeWidth={1.75} />
        </IconButton>
      )}
    </div>
  );
}

function IconButton({ children, onClick, title, emphasis, size = 36 }) {
  const bg = emphasis ? '#1a2233' : 'rgba(11,16,24,0.88)';
  const border = emphasis ? '#f59e0b' : '#1a2233';
  const color = emphasis ? '#f59e0b' : '#c6d1e0';
  return (
    <button onClick={onClick} title={title}
      style={{
        width: size, height: size, borderRadius: 8,
        background: bg, border: `1px solid ${border}`, color,
        cursor: 'pointer', lineHeight: 1,
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 120ms',
        padding: 0,
      }}
      onMouseDown={(e) => e.stopPropagation()}>
      {children}
    </button>
  );
}


function CompanySearch({ isMobile, onClose, onPick }) {
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const y = window.scrollY;
    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      window.scrollTo(0, y);
    };
  }, []);

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const all = [...COMPANIES].sort((a, b) => a.name.localeCompare(b.name));
    if (!needle) return all;
    const score = (c) => {
      const name = c.name.toLowerCase();
      if (name.startsWith(needle)) return 0;
      if (name.includes(needle)) return 1;
      return 2;
    };
    return all
      .filter(c => c.name.toLowerCase().includes(needle))
      .sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name));
  }, [q]);

  useEffect(() => { setCursor(0); }, [q]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(matches.length - 1, c + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => Math.max(0, c - 1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const m = matches[cursor];
      if (m) onPick(m.id);
    }
  };

  return (
    <>
      <div onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)', zIndex: 100 }} />
      <div role="dialog" aria-modal="true"
        style={{
          position: 'fixed',
          top: isMobile ? '10vh' : '18vh',
          left: '50%', transform: 'translateX(-50%)',
          width: isMobile ? '92vw' : 460,
          maxHeight: isMobile ? '70vh' : '60vh',
          background: '#0b1018',
          border: '1px solid #1a2233',
          borderRadius: 12,
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          zIndex: 101,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #1a2233', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Search size={16} strokeWidth={1.75} color="#6b7a8f" />
          <input ref={inputRef}
            value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a company…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fdf6e3', fontSize: 16,
              fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
            }} />
          <span className="mono" style={{ color: '#6b7a8f', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Esc</span>
        </div>
        <div style={{ overflowY: 'auto', padding: '6px 0' }}>
          {matches.length === 0 ? (
            <div style={{ padding: '20px 16px', color: '#6b7a8f', fontSize: 13, textAlign: 'center' }}>No match</div>
          ) : matches.map((c, i) => {
            const sectorColor = SECTOR_COLORS[c.sector] || '#888';
            const selected = i === cursor;
            return (
              <div key={c.id}
                onMouseEnter={() => setCursor(i)}
                onClick={() => onPick(c.id)}
                style={{
                  padding: '10px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer',
                  background: selected ? '#1a2233' : 'transparent',
                }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: sectorColor, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fdf6e3', fontFamily: 'Fraunces, Georgia, serif', fontSize: 16 }}>{c.name}</div>
                  <div className="mono" style={{ color: sectorColor, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {c.sector.replace('-', ' ')}
                  </div>
                </div>
                {c.val ? (
                  <div className="mono" style={{ color: '#8da0b8', fontSize: 11, whiteSpace: 'nowrap' }}>
                    ~${c.val >= 1000 ? `${(c.val / 1000).toFixed(2)}T` : `${c.val}B`}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
