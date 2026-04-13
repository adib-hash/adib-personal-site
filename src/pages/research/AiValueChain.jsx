import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════
   GLOSSARY (Layer 00)
   ═══════════════════════════════════════ */
const GLOSSARY = [
  { term: "Training", def: 'The expensive, one-time process of "teaching" an AI model by feeding it massive datasets. Think of it like building the factory. A single frontier training run can cost $100M+.' },
  { term: "Inference", def: "The ongoing process of using a trained model to answer questions, generate images, or write code. Think of it like running the factory. Every ChatGPT response, every Claude answer, every Midjourney image is an inference." },
  { term: "GPU", def: "Graphics Processing Unit. A specialized chip originally built for rendering video game graphics, now repurposed as the workhorse of AI computation. NVIDIA\u2019s GPUs dominate the market." },
  { term: "Token", def: "The basic unit of text that AI models process. Roughly \u00be of a word. When companies talk about \u201ccost per million tokens,\u201d they mean the price of processing ~750,000 words." },
  { term: "Hyperscaler", def: "The handful of companies (Amazon, Microsoft, Google, Meta, Oracle) that operate the world\u2019s largest cloud computing networks and are spending hundreds of billions on AI infrastructure." },
  { term: "LLM", def: "Large Language Model. The type of AI system behind ChatGPT, Claude, and Gemini. Trained on enormous text datasets to understand and generate human language." },
  { term: "Foundation Model", def: "A large, general-purpose AI model (like GPT-4 or Claude) that can be adapted for many tasks. Called \u201cfoundation\u201d because other products and applications are built on top of it." },
  { term: "Open-weight", def: "A model whose internal parameters are publicly released so anyone can download, modify, and run it (e.g., Meta\u2019s Llama, DeepSeek). Contrast with \u201cclosed\u201d models like GPT-4 that you can only access via API." },
  { term: "CUDA", def: "NVIDIA\u2019s proprietary software platform for GPU programming. With 4M+ developers locked into the ecosystem, CUDA is arguably NVIDIA\u2019s deepest competitive moat." },
  { term: "HBM", def: "High Bandwidth Memory. A specialized, expensive type of memory stacked vertically on AI chips. SK Hynix controls 62% of the market. Supply constraints limit total AI chip production." },
  { term: "CoWoS", def: "Chip on Wafer on Substrate. TSMC\u2019s advanced packaging technology that connects AI chips to HBM memory. Capacity is fully booked through 2026 and is a key supply bottleneck." },
  { term: "TPU", def: "Tensor Processing Unit. Google\u2019s custom AI chip, designed specifically for machine learning workloads. Now in its 7th generation (Ironwood) and available to external customers like Anthropic." },
  { term: "REIT", def: "Real Estate Investment Trust. A company that owns income-producing real estate. Data center REITs like Equinix and Digital Realty own the physical buildings that house AI infrastructure." },
  { term: "PPA", def: "Power Purchase Agreement. A long-term contract (often 15\u201320 years) where a data center operator agrees to buy electricity at a fixed price from a power generator. The currency of AI infrastructure deals." },
  { term: "SMR", def: "Small Modular Reactor. A next-generation nuclear reactor design that\u2019s smaller, cheaper, and faster to build than traditional nuclear plants. Over 22 GW of SMR projects are in development for AI data centers." },
  { term: "ARR", def: "Annual Recurring Revenue. The annualized value of a company\u2019s subscription or contract revenue. The standard metric for measuring SaaS and AI company growth." },
  { term: "EBITDA", def: "Earnings Before Interest, Taxes, Depreciation, and Amortization. A measure of a company\u2019s operating profitability before capital structure and accounting decisions." },
  { term: "TAM", def: "Total Addressable Market. The total revenue opportunity available if a product achieves 100% market share. Used to frame how large an opportunity could theoretically become." },
  { term: "MoE", def: "Mixture of Experts. A model architecture where only a fraction of the model\u2019s parameters activate for each request, dramatically reducing compute cost. Used by DeepSeek V3 (671B total / 37B active) and Llama 4." },
  { term: "RAG", def: "Retrieval-Augmented Generation. A technique that connects an AI model to external data sources (databases, documents) so it can answer questions using information it wasn\u2019t trained on." },
  { term: "MCP", def: "Model Context Protocol. Anthropic\u2019s open standard for connecting AI systems to external tools and data sources. Adopted by OpenAI, Google, Microsoft, and AWS. Donated to the Linux Foundation." },
  { term: "RLHF", def: "Reinforcement Learning from Human Feedback. A training technique where human evaluators rate AI outputs, and the model learns to produce responses humans prefer. Used by OpenAI, Anthropic, and others." },
  { term: "Capex", def: "Capital Expenditure. Money spent on physical assets like data centers, servers, and chips. Hyperscaler capex is projected at $600\u2013690B in 2026." },
  { term: "NVLink", def: "NVIDIA\u2019s proprietary high-speed interconnect that links GPUs together inside a server. The GB200 NVL72 connects 72 GPUs via NVLink 5.0 at 1.8 TB/s." },
];

/* ═══════════════════════════════════════
   CITATIONS
   ═══════════════════════════════════════ */
const CITATIONS = [
  { id: 1, short: "IEA Energy & AI", full: "International Energy Agency, \u201cEnergy Demand from AI,\u201d 2025." },
  { id: 2, short: "WEF Data Centres", full: "World Economic Forum, \u201cHow Data Centres Can Avoid Doubling Their Energy Use by 2030,\u201d Dec 2025." },
  { id: 3, short: "LBNL Queues", full: "Lawrence Berkeley National Laboratory, \u201cQueued Up: Characteristics of Power Plants Seeking Transmission Interconnection,\u201d 2025." },
  { id: 4, short: "POWER Magazine", full: "POWER Magazine, \u201cTransformers in 2026: Shortage, Scramble, or Self-Inflicted Crisis?,\u201d 2026." },
  { id: 5, short: "Tom\u2019s Hardware", full: "Tom\u2019s Hardware, \u201cHalf of Planned US Data Center Builds Have Been Delayed or Canceled,\u201d 2026." },
  { id: 6, short: "Introl Nuclear", full: "Introl Blog, \u201cNuclear Power for AI: Inside the Data Center Energy Deals,\u201d 2025." },
  { id: 7, short: "Introl SMR", full: "Introl Blog, \u201cSMR Nuclear for Data Centers Accelerates,\u201d 2025." },
  { id: 8, short: "GMI Cooling", full: "Global Market Insights, \u201cData Center Liquid Cooling Market Size & Share Report, 2035.\u201d" },
  { id: 9, short: "CreditSights Capex", full: "CreditSights, \u201cTechnology: Hyperscaler Capex 2026 Estimates,\u201d 2026." },
  { id: 10, short: "Introl Capex", full: "Introl Blog, \u201cHyperscaler CapEx Hits $600B in 2026,\u201d Jan 2026." },
  { id: 11, short: "ITIF Labor", full: "ITIF, \u201cConstruction Industry Facing a 439,000-Worker Shortage Driven by Data Centers,\u201d Jan 2026." },
  { id: 12, short: "Fortune Labor", full: "Fortune, \u201cConstruction Workers Earning Up to 30% More in the Data Center Boom,\u201d Dec 2025." },
  { id: 13, short: "Introl Opposition", full: "Introl Blog, \u201cData Center Opposition: The $64B Financial Risk,\u201d 2025." },
  { id: 14, short: "NVIDIA FY2025", full: "NVIDIA Corp, Form 8-K (Q4 FY2025 Earnings), SEC Filing." },
  { id: 15, short: "NVIDIA Q1 FY2026", full: "NVIDIA Corp, Form 8-K (Q1 FY2026 Earnings), SEC Filing." },
  { id: 16, short: "Silicon Analysts GPU Share", full: "Silicon Analysts, \u201cNVIDIA GPU Market Share 2024\u20132026: 87% Peak, What Comes Next.\u201d" },
  { id: 17, short: "AMD Q3 2025", full: "AMD, Form 8-K (Q3 2025 Earnings), SEC Filing." },
  { id: 18, short: "TrendForce CoWoS", full: "TrendForce, \u201cTSMC\u2019s CoWoS-L/S Reportedly Fully Booked,\u201d Dec 2025." },
  { id: 19, short: "Dell\u2019Oro Networking", full: "Dell\u2019Oro Group, \u201cAI Back-End Networks Continue Their Shift to Ethernet,\u201d Q3 2025." },
  { id: 20, short: "Synergy/Canalys Cloud", full: "Synergy Research / Canalys, Cloud Infrastructure Market Share Reports, Q3 2025." },
  { id: 21, short: "CoreWeave IPO", full: "HyperFRAME Research, \u201cPutting the CoreWeave IPO Under the Microscope,\u201d Mar 2025." },
  { id: 22, short: "Sacra OpenAI", full: "Sacra, \u201cOpenAI Revenue, Valuation & Funding,\u201d 2026." },
  { id: 23, short: "CNBC OpenAI", full: "CNBC, \u201cOpenAI Closes Funding Round at an $852 Billion Valuation,\u201d Mar 2026." },
  { id: 24, short: "SaaStr Anthropic", full: "SaaStr, \u201cAnthropic Just Hit $14 Billion in ARR. Up From $1 Billion Just 14 Months Ago.\u201d" },
  { id: 25, short: "Bloomberg Anthropic", full: "Bloomberg, \u201cAnthropic Tops $30 Billion Run Rate, Seals Broadcom Deal,\u201d Apr 2026." },
  { id: 26, short: "CNBC Anthropic", full: "CNBC, \u201cAnthropic Closes $30 Billion Funding Round at $380 Billion Valuation,\u201d Feb 2026." },
  { id: 27, short: "Stanford HAI", full: "Stanford HAI, \u201cThe 2025 AI Index Report.\u201d" },
  { id: 28, short: "DeepSeek Wikipedia", full: "Wikipedia, \u201cDeepSeek.\u201d" },
  { id: 29, short: "Menlo Enterprise AI", full: "Menlo Ventures, \u201c2025: The State of Generative AI in the Enterprise.\u201d" },
  { id: 30, short: "Cursor Revenue", full: "AI Funding Tracker, \u201cCursor Revenue: How the $29B AI Coding Tool Makes Money.\u201d" },
  { id: 31, short: "Copilot Stats", full: "GitHub / Microsoft, Copilot adoption statistics via public earnings calls." },
  { id: 32, short: "Harvey Sacra", full: "Sacra, \u201cHarvey Revenue, Valuation & Funding.\u201d" },
  { id: 33, short: "Midjourney Revenue", full: "Getlatka, \u201cHow Midjourney Hit $500M Revenue.\u201d" },
  { id: 34, short: "Figure AI Series C", full: "Figure AI, \u201cFigure Exceeds $1B in Series C Funding at $39B Post-Money Valuation.\u201d" },
  { id: 35, short: "Scale AI Valuation", full: "Sacra/TSG Invest, Scale AI Revenue & Valuation Reports, 2025\u20132026." },
  { id: 36, short: "EU AI Act", full: "Kennedys Law, \u201cThe EU AI Act Implementation Timeline,\u201d 2026." },
  { id: 37, short: "Deloitte AI ROI", full: "Deloitte, \u201cAI ROI: The Paradox of Rising Investment and Elusive Returns.\u201d" },
  { id: 38, short: "LangChain Series B", full: "LangChain Blog, \u201cLangChain Raises $125M to Build the Platform for Agent Engineering.\u201d" },
  { id: 39, short: "JLARC Virginia", full: "JLARC, \u201cData Centers in Virginia,\u201d Virginia General Assembly, 2024." },
  { id: 40, short: "Equinix FY2024", full: "Equinix, Form 8-K (FY2024 Earnings), SEC Filing." },
  { id: 41, short: "TSMC FY2025", full: "TSMC, Form 6-K (Q4 2025 Earnings), SEC Filing." },
  { id: 42, short: "Futurum $690B", full: "Futurum Group, \u201cAI Capex 2026: The $690B Infrastructure Sprint.\u201d" },
  { id: 43, short: "PwC Middle East DC", full: "PwC, \u201cUnlocking the Data Centre Opportunity in the Middle East.\u201d" },
  { id: 44, short: "Sovereign Cloud", full: "Fortune Business Insights, \u201cSovereign Cloud Market Size & Share Report, 2034.\u201d" },
];

/* ═══════════════════════════════════════
   LAYER DATA
   ═══════════════════════════════════════ */
const LAYERS = [
  {
    id:"power",n:"01",title:"Power, Water & Cooling",short:"Power",color:"#D97706",
    pull:["120\u2013140 kW","Power draw of a single AI rack \u2014 enough for 40\u201350 homes"],
    whatItDoes:"AI chips are extraordinarily power-hungry. A single rack of NVIDIA\u2019s latest hardware draws 120\u2013140 kilowatts \u2014 enough to power 40\u201350 homes. Training a frontier AI model can consume as much electricity as a small city uses in a month. This layer covers the electricity generation, transmission, and thermal management that keeps data centers running.",
    players:[
      ["Constellation Energy","CEG","Nuclear power provider","Signed a $16B deal with Microsoft to restart Three Mile Island\u2019s reactor for AI"],
      ["Vistra","VST","Natural gas & nuclear generation","Both CEG and VST have rallied 700%+ since 2021 on AI demand"],
      ["NRG Energy","NRG","Power generation","445 MW of premium data center contracts signed"],
      ["Dominion Energy","D","Virginia utility","Forecasts 9 GW of new data center demand in Virginia alone"],
      ["Vertiv","VRT","Cooling systems & power management","Market leader in liquid cooling for AI racks; ~$50B market cap"],
      ["Schneider Electric","","Electrical distribution & cooling","Acquired Motivair in 2025 for liquid cooling capabilities"],
      ["Eaton","ETN","Electrical switchgear & UPS systems","Critical supplier of power distribution equipment"],
      ["GE Vernova","GEV","Power generation equipment & gas turbines","Makes the turbines and transformers that feed the grid"],
    ],
    playersExtra:"Nuclear startups to watch: Oklo (Meta\u2019s 6.6 GW deal), Kairos Power (Google\u2019s 500 MW), X-energy (Amazon\u2019s $500M investment). Over 22 GW of small modular reactor (SMR) projects are in development.",
    economics:"Data center electricity costs run $0.04\u20130.08/kWh with long-term contracts, but hyperscalers are paying premiums of 2\u20133x for guaranteed supply. Power Purchase Agreements (PPAs) \u2014 long-term fixed-price electricity contracts \u2014 have become the currency of AI infrastructure deals, with terms stretching 15\u201320 years and total values reaching tens of billions.\n\nThe liquid cooling market alone is $5\u20137 billion today, growing 18\u201325% annually. Vertiv posted 29% revenue growth with 20.5% operating margins in Q3 2025.",
    risks:[
      ["Grid bottleneck is real","Getting new power connected to the grid takes 4\u20138 years. The U.S. interconnection queue has 2,300+ GW of requests but only 13% historically get built."],
      ["Transformer shortage","Large power transformers now take 80\u2013120 weeks to deliver. Prices are up 77% since 2019. This single component is delaying entire campuses."],
      ["Half of planned U.S. data centers are delayed or canceled","Power infrastructure shortages are the primary cause."],
      ["Community opposition","$64B in projects blocked or delayed since 2023 across 40+ states. Noise, water use, and grid strain are real concerns."],
      ["Utility valuations may be overextended","CEOs of both Constellation and Vistra have warned that developer demand forecasts may overstate actual buildout by 3\u20135x."],
    ],
    opps:[
      ["Supply-constrained pricing power","Power and grid equipment (transformers, switchgear, cooling) is the most supply-constrained layer \u2014 pricing power is strong and order visibility extends years."],
      ["Nuclear renaissance","$10B+ committed by tech giants, with Goldman projecting a $10 trillion nuclear industry by 2040. Over 22 GW of SMR projects in development."],
      ["Cooling as structural winner","Every next-generation AI chip requires liquid cooling. Air cooling is physically impossible at current power densities. The transition is irreversible."],
    ],
    stats:[
      ["120\u2013140 kW","per AI rack","NVIDIA GB200 NVL72 spec sheet; Sunbird DCIM analysis",null],
      ["80\u2013120 wk","transformer lead time","POWER Magazine, \u201cTransformers in 2026\u201d",4],
      ["$10B+","nuclear commitments","Introl, nuclear data center energy deals analysis",6],
      ["22 GW","SMR projects","Introl, SMR nuclear for data centers report",7],
    ],
  },
  {
    id:"datacenters",n:"02",title:"Data Center Construction & Operations",short:"Data Centers",color:"#2563EB",
    pull:["$600\u2013690B","Projected hyperscaler capital expenditure in 2026 \u2014 more than Sweden\u2019s GDP"],
    whatItDoes:"Data centers are the physical buildings that house AI infrastructure \u2014 the servers, networking equipment, storage, and cooling systems. This layer covers the companies that build, own, and operate these facilities, as well as the construction supply chain (steel, concrete, electrical equipment, skilled labor).",
    players:[
      ["Equinix","EQIX","Largest global data center REIT","260+ facilities in 33 countries; $8.75B revenue at 48% EBITDA margins"],
      ["Digital Realty","DLR","Second-largest data center REIT","312 data centers; $7B joint venture with Blackstone"],
      ["QTS","","Hyperscale-focused operator (Blackstone)","Major AI-ready campus developer"],
      ["CyrusOne","","Hyperscale operator (KKR/GIP)","Aggressive expansion in key markets"],
      ["STACK Infrastructure","","Hyperscale developer","Large-scale campus builds in emerging markets"],
      ["EdgeConneX","","Edge & hyperscale operator","Expanding into international markets"],
    ],
    playersExtra:"The hyperscalers themselves (Amazon, Google, Microsoft, Meta, Oracle) are increasingly building their own facilities rather than leasing, now accounting for 44% of global capacity (up from 30% six years ago).",
    economics:"This is the most capital-intensive layer in the value chain. Combined hyperscaler capex is projected at $600\u2013690 billion in 2026 \u2014 up from $256B in 2024. To put that in perspective, that\u2019s more than the GDP of Sweden, spent in a single year, mostly on buildings and equipment.\n\nIndividual commitments: Amazon ~$200B, Meta $115\u2013135B, Alphabet $91\u201393B, Oracle ~$50B. Capital intensity ratios have reached 45\u201357% of revenue \u2014 these tech companies now spend like utilities.\n\nData center REITs earn 48% EBITDA margins on 10\u201315 year leases, providing visibility that most tech businesses lack. Northern Virginia alone hosts 4,000\u20134,900 MW of capacity with a 0.5% vacancy rate.",
    risks:[
      ["Construction labor shortage","The U.S. faces a 439,000-worker gap in construction trades. Data center roles now command 25\u201330% wage premiums, with some safety supervisors earning $225,000+."],
      ["Permitting risk","Local opposition is rising. Zoning battles can add 1\u20133 years to timelines."],
      ["Overbuilding risk","If AI demand growth slows or efficiency gains reduce compute requirements, billions in committed capex could become stranded assets."],
      ["Debt levels are historic","Hyperscalers raised $108B in debt in 2025 alone; Morgan Stanley projects $1.5 trillion in total issuance ahead. This works at current growth rates but creates fragility."],
    ],
    opps:[
      ["Secured power as moat","Data center REITs with secured power and land have multi-year competitive advantages that are extremely difficult to replicate."],
      ["Emerging geographies","Middle East: $100B+ committed; India: 8 GW targeted by 2030; Southeast Asia: $30B+ market by 2030. Greenfield growth with less competitive intensity."],
      ["Construction supply chain","Electrical equipment manufacturers, specialized contractors, and modular data center builders are a less crowded way to play this theme."],
    ],
    stats:[
      ["$600\u2013690B","hyperscaler capex \u201926","CreditSights & Introl capex estimates",9],
      ["0.5%","NoVA vacancy","JLARC Virginia Data Center Study",39],
      ["439K","worker shortage","ITIF, construction industry data center labor report",11],
      ["$108B","debt raised \u201925","CreditSights hyperscaler debt analysis",9],
    ],
  },
  {
    id:"semis",n:"03",title:"Semiconductors & AI Hardware",short:"Chips",color:"#059669",
    pull:["73\u201378%","NVIDIA\u2019s gross margins \u2014 the highest in the semiconductor industry"],
    whatItDoes:"This is the brain of the operation. AI chips (GPUs and specialized processors) do the actual mathematical computation that makes AI work. This layer also includes the memory chips that feed data to processors, the networking equipment that connects thousands of chips together, and the semiconductor foundries that manufacture everything.",
    players:[
      ["NVIDIA","NVDA","Dominant GPU maker","~80% market share in AI accelerators; $115B data center revenue in FY2025"],
      ["AMD","AMD","Second GPU maker","MI300X deployed at Microsoft, Meta, IBM; OpenAI committed to 6 GW of MI450 chips"],
      ["TSMC","TSM","Sole manufacturer of advanced AI chips","Makes chips for NVIDIA, AMD, Apple, and all major AI companies; 59.9% gross margins"],
      ["Broadcom","AVGO","Custom chip designer & networking","Designs Google\u2019s TPUs; now working with Meta and OpenAI; 68% EBITDA margins"],
      ["SK Hynix","","High-bandwidth memory (HBM) leader","62% share of HBM market \u2014 the memory that AI chips require"],
      ["Samsung / Micron","","HBM and DRAM makers","Competing for the $35\u2013100B HBM market"],
      ["Arista Networks","ANET","Data center networking switches","$10.6B revenue, 64% gross margins; connects GPU clusters"],
      ["Marvell","MRVL","Custom AI silicon & networking","Growing role in custom chip programs"],
    ],
    playersExtra:"Custom silicon efforts (hyperscalers building their own chips): Google\u2019s TPU v7, Amazon\u2019s Trainium3, Microsoft\u2019s Maia 200, Meta\u2019s MTIA. These now handle ~40% of AI inference workloads.\n\nAI chip startups: Cerebras ($8.1B valuation, wafer-scale chip), Groq (acquired by NVIDIA for ~$20B), Tenstorrent ($2.6B valuation, Jim Keller-led).",
    economics:"NVIDIA earns 73\u201378% gross margins \u2014 the highest in the semiconductor industry \u2014 because its chips and software ecosystem (CUDA, with 4 million+ developers) create enormous switching costs. A single GB200 NVL72 rack (72 interconnected GPUs) costs approximately $3 million.\n\nThe total AI accelerator market is projected to grow from $242B in 2025 to $1.2 trillion by 2030. Even as NVIDIA\u2019s market share moderates from 86% to ~75%, its revenue continues growing because the pie is expanding so rapidly.\n\nTSMC\u2019s advanced packaging (called CoWoS) is fully booked through 2026. NVIDIA alone takes 50%+ of that capacity. This is a physical manufacturing bottleneck \u2014 you can\u2019t just build more of these facilities overnight.",
    risks:[
      ["NVIDIA concentration risk","CUDA\u2019s dominance means nearly the entire AI industry depends on one company\u2019s ecosystem. If NVIDIA stumbles on execution (as happened briefly with early Blackwell yields), ripple effects hit everyone."],
      ["TSMC Taiwan risk","This is the single largest point of failure in the AI value chain. TSMC manufactures virtually every advanced AI chip. A disruption to Taiwan operations (geopolitical or natural disaster) would halt AI progress globally."],
      ["Custom silicon is a slow but real threat","As hyperscalers build their own chips, NVIDIA\u2019s addressable market for inference could shrink by 30\u201340% over 5 years. Training remains NVIDIA\u2019s stronghold."],
      ["The memory bottleneck","HBM supply constraints limit how many AI chips can actually be produced, regardless of GPU manufacturing capacity."],
    ],
    opps:[
      ["AMD as NVIDIA challenger","OpenAI\u2019s MI450 commitment is transformative, and AMD trades at roughly 1/10th NVIDIA\u2019s market cap. ROCm software is narrowing the gap."],
      ["TSMC\u2019s Taiwan discount","P/E ~28\u201331x despite being essential to every combatant. If geopolitical risk eases, significant rerating potential."],
      ["Broadcom\u2019s custom ASIC position","Designs chips for Google, Meta, and now OpenAI. Earns money regardless of which hyperscaler \u201cwins.\u201d"],
      ["AI networking growth","Arista benefits from every new GPU cluster. AI networking is a $20B+ market growing 40%+ annually. Ethernet now dominates over InfiniBand."],
    ],
    stats:[
      ["73\u201378%","NVIDIA gross margin","NVIDIA FY2025 earnings (SEC filing)",14],
      ["$3M","per GPU rack","NVIDIA GB200 NVL72 pricing; tech industry reports",null],
      ["62%","SK Hynix HBM share","Industry estimates; Introl HBM analysis",null],
      ["$1.2T","chip TAM by 2030","Silicon Analysts market share analysis",16],
    ],
  },
  {
    id:"cloud",n:"04",title:"Cloud Computing & GPU Rental",short:"Cloud",color:"#7C3AED",
    pull:["50\u201375%","How much GPU rental prices have fallen in two years"],
    whatItDoes:"Most companies building AI products don\u2019t own their own data centers or chips. They rent computing power from cloud providers \u2014 paying by the hour, minute, or even per-request for access to GPU clusters. This layer is the delivery mechanism that turns raw infrastructure into accessible AI compute.",
    players:[
      ["AWS (Amazon)","AMZN","Largest cloud provider","~30% market share, $130B annual revenue, $200B backlog"],
      ["Microsoft Azure","MSFT","Second-largest cloud","~21% share; deep OpenAI integration"],
      ["Google Cloud","GOOGL","Fastest-growing major cloud","~12% share; 50% YoY growth in Q4 2025; owns TPU hardware"],
      ["Oracle Cloud","ORCL","Surprise AI infrastructure player","$553B in remaining contracts; Stargate partner"],
      ["CoreWeave","CRWV","GPU-specialized cloud","IPO\u2019d March 2025; $5.1B revenue; 359% stock gain by June"],
      ["Lambda Labs","","GPU cloud for AI researchers","$505M annualized revenue, $4B valuation"],
      ["Crusoe Energy","","Clean-energy AI compute","$10B+ valuation; building 1.2 GW Stargate campus"],
      ["Together AI","","Inference-focused provider","$300M+ annualized revenue; optimized for running models cheaply"],
      ["Fireworks AI","","Fast inference platform","$315M annualized revenue, $4B valuation"],
    ],
    playersExtra:null,
    economics:"The cloud market crossed $100 billion in quarterly revenue for the first time in Q3 2025 (~$395B annually, growing 28\u201329%).\n\nGPU rental prices have fallen dramatically as supply increases. NVIDIA H100 chips went from ~$8/hour at launch to $2\u20134/hour \u2014 a 50\u201375% decline. But next-generation chips (B200, GB200) still command premiums due to limited availability.\n\nCloud providers typically earn 55\u201365% gross margins on compute services. The GPU cloud startups (CoreWeave, Lambda) earn lower margins but are growing faster. CoreWeave\u2019s key risk: Microsoft accounts for 67% of its revenue, and it carries $16.5B in liabilities.\n\nOracle is the wildcard \u2014 its $553B backlog is extraordinary but its capital intensity (57\u201386% of revenue) means projected negative free cash flow of $34B over five years. It\u2019s essentially betting the company on AI infrastructure.",
    risks:[
      ["Commoditization is real","As more GPU supply comes online, pricing power erodes. H100 pricing fell 64\u201375% in two years."],
      ["Customer concentration","CoreWeave (67% Microsoft), Oracle (heavy OpenAI dependence) \u2014 single-customer risk is elevated."],
      ["Sovereign cloud fragmentation","35+ governments requiring local AI compute creates a fragmented market that\u2019s harder for any single provider to dominate."],
      ["The hyperscaler flywheel is hard to beat","AWS, Azure, and GCP have distribution, brand trust, and complementary services that GPU startups lack."],
    ],
    opps:[
      ["Sovereign cloud growth","$195B market in 2026 growing 24.6% annually. France ($109B), Japan, Saudi Arabia, India are major spenders. Governments treating AI compute as critical national infrastructure."],
      ["Inference-optimized providers","Together AI and Fireworks offer 20\u201340% cost savings vs. hyperscalers for specific workloads \u2014 a meaningful wedge as inference becomes the dominant cost."],
      ["Oracle\u2019s asymmetric bet","$553B backlog could generate enormous value if converted to recurring revenue. High-conviction position for those comfortable with the balance sheet risk."],
    ],
    stats:[
      ["$395B","annual cloud revenue","Synergy Research / Canalys Q3 2025 reports",20],
      ["50\u201375%","GPU price decline","IntuitionLabs H100 pricing comparison; cloud provider rate cards",null],
      ["$553B","Oracle backlog","Oracle FY2025 earnings; FinancialContent analysis",null],
      ["$195B","sovereign cloud mkt","Fortune Business Insights sovereign cloud report",44],
    ],
  },
  {
    id:"models",n:"05",title:"Foundation Models",short:"Models",color:"#DC2626",
    pull:["40x","How much GPT-4-level inference costs have fallen in two years"],
    whatItDoes:"Foundation models are the large AI systems \u2014 like GPT-4, Claude, Gemini, and Llama \u2014 that understand language, generate text, write code, and analyze images. This layer covers the companies that build these models, the massive compute required to train them, and the increasingly competitive dynamics of the market.",
    players:[
      ["OpenAI","","ChatGPT maker","$25B annualized revenue; 910M weekly users; $852B valuation"],
      ["Anthropic","","Claude maker","$30B ARR (from $1B just 15 months ago); $380B valuation"],
      ["Google DeepMind","GOOGL","Gemini models","Leverages Search, Android, Workspace distribution"],
      ["Meta AI","META","Llama open-weight models","Most-used open model family; embedded across 3B+ users"],
      ["Mistral","","European frontier model lab","Open-weight models popular with developers; $6B+ valuation"],
      ["xAI","","Grok models (Elon Musk)","Massive compute cluster (100K+ GPUs); integrated with X/Twitter"],
      ["Cohere","","Enterprise-focused model provider","Strong in retrieval and enterprise search use cases"],
      ["DeepSeek","","Chinese lab that shocked the industry","Trained competitive model for ~$6M vs. $100M+ for U.S. peers"],
    ],
    playersExtra:"Chinese labs: Alibaba (Qwen), ByteDance (Doubao), Baidu (Ernie), Zhipu AI, Moonshot AI (Kimi). China\u2019s Qwen has surpassed Meta\u2019s Llama as the most-downloaded open model family.\n\nOpen-weight vs. closed models: \u201cOpen-weight\u201d means the model\u2019s internal parameters are publicly released so anyone can download, modify, and run them (Meta\u2019s Llama, Mistral, DeepSeek). \u201cClosed\u201d means you can only access them through the company\u2019s API or chat interface (OpenAI\u2019s GPT-4, Anthropic\u2019s Claude). The gap between them has narrowed to just 1.7% on key benchmarks.\n\nSmall models: Microsoft Phi-4, Google Gemma, Apple\u2019s on-device models \u2014 these run on phones with 8 GB of RAM and handle many tasks competently. Deloitte projects 40% of enterprise AI workloads will run on small models by 2027.",
    economics:"Revenue growth is historic: OpenAI went from $6B to $25B in annual revenue in one year. Anthropic grew 30x in 15 months.\n\nBut margins are thin. OpenAI\u2019s gross margin is approximately 46%; Anthropic\u2019s is 38\u201340%. These are far below the 70%+ margins of traditional software companies, because inference (running the models for every user request) requires massive, ongoing GPU spending. Both companies project profitability only by 2027\u20132029. OpenAI\u2019s projected 2026 loss is $14 billion.\n\nThe commoditization signal is strong: the cost to run GPT-4-level inference has dropped from $60 per million tokens to under $1.50 \u2014 a 40x reduction in two years. Alibaba\u2019s Qwen 3 offers comparable performance at $0.38 per million tokens, 25\u201340x cheaper than U.S. frontier models.",
    risks:[
      ["Commoditization is the existential threat","Stanford found the gap between the best and 10th-best model narrowed from 11.9% to 5.4% in one year. If models become interchangeable, pricing collapses."],
      ["DeepSeek proved you don\u2019t need billions to compete","Its $6M training run matching frontier models challenged the assumption that compute spending = competitive advantage."],
      ["Valuations are extreme","OpenAI ($852B) and Anthropic ($380B) are valued at $1.2 trillion combined, on ~$55B in revenue with negative operating margins."],
      ["Open-weight models keep getting better","As Meta, DeepSeek, and Alibaba release increasingly capable free models, the willingness of enterprises to pay premium prices faces continuous pressure."],
    ],
    opps:[
      ["Distribution is the moat, not the model","OpenAI\u2019s brand, Anthropic\u2019s enterprise relationships (1,000+ customers spending $1M+), and Google\u2019s integration across Search/Android/Workspace are the real defensible assets."],
      ["Workflow-specific products","Claude Code\u2019s breakout ($2.5B ARR in 9 months) shows that pairing models with specific workflows creates stickier products than general-purpose chatbots."],
      ["The small model opportunity","Companies delivering \u201cgood enough\u201d AI on a user\u2019s own device (no cloud costs) could capture enormous enterprise value. Apple is quietly positioned here."],
      ["Chinese AI models","Competitive performance at a fraction of the cost, with fewer export control complications. Asymmetric opportunity for non-U.S. markets."],
    ],
    stats:[
      ["$25B","OpenAI revenue","Sacra & CNBC OpenAI valuation reporting",22],
      ["30x","Anthropic growth","SaaStr; Bloomberg; Anthropic reporting",24],
      ["40x","inference cost drop","Stanford HAI 2025 AI Index Report",27],
      ["1.7%","open vs closed gap","Stanford HAI benchmark analysis",27],
    ],
  },
  {
    id:"middleware",n:"06",title:"AI Middleware & Tooling",short:"Middleware",color:"#CA8A04",
    pull:["$2B","Scale AI\u2019s revenue \u2014 the standout in a layer where most companies face existential platform risk"],
    whatItDoes:"Between the foundation models and the applications people actually use sits a layer of infrastructure software \u2014 tools for running models efficiently, connecting them to data, organizing information for AI retrieval, labeling training data, and monitoring AI systems in production. Think of it as the plumbing between the AI brain and the products built on top of it.",
    players:[
      ["Scale AI","","Data labeling & AI evaluation","$2B revenue; $29B valuation; Meta bought 49% non-voting stake"],
      ["LangChain","","Framework for building AI applications","90M monthly downloads; 35% Fortune 500 adoption"],
      ["Pinecone","","Vector database","Was valued at $750M but reportedly exploring a sale"],
      ["Weights & Biases","","ML experiment tracking & monitoring","Standard tool for AI researchers and teams"],
      ["Baseten","","Inference serving platform","10x volume growth; $5B valuation with NVIDIA as investor"],
      ["CrewAI","","Multi-agent orchestration","Claims 60% Fortune 500 adoption"],
      ["Qdrant / Weaviate / Chroma","","Open-source vector databases","Growing alternatives to Pinecone"],
    ],
    playersExtra:null,
    economics:"This layer has the widest range of outcomes. Scale AI ($2B revenue, clear moat in data) looks like a durable business. But many middleware companies face the \u201cfeature vs. product\u201d risk \u2014 the problem they solve might get absorbed into a larger platform.\n\nVector databases illustrate this perfectly: Pinecone was the early leader, but PostgreSQL (a free database) added vector search capabilities, and now every major database vendor offers similar functionality. The standalone market opportunity is narrowing even as the underlying need grows.\n\nLangChain has massive adoption (90M downloads) but modest revenue ($16M ARR), suggesting developers love the open-source tool but enterprises haven\u2019t fully committed to paying for it.",
    risks:[
      ["Feature absorption","AWS, Azure, and GCP are aggressively adding inference, orchestration, and vector search to their platforms. When your product becomes a checkbox feature for a hyperscaler, pricing power evaporates."],
      ["Open-source competition","Most categories have strong open-source alternatives, making it hard to charge premium prices."],
      ["Rapid technology shifts","The \u201cright\u201d way to build AI applications is changing every 6 months. Today\u2019s critical tool could be obsolete next year."],
    ],
    opps:[
      ["Scale AI\u2019s data moat","Its data moat strengthens with scale, government contracts (U.S. DoD) provide durable revenue, and the Meta stake validates strategic importance. Data quality is increasingly the differentiator in AI."],
      ["AI safety & compliance tooling","The EU AI Act\u2019s high-risk provisions take effect August 2026. Only 29% of companies feel equipped to defend against AI threats \u2014 creating a compliance-driven buying cycle."],
      ["Inference optimization","Companies that make AI cheaper to run (Baseten, Fireworks, Together AI) capture real economic value as enterprises discover running models is far more expensive than licensing them."],
    ],
    stats:[
      ["$29B","Scale AI valuation","Sacra; TSG Invest reports",35],
      ["90M","LangChain dl/mo","LangChain Series B announcement",38],
      ["$16M","LangChain ARR","Getlatka company data",null],
      ["29%","cos. AI-ready","Cisco AI Defense Framework report",null],
    ],
  },
  {
    id:"apps",n:"07",title:"AI Applications & Interfaces",short:"Apps",color:"#0891B2",
    pull:["$1.7B \u2192 $37B","Enterprise AI app spending, 2023 to 2025"],
    whatItDoes:"This is the layer most people interact with: the chat interfaces (ChatGPT, Claude), coding tools (Cursor, GitHub Copilot), enterprise products (Microsoft Copilot for Office), vertical-specific applications (legal AI, healthcare AI), and creative tools (Midjourney, Runway). This is where AI capabilities get packaged into products that solve specific problems.",
    players:[
      ["ChatGPT, Claude, Gemini, Perplexity","","Chat interfaces","ChatGPT: 910M weekly users; Claude: fastest-growing on enterprise revenue"],
      ["Cursor, GitHub Copilot, Claude Code, Windsurf","","Coding tools","Cursor: $1B to $2B ARR in record time; Copilot: 4.7M paid subscribers"],
      ["Microsoft Copilot for M365, Salesforce Agentforce, ServiceNow","","Enterprise AI","M365 Copilot: 16.1M seats, but only 35.8% actively used"],
      ["Harvey","","Legal AI","$195M ARR (up 3.9x), $11B valuation, 100K lawyers"],
      ["Nuance DAX Copilot, Abridge","","Healthcare AI","Ambient clinical scribes: $600M market, growing 2.4x YoY"],
      ["Midjourney, DALL-E, Runway, Pika","","Image / video generation","Midjourney: $500M revenue, zero external funding, ~130 employees"],
      ["Perplexity, Google AI Overviews","","AI search","Perplexity: fastest-growing search product in a decade"],
    ],
    playersExtra:null,
    economics:"Enterprise AI application spending surged from $1.7B in 2023 to $37B in 2025 \u2014 now 6% of the global software market and the fastest-growing category in software history.\n\nCoding tools are the confirmed \u201ckiller app\u201d: $4B market in 2025, capturing 55% of all departmental AI spending. Cursor reached $1B ARR faster than any B2B software company in history. GitHub Copilot generates 46% of all code written by active users and makes developers 55% faster.\n\nVertical AI applications (legal, healthcare) show the strongest margin potential because domain expertise creates switching costs. Harvey charges law firms premium prices because lawyers can\u2019t easily evaluate or switch between AI tools.\n\nMidjourney is the capital efficiency champion: $500M in revenue with zero outside funding and ~130 employees. This demonstrates that if you find a focused use case, you don\u2019t need billions in capital.",
    risks:[
      ["The \u201cshelfware\u201d problem","Microsoft Copilot for M365 has 16.1M paid seats but only 35.8% active usage (vs. 83.1% for ChatGPT). If enterprises can\u2019t demonstrate ROI, renewals will suffer."],
      ["AI ROI gap","MIT found 95% of enterprise AI pilots fail to deliver measurable financial returns. Only 14% of CFOs see clear impact. 42% of companies abandoned most AI projects in 2025. Yet 85% increased spending."],
      ["Model commoditization flows upward","If the underlying AI models become interchangeable, application-layer companies lose the ability to differentiate on \u201cintelligence\u201d and must compete on UX, data, and workflow integration."],
      ["Incumbent response","Salesforce, ServiceNow, and Microsoft are embedding AI into existing products. Startups must build faster than incumbents can integrate."],
    ],
    opps:[
      ["Vertical AI is highest-conviction","Domain-specific AI companies (legal, healthcare, finance) can charge premium prices because they solve regulated, high-stakes problems. Harvey\u2019s 3.9x revenue growth validates this."],
      ["Coding tools are proven","The productivity gains are measurable and large. This is the one AI application category where ROI is consistently demonstrable."],
      ["Workflow integration as moat","Applications that deeply integrate into existing workflows (EHR systems, CLM systems, IDEs) create stickiness that chatbot interfaces lack."],
      ["Agentic AI is the next platform shift","Anthropic\u2019s MCP has become the industry standard. 83% of organizations plan to deploy AI agents, though only 11% have reached production."],
    ],
    stats:[
      ["$37B","AI app spend \u201925","Menlo Ventures, State of Generative AI in the Enterprise",29],
      ["$1\u2192$2B","Cursor ARR","AI Funding Tracker; Cursor valuation reporting",30],
      ["46%","code from Copilot","GitHub / Microsoft public reporting",31],
      ["95%","pilots fail ROI","Deloitte AI ROI report; MIT research",37],
    ],
  },
  {
    id:"robotics",n:"08",title:"Robotics & Embodied AI",short:"Robotics",color:"#DB2777",
    pull:["$40T+","The global physical labor market \u2014 the prize if robotics works"],
    whatItDoes:"This is the speculative layer: AI systems that interact with the physical world. Humanoid robots, autonomous systems, and AI-powered hardware represent the longest-term opportunity in the value chain \u2014 potentially transformative, but currently pre-revenue.",
    players:[
      ["Figure AI","","Humanoid robots","$39B valuation after $1B+ Series C; backed by NVIDIA, Microsoft, OpenAI"],
      ["Tesla Optimus","TSLA","Humanoid robot program","Musk claims it will be \u201c80% of Tesla\u2019s value\u201d; V3 prototype shown"],
      ["Physical Intelligence (\u03c0)","","General-purpose robot AI","Building foundation models for robot manipulation"],
      ["Boston Dynamics","","Advanced robotics pioneer (Hyundai)","Commercial deployments in warehouses and construction"],
    ],
    playersExtra:null,
    economics:"Goldman Sachs projects the humanoid robotics market at $38 billion by 2035. More bullish estimates reach $5\u20137 trillion by 2050. But current revenue is essentially zero. Figure AI\u2019s $39B valuation and Tesla\u2019s robotics-driven price premium are entirely based on long-term optionality.",
    risks:[
      ["Extreme valuation-to-revenue disconnect","Tens of billions in valuation on near-zero revenue is a hallmark of speculative markets."],
      ["Hardware is hard","Physical robots face manufacturing, safety, regulatory, and durability challenges that software doesn\u2019t."],
      ["Timeline uncertainty","Mass production of useful humanoid robots could be 3 years away or 15 years away."],
    ],
    opps:[
      ["TAM supremacy","If robotics works, the TAM dwarfs everything else on this list. Physical labor is a $40+ trillion annual market globally."],
      ["AI compounding","Every advance in reasoning, vision, and planning makes robots more capable without requiring hardware changes."],
      ["Option value","The asymmetry between current investment and potential market size is compelling \u2014 but position sizing should reflect the uncertainty."],
    ],
    stats:[
      ["$39B","Figure AI valuation","Figure AI Series C press release",34],
      ["$38B","TAM by 2035","Goldman Sachs humanoid robotics market estimate",null],
      ["$40T+","global labor mkt","ILO / World Bank global labor market data",null],
      ["~$0","current revenue","All major robotics companies report pre-revenue status",null],
    ],
  },
];

const SUMMARY=[
  {layer:"Power & Cooling",moat:"Very strong",n:5,margin:"15\u201325% operating",commod:"Low",color:"#D97706"},
  {layer:"Data Centers",moat:"Strong",n:4,margin:"35\u201348% EBITDA",commod:"Low\u2013Med",color:"#2563EB"},
  {layer:"Semiconductors",moat:"Very strong",n:5,margin:"60\u201378% gross",commod:"Low",color:"#059669"},
  {layer:"Cloud",moat:"Medium",n:3,margin:"55\u201365% gross",commod:"Med\u2013High",color:"#7C3AED"},
  {layer:"Models",moat:"Weakening",n:2,margin:"38\u201346% gross",commod:"High",color:"#DC2626"},
  {layer:"Middleware",moat:"Weak\u2013Med",n:2,margin:"Varies",commod:"High",color:"#CA8A04"},
  {layer:"Applications",moat:"Med\u2013Strong",n:4,margin:"60\u201380%",commod:"Medium",color:"#0891B2"},
  {layer:"Robotics",moat:"Unknown",n:0,margin:"Pre-revenue",commod:"Unknown",color:"#DB2777"},
];

/* ═══════════════ COMPONENTS ═══════════════ */

function Reveal({ children, delay = 0 }) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = r.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setV(true);
          o.unobserve(el);
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={r} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translate3d(0,0,0)" : "translate3d(0,22px,0)",
      transition: `opacity 0.6s cubic-bezier(.25,.46,.45,.94) ${delay}s, transform 0.6s cubic-bezier(.25,.46,.45,.94) ${delay}s`,
      willChange: v ? "auto" : "opacity, transform",
    }}>
      {children}
    </div>
  );
}

function GlossaryItem({ term, def }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #F0F0EA" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", cursor: "pointer",
        padding: "10px 0", display: "flex", justifyContent: "space-between",
        alignItems: "center", fontFamily: "inherit", textAlign: "left"
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{term}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1"
          strokeWidth="2" strokeLinecap="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div style={{ overflow: "hidden", maxHeight: open ? 300 : 0, transition: "max-height 0.35s ease" }}>
        <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 10px" }}>{def}</p>
      </div>
    </div>
  );
}

function PlayerRow({ p, color, isLast }) {
  const [open, setOpen] = useState(false);
  const [name, ticker, role, detail] = p;
  return (
    <div onClick={() => setOpen(!open)} style={{
      padding: "12px 0", borderBottom: isLast ? "none" : "1px solid #F0F0EA", cursor: "pointer"
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: "#0F172A", lineHeight: 1.3 }}>{name}</span>
        {ticker && (
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
            color: color, background: `${color}0D`, padding: "1px 5px", borderRadius: 3
          }}>{ticker}</span>
        )}
        <span style={{ fontSize: 12.5, color: "#94A3B8" }}>{role}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1"
          strokeWidth="2" strokeLinecap="round"
          style={{ marginLeft: "auto", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <div style={{ overflow: "hidden", maxHeight: open ? 200 : 0, transition: "max-height 0.35s ease" }}>
        <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "8px 0 2px" }}>{detail}</p>
      </div>
    </div>
  );
}

function BulletItem({ title, detail, color }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: "1px solid #F5F5F0" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, marginTop: 7, flexShrink: 0 }} />
        <div>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1E293B", lineHeight: 1.4 }}>{title}</span>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, margin: "4px 0 0" }}>{detail}</p>
        </div>
      </div>
    </div>
  );
}

function StatChip({ value, label, source, citationId, color }) {
  const [show, setShow] = useState(false);
  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => source && setShow(s => !s)}
      style={{
        background: "#fff", border: "1px solid #EAEAE4", borderRadius: 8,
        padding: "10px 10px 8px", borderTop: `2px solid ${color}`,
        position: "relative", cursor: source ? "pointer" : "default",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: "clamp(15px, 4vw, 19px)",
        fontWeight: 500, color: color, lineHeight: 1.1
      }}>{value}</div>
      <div style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 500, marginTop: 3, lineHeight: 1.25 }}>{label}</div>
      {show && source && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: 0, right: 0,
          background: "#1E293B", color: "#CBD5E1", borderRadius: 6,
          padding: "8px 10px", fontSize: 11, lineHeight: 1.45, zIndex: 20,
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
        }}>
          <span style={{ color: "#94A3B8", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
            Source:{" "}
          </span>
          {source}
          {citationId && <span style={{ color: "#64748B" }}>{` [${citationId}]`}</span>}
          <div style={{
            position: "absolute", top: "100%", left: 16,
            borderLeft: "5px solid transparent", borderRight: "5px solid transparent",
            borderTop: "5px solid #1E293B"
          }} />
        </div>
      )}
    </div>
  );
}

function MoatBar({ n, color }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ width: 12, height: 4, borderRadius: 2, background: i <= n ? color : "#E8E8E2" }} />
      ))}
    </div>
  );
}

/* ═══════════════ APP ═══════════════ */

export default function App(){
  const[active,setActive]=useState("glossary");
  const refs=useRef({});
  const[heroVis,setHeroVis]=useState(false);
  const[glossaryOpen,setGlossaryOpen]=useState(false);

  useEffect(()=>{setTimeout(()=>setHeroVis(true),100)},[]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis.length) setActive(vis[0].target.dataset.layer);
      },
      { threshold: 0.15, rootMargin: "-48px 0px -35% 0px" }
    );
    const nodes = Object.values(refs.current).filter(Boolean);
    nodes.forEach(r => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  const scrollTo=useCallback(id=>{refs.current[id]?.scrollIntoView({behavior:"smooth",block:"start"})},[]);

  const allNavItems = [{ id: "glossary", short: "Glossary", n: "00", color: "#64748B" }, ...LAYERS, { id: "sources", short: "Sources", n: "09", color: "#64748B" }];

  return(
    <div style={{background:"#F9F8F5",minHeight:"100vh",fontFamily:"'DM Sans',system-ui,-apple-system,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}::selection{background:#D9770640}html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;scroll-behavior:smooth}@media(max-width:480px){.stat-grid{grid-template-columns:repeat(2,1fr)!important}.ro-grid{grid-template-columns:1fr!important}}`}</style>

      {/* FLOATING PROGRESS */}
      <nav style={{position:"fixed",bottom:16,left:"50%",transform:"translateX(-50%)",zIndex:200,background:"rgba(15,23,42,0.88)",backdropFilter:"blur(16px) saturate(1.8)",borderRadius:24,padding:"5px 6px",display:"flex",alignItems:"center",gap:3,boxShadow:"0 4px 24px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.05)",maxWidth:"calc(100vw - 32px)"}}>
        {allNavItems.map(l=>{const a=active===l.id;return(
          <button key={l.id} onClick={()=>scrollTo(l.id)} aria-label={l.short} style={{height:28,minWidth:a?56:28,borderRadius:14,background:a?(l.color||"#64748B"):"rgba(255,255,255,0.08)",border:"none",cursor:"pointer",padding:"0 8px",transition:"all 0.35s cubic-bezier(.25,.46,.45,.94)",display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent"}}>
            <span style={{fontFamily:"'DM Mono'",fontSize:10,fontWeight:500,color:a?"#fff":"rgba(255,255,255,0.35)",transition:"color 0.3s",whiteSpace:"nowrap"}}>{a?l.short:l.n}</span>
          </button>
        )})}
      </nav>

      {/* HERO */}
      <header style={{background:"linear-gradient(175deg,#080B14 0%,#0F1628 50%,#141A30 100%)",padding:"min(10vw,72px) 20px min(8vw,56px)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 80%,rgba(217,119,6,0.06) 0%,transparent 50%),radial-gradient(ellipse at 80% 15%,rgba(37,99,235,0.04) 0%,transparent 45%)"}}/>
        <div style={{maxWidth:600,margin:"0 auto",position:"relative"}}>
          <div style={{opacity:heroVis?1:0,transform:heroVis?"none":"translateY(18px)",transition:"all 0.8s ease 0.1s"}}>
            <p style={{fontSize:10.5,fontWeight:600,letterSpacing:"0.18em",textTransform:"uppercase",color:"#D97706",marginBottom:14}}>April 2026</p>
            <h1 style={{fontFamily:"'Instrument Serif'",fontSize:"clamp(36px,9vw,56px)",fontWeight:400,color:"#F1F5F9",lineHeight:1.02}}>The AI Value Chain</h1>
            <p style={{fontSize:"clamp(14px,3.5vw,16px)",color:"#94A3B8",lineHeight:1.65,marginTop:18,maxWidth:480,fontWeight:300}}>
              Every time you ask Claude a question or generate an image with Midjourney, you're touching a supply chain that starts with power plants and ends with a chat window. This guide breaks that chain into <strong style={{color:"#CBD5E1",fontWeight:600}}>eight layers</strong>.
            </p>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main style={{maxWidth:600,margin:"0 auto",padding:"0 16px 120px"}}>

        {/* Core thesis */}
        <Reveal><div style={{margin:"32px 0 0",background:"#fff",borderRadius:10,padding:"20px 18px",border:"1px solid #E8E8E2",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:"linear-gradient(to bottom,#D97706,#DC2626)"}}/>
          <p style={{fontFamily:"'Instrument Serif'",fontSize:"clamp(17px,4vw,20px)",color:"#1E293B",lineHeight:1.5,fontStyle:"italic"}}>
            Physical scarcity creates the strongest moats, while digital abundance drives the fastest commoditization. Power, transformers, advanced chip packaging, and high-bandwidth memory are scarce. AI models, middleware, and basic inference are becoming abundant.
          </p>
        </div></Reveal>

        {/* ── LAYER 00: GLOSSARY ── */}
        <section data-layer="glossary" ref={el=>refs.current["glossary"]=el} style={{scrollMarginTop:16}}>
          <Reveal><div style={{paddingTop:40}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontFamily:"'DM Mono'",fontSize:12,fontWeight:500,color:"#64748B",background:"#64748B0C",padding:"3px 8px",borderRadius:5}}>00</span>
              <div style={{flex:1,height:1,background:"#64748B20"}}/>
            </div>
            <h2 style={{fontFamily:"'Instrument Serif'",fontSize:"clamp(24px,6vw,34px)",fontWeight:400,color:"#0F172A",lineHeight:1.1,marginBottom:8}}>Glossary</h2>
            <p style={{fontSize:14,color:"#64748B",lineHeight:1.6,marginBottom:16}}>
              AI is full of jargon. This section defines every technical term and acronym used throughout the report. Tap any term to expand its definition.
            </p>
          </div></Reveal>
          <Reveal delay={0.04}>
            <div style={{background:"#fff",border:"1px solid #EAEAE4",borderRadius:8,padding:"2px 14px"}}>
              {GLOSSARY.slice(0,glossaryOpen?GLOSSARY.length:8).map((g,i)=><GlossaryItem key={i} {...g}/>)}
            </div>
            {GLOSSARY.length>8&&(<button onClick={()=>setGlossaryOpen(!glossaryOpen)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans'",fontSize:12,fontWeight:600,color:"#64748B",padding:"10px 0",display:"flex",alignItems:"center",gap:4}}>
              {glossaryOpen?`Show fewer`:`Show all ${GLOSSARY.length} terms`}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" style={{transform:glossaryOpen?"rotate(180deg)":"none",transition:"transform 0.3s"}}><polyline points="6 9 12 15 18 9"/></svg>
            </button>)}
          </Reveal>
        </section>

        {/* ── LAYER SECTIONS ── */}
        {LAYERS.map((layer,idx)=>(
          <article key={layer.id} data-layer={layer.id} ref={el=>refs.current[layer.id]=el} style={{scrollMarginTop:16}}>
            <Reveal><div style={{paddingTop:24,marginTop:32,borderTop:"1px solid #E0DFD8"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <span style={{fontFamily:"'DM Mono'",fontSize:12,fontWeight:500,color:layer.color,background:`${layer.color}0C`,padding:"3px 8px",borderRadius:5}}>{layer.n}</span>
                <div style={{flex:1,height:1,background:`${layer.color}20`}}/>
              </div>
              <h2 style={{fontFamily:"'Instrument Serif'",fontSize:"clamp(24px,6vw,34px)",fontWeight:400,color:"#0F172A",lineHeight:1.1,marginBottom:16}}>{layer.title}</h2>
            </div></Reveal>

            {/* Pull stat */}
            <Reveal delay={0.04}><div style={{display:"flex",gap:14,alignItems:"baseline",padding:"16px 18px",background:`${layer.color}08`,borderLeft:`3px solid ${layer.color}`,borderRadius:"0 8px 8px 0",marginBottom:20}}>
              <span style={{fontFamily:"'DM Mono'",fontSize:"clamp(24px,6vw,32px)",fontWeight:500,color:layer.color,lineHeight:1,flexShrink:0}}>{layer.pull[0]}</span>
              <span style={{fontSize:13.5,color:"#475569",lineHeight:1.45}}>{layer.pull[1]}</span>
            </div></Reveal>

            <Reveal delay={0.06}><p style={{fontSize:"clamp(14.5px,3.5vw,15.5px)",color:"#334155",lineHeight:1.72,marginBottom:24}}>{layer.whatItDoes}</p></Reveal>

            {/* Stats with tooltips */}
            <Reveal delay={0.08}><div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:24}}>
              {layer.stats.map(([v,l,src,cid],i)=><StatChip key={i} value={v} label={l} source={src} citationId={cid} color={layer.color}/>)}
            </div></Reveal>

            {/* Players */}
            <Reveal delay={0.1}><div style={{marginBottom:24}}>
              <h3 style={{fontSize:11,fontWeight:700,color:"#64748B",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>Key Players</h3>
              <div style={{background:"#fff",border:"1px solid #EAEAE4",borderRadius:8,padding:"2px 14px"}}>
                {layer.players.map((p,i)=><PlayerRow key={i} p={p} color={layer.color} isLast={i===layer.players.length-1}/>)}
              </div>
              {layer.playersExtra&&<div style={{marginTop:10,fontSize:13.5,color:"#475569",lineHeight:1.6}}>{layer.playersExtra.split("\n\n").map((p,i)=><p key={i} style={{marginTop:i>0?10:0}}>{p}</p>)}</div>}
            </div></Reveal>

            {/* Economics */}
            <Reveal delay={0.12}><div style={{marginBottom:24}}>
              <h3 style={{fontSize:11,fontWeight:700,color:"#64748B",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Economics</h3>
              <div style={{fontSize:"clamp(14px,3.4vw,15px)",color:"#334155",lineHeight:1.72}}>{layer.economics.split("\n\n").map((p,i)=><p key={i} style={{marginBottom:12}}>{p}</p>)}</div>
            </div></Reveal>

            {/* Risks & Opps — MATCHING FORMAT */}
            <Reveal delay={0.14}><div className="ro-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
              <div style={{background:"#fff",border:"1px solid #EAEAE4",borderRadius:8,padding:"14px 14px 6px"}}>
                <h3 style={{fontSize:10,fontWeight:700,color:"#B91C1C",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4,display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"#EF4444"}}/>Risks
                </h3>
                {layer.risks.map(([t,d],i)=><BulletItem key={i} title={t} detail={d} color="#EF4444"/>)}
              </div>
              <div style={{background:"#fff",border:"1px solid #EAEAE4",borderRadius:8,padding:"14px 14px 6px"}}>
                <h3 style={{fontSize:10,fontWeight:700,color:"#047857",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4,display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"#10B981"}}/>Opportunities
                </h3>
                {layer.opps.map(([t,d],i)=><BulletItem key={i} title={t} detail={d} color="#10B981"/>)}
              </div>
            </div></Reveal>
          </article>
        ))}

        {/* SUMMARY TABLE */}
        <Reveal><div style={{marginTop:48,paddingTop:40,borderTop:"1px solid #E0DFD8"}}>
          <h2 style={{fontFamily:"'Instrument Serif'",fontSize:"clamp(24px,6vw,32px)",fontWeight:400,color:"#0F172A",marginBottom:16}}>Where is the value?</h2>
          <div style={{borderRadius:8,border:"1px solid #EAEAE4",overflow:"hidden"}}>
            <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5,minWidth:440}}>
                <thead><tr style={{background:"#F8F7F4"}}>
                  {["Layer","Moat","Margins","Commod."].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:600,color:"#64748B",fontSize:9.5,letterSpacing:"0.08em",textTransform:"uppercase",borderBottom:"1px solid #EAEAE4"}}>{h}</th>)}
                </tr></thead>
                <tbody>{SUMMARY.map((r,i)=>(
                  <tr key={i} style={{borderBottom:i<SUMMARY.length-1?"1px solid #F0F0EA":"none",cursor:"pointer"}} onClick={()=>scrollTo(LAYERS[i].id)}>
                    <td style={{padding:"8px 10px",fontWeight:600,color:"#0F172A",whiteSpace:"nowrap"}}>{r.layer}</td>
                    <td style={{padding:"8px 10px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><MoatBar n={r.n} color={r.color}/><span style={{color:"#64748B",fontSize:11}}>{r.moat}</span></div></td>
                    <td style={{padding:"8px 10px",color:"#334155",whiteSpace:"nowrap"}}>{r.margin}</td>
                    <td style={{padding:"8px 10px",color:"#64748B"}}>{r.commod}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
          <Reveal delay={0.08}><div style={{marginTop:20,padding:"18px 16px",background:"#fff",border:"1px solid #EAEAE4",borderRadius:8}}>
            <h3 style={{fontFamily:"'Instrument Serif'",fontSize:18,color:"#0F172A",marginBottom:8}}>The key insight</h3>
            <p style={{fontSize:14.5,color:"#334155",lineHeight:1.7}}>The pattern from every prior technology cycle holds: physical scarcity creates the strongest moats, while digital abundance drives the fastest commoditization. The approximately $3 trillion projected in AI infrastructure investment through 2030 will generate enormous wealth — but the distribution across layers will be far more uneven than the current enthusiasm implies.</p>
          </div></Reveal>
        </div></Reveal>

        {/* ── CITATIONS ── */}
        <section data-layer="sources" ref={el => refs.current["sources"] = el} style={{ scrollMarginTop: 16 }}>
          <Reveal><div style={{marginTop:48,paddingTop:40,borderTop:"1px solid #E0DFD8"}}>
            <h2 style={{fontFamily:"'Instrument Serif'",fontSize:"clamp(22px,5vw,28px)",fontWeight:400,color:"#0F172A",marginBottom:16}}>Sources & Citations</h2>
            <p style={{fontSize:13,color:"#64748B",lineHeight:1.6,marginBottom:16}}>
              Data in this report is drawn from SEC filings, industry research firms, company press releases, and academic institutions. Citation numbers correspond to the source tooltips on stat callouts throughout the report.
            </p>
            <div style={{background:"#fff",border:"1px solid #EAEAE4",borderRadius:8,padding:"4px 14px"}}>
              {CITATIONS.map((c,i)=>(
                <div key={c.id} style={{padding:"8px 0",borderBottom:i<CITATIONS.length-1?"1px solid #F5F5F0":"none",display:"flex",gap:10,alignItems:"baseline"}}>
                  <span style={{fontFamily:"'DM Mono'",fontSize:10,fontWeight:500,color:"#94A3B8",flexShrink:0,minWidth:20}}>[{c.id}]</span>
                  <span style={{fontSize:12.5,color:"#475569",lineHeight:1.5}}>{c.full}</span>
                </div>
              ))}
            </div>
          </div></Reveal>
        </section>

        <footer style={{marginTop:48,textAlign:"center",fontSize:11,color:"#94A3B8",lineHeight:1.7,paddingTop:24,borderTop:"1px solid #EAEAE4"}}>
          <p>Built with Claude</p>
          <p style={{marginTop:4,fontSize:10}}>Informational overview, not investment advice. Verify all data independently.</p>
        </footer>
      </main>
    </div>
  );
}
