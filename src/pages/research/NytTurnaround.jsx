import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ==================== DATA ====================

const chapters = [
  { id: "ch1", num: "I",    short: "The Decline",   title: "The Decline" },
  { id: "ch2", num: "II",   short: "Lifelines",     title: "Lifelines & Losses" },
  { id: "ch3", num: "III",  short: "The Cast",      title: "The Cast" },
  { id: "ch4", num: "IV",   short: "Paywall",       title: "The Paywall" },
  { id: "ch5", num: "V",    short: "Innovation",    title: "The Innovation Report" },
  { id: "ch6", num: "VI",   short: "The Bundle",    title: "Building the Bundle" },
  { id: "ch7", num: "VII",  short: "Athletic",      title: "The Athletic & Wordle" },
  { id: "ch8", num: "VIII", short: "The Numbers",   title: "The Numbers Now" },
  { id: "ch9", num: "IX",   short: "Outlook",       title: "AI and the Long Game" }
];

const stats = [
  { v: "12.52M", k: "Digital-only subs, Q1 2026" },
  { v: "$2.59B", k: "FY2024 revenue" },
  { v: "$540M",  k: "Trailing 12-mo. free cash flow" },
  { v: "~15×",   k: "Stock since the 2009 low" }
];

const acquisitions = [
  { name: "The Wirecutter",      yr: "2016", price: "~$30M",      slot: 12, note: "Affiliate-commerce engine; first move into product-recommendation revenue." },
  { name: "Audm / Serial Prod.", yr: "2020", price: "~$33M",      slot: 26, note: "Long-form audio + the Sarah Koenig / Julie Snyder studio." },
  { name: "The Athletic",        yr: "2022", price: "$550M",      slot: 38, note: "1.2M sports subs at close; 10M-subs-by-2025 goal hit ~3 years early." },
  { name: "Wordle",              yr: "2022", price: "low 7-fig.", slot: 50, note: "Bought from Josh Wardle; became the top-of-funnel for NYT Games." }
];

const bundle = [
  {
    label: "News",
    notes: [
      "1,700+ newsroom across 160 countries — the largest in the paper's history",
      "135+ Pulitzers, more than any other organization",
      "Anchors every product launched since 2011"
    ]
  },
  {
    label: "Games",
    notes: [
      "Crossword, Mini, Spelling Bee, Wordle, Connections, Strands",
      "1M standalone Games subs by December 2021 — before Wordle",
      "Wordle (Jan 2022) became the funnel; Connections (2023) the retention tool"
    ]
  },
  {
    label: "Cooking",
    notes: [
      "Launched 2014 under Sam Sifton",
      "Standalone subscription; the food / recipe pillar",
      "Included in the May 2025 Amazon AI license — Wirecutter was the carve-out"
    ]
  },
  {
    label: "Wirecutter",
    notes: [
      "Acquired Oct 2016 for ~$30M ($25M base in the 10-K)",
      "Affiliate commerce, product reviews",
      "Drove roughly 20% of 'other revenue' growth in 2017"
    ]
  },
  {
    label: "The Athletic",
    notes: [
      "$550M all-cash, January 2022",
      "Closed with ~1.2M sports subscribers",
      "Founders Mather and Hansmann kept on as co-presidents"
    ]
  }
];

const timeline = [
  { yr: "2008", t: "Print ads still > $1B", d: "The last full year of pre-crisis print ad revenue. By 2024 the entire ad line — print plus digital — will be $506M." },
  { yr: "2009", t: "The Slim loan", d: "Jan 19: Carlos Slim extends $250M at 14% with warrants at $6.36/share. Two months later, 750k sq ft of the headquarters is sale-leased to W.P. Carey for $225M." },
  { yr: "2011", t: "The metered paywall", d: "March 28: 20 free articles, then pay. 224,000 paid digital subs in three months." },
  { yr: "2012", t: "Thompson hired; About.com sold", d: "Nov 12: Mark Thompson takes over as CEO from the BBC. About.com sold to IAC for $300M (a ~$110M loss on the 2005 purchase)." },
  { yr: "2013", t: "Boston Globe sold for $70M", d: "Oct 24: closed sale to John Henry. Paid $1.1B in 1993 — a 93.6% loss on the dollar. Dividend reinstated." },
  { yr: "2014", t: "The Innovation Report", d: "May: A.G. Sulzberger's 96-page internal memo leaks via BuzzFeed. Cooking and NYT Now launch." },
  { yr: "2015", t: "Slim cashes warrants", d: "January: 15.9M shares exercised at $6.36. Stock at $12.60. Paper profit ~$263M from warrants alone, per Bloomberg." },
  { yr: "2016", t: "Wirecutter acquired", d: "October: ~$30M. The Daily podcast comes in 2017 — eventually No. 1 on Apple Podcasts platform-wide." },
  { yr: "2017", t: "The Trump bump", d: "Q1 2017: 755k subs added across the year, 65% YoY growth. Subscription becomes structurally dominant." },
  { yr: "2018", t: "A.G. takes the publisher chair", d: "Jan 1: 6th-generation Ochs-Sulzberger; lead author of the Innovation Report. Stock at $23." },
  { yr: "2020", t: "Levien promoted to CEO", d: "Sept 8: Meredith Kopit Levien replaces Thompson. Times2020 plan codifies a 'subscription-first business.'" },
  { yr: "2022", t: "The Athletic + Wordle", d: "Jan 6: $550M for The Athletic. Jan 31: Wordle for 'low seven figures.' 10M-subs-by-2025 goal hit in February — three years early." },
  { yr: "2023", t: "OpenAI lawsuit", d: "Dec 27: NYT sues OpenAI and Microsoft in SDNY. Damages theory: $150,000 per infringement, times millions of articles." },
  { yr: "2025", t: "Amazon AI deal", d: "May 29: first AI licensing deal. WSJ reports terms at $20–25M/year — nearly 1% of 2024 revenue. Wirecutter explicitly excluded." },
  { yr: "2026", t: "13.08M total subs", d: "Q1: 310k net digital adds, beating consensus. Revenue +12% YoY, digital ad +31.6%. Stock at $75, up ~15× from the 2009 low." }
];

const ledger = [
  { k: "2009 Slim loan coupon", v: "14% (12% redemption premium)" },
  { k: "Boston Globe: paid 1993 / sold 2013", v: "$1.1B / $70M" },
  { k: "About.com: paid 2005 / sold 2012", v: "$410M / $300M" },
  { k: "NYT Building leasehold (2009)", v: "Sold $225M / leased at $24M/yr" },
  { k: "Digital subs three months after paywall (2011)", v: "224,000" },
  { k: "Subs at end of Thompson's tenure (2020)", v: "~6.5M digital-only" },
  { k: "10M-subs goal: set / hit", v: "2019 / Feb 2022" },
  { k: "The Athletic purchase price", v: "$550M all-cash" },
  { k: "Q1 2026 digital-only subs", v: "12.52M" },
  { k: "FY2024 revenue / FCF", v: "$2,585M / $381M" },
  { k: "Q1 2026 digital ad growth YoY", v: "+31.6%" },
  { k: "Bundle ARPU vs. news-only ARPU", v: "$13.40 / $9.29  (~44% premium)" },
  { k: "Amazon AI deal (WSJ, July 2025)", v: "$20–25M/yr, multi-year" },
  { k: "15M-subs target", v: "End of 2027" }
];

const peers = [
  {
    label: "The New York Times",
    items: [
      { n: "Digital subs",   tag: "12.52M",     d: "Q1 2026. Net +310,000 for the quarter." },
      { n: "FY2024 revenue", tag: "$2.59B",     d: "Subscription 69%, advertising 20%, other 11%." },
      { n: "Cash / debt",    tag: "$1.1B / $0", d: "Plus an undrawn $400M revolver." },
      { n: "Market cap",     tag: "~$12B",      d: "P/E ~32; FCF margin ~21% LTM." }
    ]
  },
  {
    label: "Wall Street Journal / Dow Jones",
    items: [
      { n: "WSJ digital subs",   tag: "4.29M", d: "Mid-2025 (Press Gazette)." },
      { n: "Dow Jones consumer", tag: "~5.9M", d: "WSJ + Barron's + MarketWatch." },
      { n: "Strategy",           tag: "Focus", d: "CEO Latour, Feb 2024: 'We're not going to be a lifestyle company.'" }
    ]
  },
  {
    label: "Financial Times",
    items: [
      { n: "Digital subs",          tag: "1.35M", d: "FY2024 (Companies House filings)." },
      { n: "Paying readers",        tag: "1.48M", d: "Across all formats." },
      { n: "Global paying audience", tag: "~2.83M", d: "Including events / specialist products." }
    ]
  },
  {
    label: "Washington Post — the counterfactual",
    items: [
      { n: "Digital subs",    tag: "≤3M",            d: "Down from ~3M peak in January 2021." },
      { n: "Reported losses", tag: "$77 / 100 / 100M", d: "2023, 2024, 2025 per WSJ sources." },
      { n: "Newsroom cut",    tag: "−1/3",            d: "Feb 2026 layoffs; Will Lewis stepped down." }
    ]
  }
];

const management = [
  { role: "Publisher",     name: "A.G. Sulzberger",            tenure: "Jan 2018 – present",  note: "6th-generation Ochs-Sulzberger. Lead author of the 2014 Innovation Report. Combined chairman + publisher since Jan 2021." },
  { role: "CEO",           name: "Meredith Kopit Levien",      tenure: "Sept 8, 2020 – present", note: "Joined 2013 as head of advertising. Set the 15M-by-2027 target after the original 10M-by-2025 goal was hit in Feb 2022." },
  { role: "CEO 2012-2020", name: "Mark Thompson",              tenure: "Nov 2012 – Sept 2020", note: "Ex-BBC Director-General (2004–12). Subs grew from ~500K to ~6.5M during his tenure; stock rose roughly 4×." },
  { role: "Executive Editor", name: "Joe Kahn",                tenure: "June 2022 – present", note: "24-year NYT veteran, two-time Pulitzer winner, ex-WSJ Beijing/Shanghai/Washington bureau chief." },
  { role: "EE 2014-2022",  name: "Dean Baquet",                tenure: "May 2014 – June 2022", note: "First Black executive editor. Oversaw 18 Pulitzers — Weinstein/#MeToo, the 1619 Project, the Trump tax returns." },
  { role: "Owning family", name: "The Ochs-Sulzberger family", tenure: "1896 – present",      note: "Class B supervoting shares preserved through every crisis — the structural reason the family could play a long game." }
];

const subscriberSeries = [
  { yr: "2011", v: 0.32,  lbl: "Paywall launches (March 28)" },
  { yr: "2013", v: 0.73,  lbl: "" },
  { yr: "2015", v: 1.10,  lbl: "Slim cashes warrants" },
  { yr: "2017", v: 2.20,  lbl: "Trump bump — +755K subs YoY" },
  { yr: "2019", v: 4.40,  lbl: "" },
  { yr: "2020", v: 5.30,  lbl: "Levien becomes CEO" },
  { yr: "2021", v: 7.60,  lbl: "" },
  { yr: "2022", v: 9.55,  lbl: "Athletic + Wordle — 10M goal hit" },
  { yr: "2023", v: 10.36, lbl: "" },
  { yr: "2024", v: 10.82, lbl: "" },
  { yr: "2025", v: 12.21, lbl: "" },
  { yr: "2026", v: 12.52, lbl: "Q1 — 13.08M total" }
];

const revenueMix = [
  { label: "Subscription",  pct: 69, value: "$1,788M", note: "Digital-only sub revenue ~$1.55B run-rate by Q1 2026." },
  { label: "Advertising",   pct: 20, value: "$506M",   note: "Digital ~73% of ads; +31.6% YoY in Q1 2026." },
  { label: "Other",         pct: 11, value: "$291M",   note: "Wirecutter affiliate, licensing, live events." }
];

const sources = [
  {
    group: "NYT Company SEC Filings & Press Releases",
    items: [
      { t: "Form 10-K, Fiscal Year 2024",        p: "SEC EDGAR", url: "https://www.sec.gov/Archives/edgar/data/0000071691/000007169125000047/nyt-20241231.htm" },
      { t: "Form 10-Q, Q1 2026",                  p: "SEC EDGAR", url: "https://www.sec.gov/Archives/edgar/data/0000071691/000007169126000025/nyt-20260331.htm" },
      { t: "Form 8-K, Q4 2025 Earnings Release",  p: "SEC EDGAR", url: "https://www.sec.gov/Archives/edgar/data/0000071691/000007169126000008/pressrelease12312025.htm" },
      { t: "Form 8-K, FY2023 Earnings Release",   p: "SEC EDGAR", url: "https://www.sec.gov/Archives/edgar/data/0000071691/000007169124000027/pressrelease12312023.htm" },
      { t: "Form 8-K, About.com Sale (Aug 2012)", p: "SEC EDGAR", url: "https://www.sec.gov/Archives/edgar/data/0000071691/000119312512405775/d416029d8k.htm" }
    ]
  },
  {
    group: "Financial Data & Stock Performance",
    items: [
      { t: "New York Times Q1 2026 revenue +12%, EPS nearly doubles", p: "Stocktitan",   url: "https://www.stocktitan.net/sec-filings/NYT/10-q-new-york-times-co-quarterly-earnings-report-fa422ac1b585.html" },
      { t: "NYT Financials: Income, Balance Sheet, Cash Flow",         p: "Stocktitan",   url: "https://www.stocktitan.net/financials/NYT/" },
      { t: "Q1 Earnings Beat on Digital Ads, Subscriber Growth",       p: "TradingView / Zacks", url: "https://www.tradingview.com/news/zacks:f60d735ee094b:0-the-new-york-times-q1-earnings-beat-on-digital-ads-subscriber-growth/" },
      { t: "Q1 2026 earnings beat on digital subscriber growth",       p: "Yahoo Finance", url: "https://finance.yahoo.com/markets/stocks/articles/york-times-q1-2026-earnings-152417512.html" },
      { t: "Bundle Flywheel: 12.3M Subscribers and AI-Powered Ads",    p: "BeyondSPX",    url: "https://everyticker.com/quote/NYT/the-new-york-times-bundle-flywheel-why-12-3-million-subscribers-and-ai-powered-ads-create-a-durable-moat-nyse-nyt" }
    ]
  },
  {
    group: "The Decline Era & Carlos Slim",
    items: [
      { t: "When Mexico's richest man threw NYT a lifeline (2025)",  p: "Poynter",          url: "https://www.poynter.org/business-work/2025/poynter-50-carlos-slim-loan-new-york-times-2009/" },
      { t: "Slim doubles money with loan to New York Times",         p: "Portland Press Herald", url: "https://www.pressherald.com/2014/01/21/slim_doubles_money_with_loan_to_new_york_times_/" },
      { t: "Craigslist costs US newspapers billions: study",         p: "Phys.org",         url: "https://phys.org/news/2013-08-craigslist-newspapers-billions.html" },
      { t: "How Craigslist killed the newspapers' golden goose",     p: "MinnPost",         url: "https://www.minnpost.com/business/2014/02/how-craigslist-killed-newspapers-golden-goose/" },
      { t: "Boston Globe, once bought for $1.1B, sells for $70M",    p: "NBC News",         url: "https://www.nbcnews.com/businessmain/boston-globe-once-bought-1-1-billion-sells-70-million-6c10835491" },
      { t: "New York Times sells About.com to IAC for $300M",        p: "VentureBeat",      url: "https://venturebeat.com/2012/08/26/new-york-times-sells-about-com-to-iac-for-300m/" },
      { t: "NYT will buy back its HQ leasehold",                     p: "The Real Deal",    url: "https://therealdeal.com/new-york/2018/02/01/new-york-times-will-buy-back-its-hq-leasehold/" },
      { t: "The newsonomics of John Henry buying The Boston Globe", p: "Nieman Lab",       url: "https://www.niemanlab.org/2013/08/the-newsonomics-of-john-henry-buying-the-boston-globe/" }
    ]
  },
  {
    group: "Paywall & the Innovation Report",
    items: [
      { t: "Paywall (overview)",                                       p: "Wikipedia",      url: "https://en.wikipedia.org/wiki/Paywall" },
      { t: "The newsonomics of NYT's Paywalls 2.0 (Nov 2013)",         p: "Nieman Lab",     url: "https://www.niemanlab.org/2013/11/the-newsonomics-of-the-new-york-times-paywalls-2-0/" },
      { t: "Testing news paywalls: leaky and airtight",                p: "Columbia Journ. Rev.", url: "https://www.cjr.org/business_of_news/news-paywalls-new-york-times-wall-street-journal.php" },
      { t: "The leaked NYT innovation report (Joshua Benton)",         p: "Nieman Lab",     url: "https://www.niemanlab.org/2014/05/the-leaked-new-york-times-innovation-report-is-one-of-the-key-documents-of-this-media-age/" }
    ]
  },
  {
    group: "Management & Leadership",
    items: [
      { t: "Meredith Kopit Levien named CEO (Jul 2020)",                p: "Jewish Insider", url: "https://jewishinsider.com/2020/07/meredith-kopit-levien-named-ceo-of-the-new-york-times/" },
      { t: "Levien on building a world-class digital media business",   p: "Nieman Lab",     url: "https://www.niemanlab.org/2020/07/newsonomics-the-new-york-times-new-ceo-meredith-levien-on-building-a-world-class-digital-media-business-and-a-tech-company/" },
      { t: "Mark Thompson's exit interview (Aug 2020)",                 p: "CNBC",           url: "https://www.cnbc.com/2020/08/10/new-york-times-ceo-mark-thompsons-exit-interview.html" },
      { t: "Joe Kahn named next executive editor (Apr 2022)",           p: "Boston Globe",   url: "https://www.bostonglobe.com/2022/04/19/business/new-york-times-promotes-joseph-kahn-executive-editor/" }
    ]
  },
  {
    group: "Acquisitions & Product Launches",
    items: [
      { t: "NYT buying The Wirecutter — a new revenue stream",          p: "CNN Money",      url: "https://money.cnn.com/2016/10/24/media/the-new-york-times-buys-wirecutter/index.html" },
      { t: "NYT to buy The Athletic for $550M",                         p: "CNBC",           url: "https://www.cnbc.com/2022/01/06/new-york-times-announces-plans-to-buy-the-athletic-for-550-million.html" },
      { t: "NYT to acquire The Athletic for $550M in cash",             p: "Axios",          url: "https://www.axios.com/2022/01/06/new-york-times-athletic-deal-valuation" },
      { t: "'Wordle' acquired by New York Times for over $1M",          p: "9to5Mac",        url: "https://9to5mac.com/2022/01/31/wordle-acquired-by-new-york-times/" },
      { t: "The Daily (podcast)",                                       p: "Wikipedia",      url: "https://en.wikipedia.org/wiki/The_Daily_(podcast)" },
      { t: "How 'The Daily' podcast tackled growing media distrust",    p: "Inside UCR",     url: "https://insideucr.ucr.edu/stories/2024/03/06/how-daily-podcast-tackled-growing-media-distrust" }
    ]
  },
  {
    group: "Subscriber & Bundle Metrics",
    items: [
      { t: "A third of NYT subs do not pay for the news product",       p: "Press Gazette",  url: "https://pressgazette.co.uk/media_business/new-york-times-non-news-subscriptions-one-third/" },
      { t: "Family Plans Drive Subscriber Jump; Digital Ads +20%",      p: "A Media Operator", url: "https://www.amediaoperator.com/news/new-york-times-family-plans-drive-subscriber-jump-advertising-q3-2025/" },
      { t: "Inside The New York Times Business Model",                  p: "Huddle Up",      url: "https://huddleup.substack.com/p/inside-the-new-york-times-business" },
      { t: "NYT Laps the Field in Its Full-Year Earnings",              p: "Adweek",         url: "https://www.adweek.com/media/new-york-times-earnings/" }
    ]
  },
  {
    group: "Competitive Benchmarks",
    items: [
      { t: "Dow Jones doubles digital subs in four years",              p: "Axios",          url: "https://www.axios.com/2024/02/08/dow-jones-wall-street-journal-subscriptions-digital" },
      { t: "WSJ editor Emma Tucker on growing subs to 4.3M",            p: "Press Gazette",  url: "https://pressgazette.co.uk/news-leaders/wsj-subscriptions-success-not-an-accident-editor-emma-tucker-interview/" },
      { t: "FT reports global revenue boost to £540m for 2024",         p: "Press Gazette",  url: "https://pressgazette.co.uk/media_business/financial-times-reports-global-revenue-boost-to-540m-for-2024/" },
      { t: "Sally Buzbee steps down as executive editor",               p: "Washington Post", url: "https://www.washingtonpost.com/style/media/2024/06/02/sally-buzbee-washington-post-steps-down/" },
      { t: "Will Lewis steps down as publisher and CEO",                p: "NBC News",       url: "https://www.nbcnews.com/news/us-news/will-lewis-steps-down-publisher-chief-executive-washington-post-rcna158854" },
      { t: "WaPo layoffs gut a third of its staff (Feb 2026)",          p: "CNN Business",   url: "https://www.cnn.com/2026/02/04/media/washington-post-layoffs" },
      { t: "Washington Post losses: Do they justify the layoffs?",      p: "Deseret News",   url: "https://www.deseret.com/u-s-world/2026/02/26/washington-post-losses-layoffs-jeff-bezos/" },
      { t: "Gannett is cutting $100M and rethinking subscriptions",     p: "Poynter",        url: "https://www.poynter.org/business-work/2025/gannett-earnings-call-gci-media-company/" }
    ]
  },
  {
    group: "AI Litigation & Licensing",
    items: [
      { t: "Does ChatGPT violate New York Times' copyrights?",          p: "Harvard Law",    url: "https://hls.harvard.edu/today/does-chatgpt-violate-new-york-times-copyrights/" },
      { t: "Reporting the facts about the NYT lawsuit",                 p: "OpenAI",         url: "https://openai.com/new-york-times/" },
      { t: "NYT takes OpenAI to court; ChatGPT's future on the line",   p: "NPR",            url: "https://www.npr.org/2025/01/14/nx-s1-5258952/new-york-times-openai-microsoft" },
      { t: "NYT inks deal with Amazon to license content for AI",       p: "CNN Business",   url: "https://www.cnn.com/2025/05/29/media/new-york-times-amazon-ai-nyt-cooking-athletic-licensing-deal" },
      { t: "NYT reaches AI licensing deal with Amazon",                 p: "Axios",          url: "https://www.axios.com/2025/05/30/nyt-amazon-ai-licensing-deal" },
      { t: "Amazon $20–25M Annual AI Licensing Deal With NYT",          p: "MLQ.ai",         url: "https://mlq.ai/news/amazon-strikes-2025-million-annual-ai-licensing-deal-with-the-new-york-times/" },
      { t: "Amazon to pay at least $20M/year in AI content deal",       p: "GeekWire",       url: "https://www.geekwire.com/2025/report-amazon-to-pay-at-least-20m-a-year-in-ai-content-deal-with-new-york-times/" },
      { t: "Amazon to Pay NYT Up to $25M for AI Licensing",             p: "PYMNTS",         url: "https://www.pymnts.com/news/artificial-intelligence/2025/amazon-paying-new-york-times-25-million-dollars-ai-licensing/" },
      { t: "Amazon-NYT AI deal signals new wave of publisher deals",    p: "Digiday",        url: "https://digiday.com/media/amazon-and-the-new-york-times-ai-deal-signals-a-new-wave-of-publisher-partnerships/" }
    ]
  }
];

// ==================== DESIGN SYSTEM — NYT-style ====================

const C = {
  bg:      "#f7f2e6",  // newsprint cream
  paper:   "#fefcf6",  // bright paper (cards)
  paperH:  "#f3eddc",  // hover
  inset:   "#fbf6e8",  // inset surface
  ink:     "#111111",  // headline / rule black
  text:    "#1c1c1c",  // body
  dim:     "#3a3a3a",  // secondary body
  muted:   "#666666",  // labels
  soft:    "#8e8a82",  // tertiary
  faint:   "#e3dac4",  // hairlines
  rule:    "#111111",  // 1px black rule
  red:     "#b91c1c",  // accent red (NYT-style)
  redD:    "#7a1212",  // dark red
  redS:    "#f4d6d2"   // red soft tint
};

// ==================== GLOBAL ====================

function ProgressBar() {
  var [pct, setPct] = useState(0);
  useEffect(function() {
    var raf = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function() {
        raf = null;
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return function() { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, zIndex: 300,
      height: 2, width: pct + "%",
      background: C.red,
      pointerEvents: "none"
    }} />
  );
}

function FadeIn({ children, delay }) {
  var [vis, setVis] = useState(false);
  var ref = useRef();
  useEffect(function() {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.06 });
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, []);
  var d = delay || 0;
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) " + d + "ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) " + d + "ms"
    }}>{children}</div>
  );
}

// ==================== CITATIONS ====================

function Cite({ n }) {
  var nums = Array.isArray(n) ? n : [n];
  function jump(num, e) {
    e.preventDefault();
    var el = document.getElementById("src-" + num);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    el.classList.add("nyt-cite-pulse");
    setTimeout(function() { el.classList.remove("nyt-cite-pulse"); }, 1800);
  }
  return (
    <sup className="nyt-cite" style={{
      fontFamily: "var(--nyt-sans)", fontSize: "0.66em",
      lineHeight: 0, marginLeft: 1, letterSpacing: 0
    }}>
      {nums.map(function(num, i) {
        return (
          <span key={num}>
            {i > 0 ? <span style={{ color: C.soft, padding: "0 1px" }}>,</span> : null}
            <a href={"#src-" + num} onClick={function(e) { jump(num, e); }}
              style={{
                color: C.red, textDecoration: "none", fontWeight: 700,
                padding: "0 1px"
              }}>{num}</a>
          </span>
        );
      })}
    </sup>
  );
}

// ==================== TYPOGRAPHY ====================

function H2({ children, id }) {
  return (
    <FadeIn>
      <h2 id={id} style={{
        fontFamily: "var(--nyt-display)",
        fontSize: "clamp(28px, 4.6vw, 42px)",
        lineHeight: 1.1,
        letterSpacing: "-0.005em",
        color: C.ink,
        margin: "70px 0 6px",
        fontWeight: 700,
        scrollMarginTop: 70
      }}>{children}</h2>
    </FadeIn>
  );
}

function ChapterRule({ num }) {
  return (
    <FadeIn>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 0 32px" }}>
        <span style={{
          fontFamily: "var(--nyt-sans)", fontSize: 11, color: C.red,
          letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600
        }}>Chapter {num}</span>
        <span style={{ flex: 1, height: 1, background: C.ink }} />
      </div>
    </FadeIn>
  );
}

function P({ children, first }) {
  return (
    <FadeIn>
      <p style={{
        fontFamily: "var(--nyt-serif)",
        fontSize: 18.5,
        lineHeight: 1.65,
        color: C.text,
        margin: "0 0 22px"
      }}>
        {first ? (
          <span style={{
            float: "left",
            fontFamily: "var(--nyt-display)",
            fontSize: 64,
            lineHeight: 0.82,
            color: C.ink,
            fontWeight: 700,
            margin: "6px 12px 0 0"
          }}>{first}</span>
        ) : null}
        {children}
      </p>
    </FadeIn>
  );
}

function Lead({ children }) {
  return (
    <FadeIn>
      <p style={{
        fontFamily: "var(--nyt-serif)",
        fontSize: 21,
        lineHeight: 1.55,
        color: C.ink,
        margin: "0 0 28px",
        fontStyle: "italic",
        borderLeft: "2px solid " + C.red,
        paddingLeft: 18,
        fontWeight: 400
      }}>{children}</p>
    </FadeIn>
  );
}

function Epigraph({ children, cite }) {
  return (
    <FadeIn>
      <figure style={{
        margin: "30px 0",
        padding: "24px 30px",
        background: C.paper,
        border: "1px solid " + C.faint,
        borderLeft: "3px solid " + C.red,
        borderRadius: 2
      }}>
        <blockquote style={{
          fontFamily: "var(--nyt-display)",
          fontSize: 20,
          lineHeight: 1.55,
          color: C.ink,
          fontStyle: "italic",
          margin: 0,
          fontWeight: 500
        }}>{children}</blockquote>
        {cite ? (
          <figcaption style={{
            fontFamily: "var(--nyt-sans)", fontSize: 11, color: C.muted,
            letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 14,
            fontWeight: 500
          }}>— {cite}</figcaption>
        ) : null}
      </figure>
    </FadeIn>
  );
}

function PullQuote({ children }) {
  return (
    <FadeIn>
      <div style={{ margin: "48px 0", textAlign: "center", padding: "0 6px" }}>
        <div style={{ display: "inline-block", width: 44, height: 1, background: C.ink, marginBottom: 24 }} />
        <div style={{
          fontFamily: "var(--nyt-display)",
          fontSize: "clamp(22px, 3.4vw, 32px)",
          lineHeight: 1.35,
          color: C.ink,
          fontStyle: "italic",
          fontWeight: 500,
          maxWidth: 720,
          margin: "0 auto"
        }}>{children}</div>
        <div style={{ display: "inline-block", width: 44, height: 1, background: C.ink, marginTop: 24 }} />
      </div>
    </FadeIn>
  );
}

function StatBand() {
  return (
    <FadeIn>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 0,
        margin: "20px 0 14px",
        borderTop: "2px solid " + C.ink,
        borderBottom: "2px solid " + C.ink
      }}>
        {stats.map(function(s, i) {
          return (
            <div key={i} style={{
              padding: "22px 18px 20px",
              textAlign: "center",
              borderRight: i < stats.length - 1 ? "1px solid " + C.faint : "none"
            }}>
              <div style={{
                fontFamily: "var(--nyt-display)", fontSize: 32,
                fontWeight: 700, color: C.ink, lineHeight: 1
              }}>{s.v}</div>
              <div style={{
                fontFamily: "var(--nyt-sans)", fontSize: 10.5,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: C.muted, marginTop: 12, lineHeight: 1.5, fontWeight: 500
              }}>{s.k}</div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== NAV ====================

function NavBar({ active, show }) {
  var navRef = useRef();
  useEffect(function() {
    if (!navRef.current || !active) return;
    var el = navRef.current.querySelector('[data-ch="' + active + '"]');
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: C.bg + "f0",
      backdropFilter: "blur(14px) saturate(1.1)",
      WebkitBackdropFilter: "blur(14px) saturate(1.1)",
      borderBottom: "1px solid " + C.faint,
      transform: show ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.36s cubic-bezier(0.16,1,0.3,1)"
    }}>
      <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", paddingRight: 14 }}>
        <div ref={navRef} className="nyt-navscroll" style={{ flex: 1, minWidth: 0, display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
          {chapters.map(function(ch) {
            var isA = active === ch.id;
            return (
              <a key={ch.id} data-ch={ch.id} href={"#" + ch.id}
                onClick={function(e) {
                  e.preventDefault();
                  var el = document.getElementById(ch.id);
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" });
                }}
                style={{
                  padding: "12px 13px",
                  fontSize: 11, fontWeight: isA ? 700 : 500,
                  whiteSpace: "nowrap",
                  color: isA ? C.red : C.muted,
                  borderBottom: "2px solid " + (isA ? C.red : "transparent"),
                  textDecoration: "none",
                  fontFamily: "var(--nyt-sans)",
                  transition: "color 0.2s, border-color 0.2s",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase"
                }}>{ch.num + " · " + ch.short}</a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function BackButton() {
  return (
    <Link to="/research" aria-label="Back to research" className="nyt-back"
      style={{
        position: "fixed",
        top: "max(14px, env(safe-area-inset-top))",
        left: 14, zIndex: 200,
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "9px 14px",
        background: C.paper,
        border: "1px solid " + C.ink,
        borderRadius: 0,
        color: C.ink,
        fontFamily: "var(--nyt-sans)", fontSize: 11, fontWeight: 600,
        letterSpacing: "0.14em", textTransform: "uppercase",
        textDecoration: "none",
        boxShadow: "0 2px 0 " + C.ink,
        transition: "background 0.18s, transform 0.18s"
      }}
      onMouseEnter={function(e) { e.currentTarget.style.background = C.paperH; }}
      onMouseLeave={function(e) { e.currentTarget.style.background = C.paper; }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>&larr;</span>
      <span className="nyt-back-label">Back</span>
    </Link>
  );
}

// ==================== PRIMITIVES ====================

function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily: "var(--nyt-sans)", fontSize: 10.5, color: C.red,
      letterSpacing: "0.26em", textTransform: "uppercase",
      marginBottom: 18, display: "flex", alignItems: "center", gap: 12,
      fontWeight: 700
    }}>
      <span style={{ display: "inline-block", width: 22, height: 1, background: C.red }} />
      {children}
    </div>
  );
}

function Panel({ children }) {
  return (
    <FadeIn>
      <div style={{
        background: C.paper,
        border: "1px solid " + C.faint,
        borderTop: "2px solid " + C.ink,
        borderRadius: 2,
        padding: "28px 26px",
        margin: "40px 0 46px"
      }}>{children}</div>
    </FadeIn>
  );
}

// ==================== INTERACTIVE COMPONENTS ====================

function Acquisitions() {
  var [hov, setHov] = useState(2);
  var pad = 7;
  return (
    <Panel>
      <Eyebrow>The Acquisitions &mdash; tap a deal</Eyebrow>
      <div style={{ position: "relative", height: 78, margin: "26px 4px 22px" }}>
        <div style={{
          position: "absolute", left: pad + "%", right: pad + "%", top: 54, height: 1,
          background: C.ink
        }} />
        {[2016, 2018, 2020, 2022, 2024].map(function(yr) {
          var lf = pad + ((yr - 2014) / 12) * (100 - 2 * pad);
          return (
            <div key={yr} style={{ position: "absolute", left: lf + "%", top: 60, transform: "translateX(-50%)",
              fontFamily: "var(--nyt-sans)", fontSize: 9.5, color: C.muted, fontWeight: 500 }}>{yr}</div>
          );
        })}
        {acquisitions.map(function(a, i) {
          var on = hov === i;
          var lf = pad + (a.slot / 60) * (100 - 2 * pad);
          return (
            <div key={a.name}
              onMouseEnter={function() { setHov(i); }}
              onClick={function() { setHov(i); }}
              style={{ position: "absolute", left: lf + "%", top: 0, transform: "translateX(-50%)",
                textAlign: "center", cursor: "pointer" }}>
              <div style={{
                fontFamily: "var(--nyt-sans)", fontSize: 11, fontWeight: 600,
                color: on ? C.red : C.muted, marginBottom: 6, whiteSpace: "nowrap",
                transition: "color 0.2s", letterSpacing: "0.04em"
              }}>{a.yr}</div>
              <div style={{
                width: on ? 14 : 10, height: on ? 14 : 10, borderRadius: "50%",
                background: on ? C.red : C.ink, margin: "0 auto",
                boxShadow: on ? "0 0 0 5px " + C.redS : "none",
                transition: "all 0.2s"
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
        {acquisitions.map(function(a, i) {
          var on = hov === i;
          return (
            <div key={a.name}
              onMouseEnter={function() { setHov(i); }}
              onClick={function() { setHov(i); }}
              style={{
                background: on ? C.paperH : C.inset,
                border: "1px solid " + (on ? C.ink : C.faint),
                borderRadius: 2, padding: "14px 15px", cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s"
              }}>
              <div style={{ fontFamily: "var(--nyt-display)", fontSize: 18, color: C.ink, fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontFamily: "var(--nyt-sans)", fontSize: 11, color: C.red, margin: "5px 0 8px", letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" }}>{a.yr} &middot; {a.price}</div>
              <div style={{ fontFamily: "var(--nyt-serif)", fontSize: 14, color: C.dim, lineHeight: 1.55 }}>{a.note}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function BundleTree() {
  var [open, setOpen] = useState(0);
  return (
    <Panel>
      <Eyebrow>The Bundle &mdash; five products, one subscription</Eyebrow>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <span style={{
          display: "inline-block",
          fontFamily: "var(--nyt-display)", fontSize: 19, fontWeight: 700, color: C.ink,
          padding: "9px 22px", background: C.inset,
          border: "1.5px solid " + C.ink, borderRadius: 0
        }}>
          NYT All Access <span style={{ fontFamily: "var(--nyt-sans)", fontSize: 11, color: C.red, letterSpacing: "0.16em", fontWeight: 700, marginLeft: 6 }}>~$25 / MO</span>
        </span>
      </div>
      <div style={{ width: 1, height: 22, background: C.ink, margin: "0 auto 4px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {bundle.map(function(b, i) {
          var isOpen = open === i;
          return (
            <div key={b.label} style={{
              background: C.inset, border: "1px solid " + C.faint,
              borderTop: "2px solid " + C.ink,
              borderRadius: 2, overflow: "hidden"
            }}>
              <button
                onClick={function() { setOpen(isOpen ? -1 : i); }}
                aria-expanded={isOpen}
                style={{
                  width: "100%", textAlign: "left", cursor: "pointer",
                  background: "transparent", border: "none",
                  padding: "14px 15px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10
                }}>
                <span style={{
                  fontFamily: "var(--nyt-display)", fontSize: 18, color: C.ink, fontWeight: 700, lineHeight: 1.2
                }}>{b.label}</span>
                <span style={{
                  color: C.red, fontFamily: "var(--nyt-sans)", fontSize: 18, fontWeight: 700,
                  transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s",
                  lineHeight: 1
                }}>+</span>
              </button>
              <div style={{
                maxHeight: isOpen ? 360 : 0,
                opacity: isOpen ? 1 : 0,
                transition: "max-height 0.36s cubic-bezier(0.16,1,0.3,1), opacity 0.3s",
                padding: isOpen ? "0 15px 15px" : "0 15px"
              }}>
                {b.notes.map(function(line) {
                  return (
                    <div key={line} style={{
                      fontFamily: "var(--nyt-serif)", fontSize: 14, color: C.dim,
                      lineHeight: 1.5, padding: "7px 0",
                      borderTop: "1px solid " + C.faint
                    }}>{line}</div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: "var(--nyt-sans)", fontSize: 10, color: C.soft, letterSpacing: "0.14em", textAlign: "center", marginTop: 18, textTransform: "uppercase", fontWeight: 500 }}>
        Tap a product to expand
      </div>
    </Panel>
  );
}

function SubscriberChart() {
  var [hov, setHov] = useState(subscriberSeries.length - 1);
  var W = 720, H = 280;
  var padL = 42, padR = 18, padT = 26, padB = 36;
  var innerW = W - padL - padR;
  var innerH = H - padT - padB;
  var maxV = 14;
  var n = subscriberSeries.length;
  var x = function(i) { return padL + (i / (n - 1)) * innerW; };
  var y = function(v) { return padT + innerH - (v / maxV) * innerH; };
  var path = subscriberSeries.map(function(d, i) {
    return (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(d.v).toFixed(1);
  }).join(" ");
  var active = subscriberSeries[hov];
  return (
    <Panel>
      <Eyebrow>Digital-Only Subscribers &mdash; 2011 to Q1 2026</Eyebrow>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        margin: "0 0 16px", flexWrap: "wrap", gap: 8
      }}>
        <div>
          <div style={{ fontFamily: "var(--nyt-sans)", fontSize: 11, color: C.red, letterSpacing: "0.14em", fontWeight: 600 }}>{active.yr}</div>
          <div style={{ fontFamily: "var(--nyt-display)", fontSize: 34, color: C.ink, fontWeight: 700, lineHeight: 1 }}>
            {active.v.toFixed(2)}M
          </div>
        </div>
        {active.lbl ? (
          <div style={{
            fontFamily: "var(--nyt-serif)", fontSize: 14, color: C.dim,
            fontStyle: "italic", maxWidth: 320, textAlign: "right"
          }}>{active.lbl}</div>
        ) : null}
      </div>
      <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: "auto", display: "block" }} preserveAspectRatio="xMidYMid meet">
        {[0, 4, 8, 12].map(function(v) {
          return (
            <g key={v}>
              <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)}
                stroke={C.faint} strokeWidth="1" />
              <text x={padL - 8} y={y(v) + 3.5} textAnchor="end"
                fontFamily="var(--nyt-sans)" fontSize="9.5" fontWeight="500" fill={C.muted}>{v}M</text>
            </g>
          );
        })}
        <path d={path} fill="none" stroke={C.ink} strokeWidth="2.2"
          strokeLinejoin="round" strokeLinecap="round" />
        {subscriberSeries.map(function(d, i) {
          var on = hov === i;
          return (
            <g key={d.yr}
              onMouseEnter={function() { setHov(i); }}
              onClick={function() { setHov(i); }}
              style={{ cursor: "pointer" }}>
              <circle cx={x(i)} cy={y(d.v)} r={on ? 7 : 4}
                fill={on ? C.red : C.ink}
                stroke={on ? "#fff" : "transparent"}
                strokeWidth={on ? 2 : 0} />
              {on ? (
                <circle cx={x(i)} cy={y(d.v)} r="11"
                  fill="none" stroke={C.red} strokeWidth="1" opacity="0.4" />
              ) : null}
              <text x={x(i)} y={H - 14} textAnchor="middle"
                fontFamily="var(--nyt-sans)" fontSize="9.5"
                fontWeight={on ? 700 : 500}
                fill={on ? C.red : C.muted}>
                {i % 2 === 0 || i === n - 1 ? "'" + d.yr.slice(2) : ""}
              </text>
              <rect x={x(i) - 18} y={padT} width="36" height={innerH} fill="transparent" />
            </g>
          );
        })}
      </svg>
      <div style={{
        fontFamily: "var(--nyt-sans)", fontSize: 10, color: C.soft,
        letterSpacing: "0.14em", textAlign: "center", marginTop: 8,
        textTransform: "uppercase", fontWeight: 500
      }}>
        Source: NYT 10-K / 10-Q filings &middot; Tap a point
      </div>
    </Panel>
  );
}

function RevenueMix() {
  var [hov, setHov] = useState(0);
  var colors = [C.ink, C.red, C.soft];
  return (
    <Panel>
      <Eyebrow>Revenue Mix &mdash; FY2024 ($2.59B)</Eyebrow>
      <div style={{ display: "flex", height: 30, borderRadius: 0, overflow: "hidden", border: "1.5px solid " + C.ink, marginBottom: 18 }}>
        {revenueMix.map(function(r, i) {
          var on = hov === i;
          return (
            <div key={r.label}
              onMouseEnter={function() { setHov(i); }}
              onClick={function() { setHov(i); }}
              style={{
                flex: r.pct, background: colors[i],
                opacity: on ? 1 : 0.78,
                cursor: "pointer", transition: "opacity 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--nyt-sans)", fontSize: 12,
                color: "#fff", fontWeight: 700, letterSpacing: "0.06em",
                borderRight: i < revenueMix.length - 1 ? "1.5px solid " + C.bg : "none"
              }}>{r.pct}%</div>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
        {revenueMix.map(function(r, i) {
          var on = hov === i;
          return (
            <div key={r.label}
              onMouseEnter={function() { setHov(i); }}
              onClick={function() { setHov(i); }}
              style={{
                background: on ? C.paperH : C.inset,
                border: "1px solid " + (on ? C.ink : C.faint),
                borderTop: "2px solid " + colors[i],
                borderRadius: 2,
                padding: "12px 14px", cursor: "pointer",
                transition: "background 0.2s, border-color 0.2s"
              }}>
              <div style={{ fontFamily: "var(--nyt-display)", fontSize: 17, color: C.ink, fontWeight: 700 }}>
                {r.label} <span style={{ color: colors[i], fontFamily: "var(--nyt-sans)", fontSize: 12, marginLeft: 4, fontWeight: 700 }}>{r.value}</span>
              </div>
              <div style={{ fontFamily: "var(--nyt-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.55, marginTop: 6 }}>{r.note}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Timeline() {
  var [active, setActive] = useState("2026");
  return (
    <Panel>
      <Eyebrow>Timeline &mdash; 2008 to 2026</Eyebrow>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 70, top: 8, bottom: 8, width: 1, background: C.ink, opacity: 0.5 }} />
        {timeline.map(function(it) {
          var on = active === it.yr;
          return (
            <div key={it.yr}
              onClick={function() { setActive(it.yr); }}
              style={{ display: "flex", gap: 18, cursor: "pointer", padding: "10px 0" }}>
              <div style={{
                width: 54, textAlign: "right", flexShrink: 0,
                fontFamily: "var(--nyt-sans)", fontSize: on ? 14 : 12,
                color: on ? C.red : C.muted, paddingTop: 3,
                transition: "color 0.2s, font-size 0.2s", fontWeight: on ? 700 : 600,
                letterSpacing: "0.04em"
              }}>{it.yr}</div>
              <div style={{ width: 32, position: "relative", flexShrink: 0, display: "flex", justifyContent: "center" }}>
                <div style={{
                  width: on ? 13 : 8, height: on ? 13 : 8, borderRadius: "50%",
                  background: on ? C.red : C.ink, marginTop: 6,
                  boxShadow: on ? "0 0 0 5px " + C.redS : "none",
                  transition: "all 0.2s", zIndex: 1
                }} />
              </div>
              <div style={{
                flex: 1,
                background: on ? C.paperH : C.inset,
                border: "1px solid " + (on ? C.ink : C.faint),
                borderRadius: 2, padding: "11px 15px",
                transition: "background 0.2s, border-color 0.2s"
              }}>
                <div style={{ fontFamily: "var(--nyt-display)", fontSize: 16.5, color: C.ink, fontWeight: 700 }}>{it.t}</div>
                <div style={{ fontFamily: "var(--nyt-serif)", fontSize: 14, color: C.dim, lineHeight: 1.55, marginTop: 4 }}>{it.d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Ledger() {
  return (
    <Panel>
      <Eyebrow>By the Numbers</Eyebrow>
      <div>
        {ledger.map(function(row, i) {
          return (
            <div key={row.k} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              gap: 18, padding: "12px 2px",
              borderTop: i === 0 ? "none" : "1px solid " + C.faint
            }}>
              <span style={{ fontFamily: "var(--nyt-serif)", fontSize: 15, color: C.text, lineHeight: 1.45 }}>{row.k}</span>
              <span style={{ fontFamily: "var(--nyt-sans)", fontSize: 13, color: C.ink, textAlign: "right", whiteSpace: "nowrap", flexShrink: 0, fontWeight: 600 }}>{row.v}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Management() {
  return (
    <Panel>
      <Eyebrow>The Cast &mdash; who carried it</Eyebrow>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {management.map(function(m) {
          return (
            <div key={m.name} style={{
              background: C.inset, border: "1px solid " + C.faint,
              borderTop: "2px solid " + C.ink,
              borderRadius: 2, padding: "16px 16px 14px"
            }}>
              <div style={{
                fontFamily: "var(--nyt-sans)", fontSize: 10.5, color: C.red,
                letterSpacing: "0.16em", textTransform: "uppercase", lineHeight: 1.4,
                fontWeight: 700
              }}>{m.role}</div>
              <div style={{ fontFamily: "var(--nyt-display)", fontSize: 19, color: C.ink, fontWeight: 700, margin: "10px 0 4px", lineHeight: 1.15 }}>{m.name}</div>
              <div style={{ fontFamily: "var(--nyt-sans)", fontSize: 11, color: C.muted, letterSpacing: "0.04em", marginBottom: 10, fontWeight: 500 }}>{m.tenure}</div>
              <div style={{ fontFamily: "var(--nyt-serif)", fontSize: 14, color: C.dim, lineHeight: 1.55 }}>{m.note}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Peers() {
  return (
    <Panel>
      <Eyebrow>Competitive Position &mdash; the peer set</Eyebrow>
      <p style={{
        fontFamily: "var(--nyt-serif)", fontSize: 15, color: C.muted,
        lineHeight: 1.6, margin: "0 0 22px", maxWidth: 640
      }}>
        NYT versus the other publishers that have built or attempted to build digital subscription
        businesses at scale in English. NYT is now the only one compounding.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {peers.map(function(col, idx) {
          var headColor = idx === 3 ? C.red : C.ink;
          return (
            <div key={col.label} style={{
              background: C.inset, border: "1px solid " + C.faint,
              borderTop: "2px solid " + headColor,
              borderRadius: 2, padding: "14px 16px 8px"
            }}>
              <div style={{
                fontFamily: "var(--nyt-display)", fontSize: 16, color: C.ink, fontWeight: 700,
                marginBottom: 10, lineHeight: 1.3
              }}>{col.label}</div>
              {col.items.map(function(p) {
                return (
                  <div key={p.n} style={{ padding: "9px 0", borderTop: "1px solid " + C.faint }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontFamily: "var(--nyt-serif)", fontSize: 14.5, color: C.text, fontWeight: 500, lineHeight: 1.3 }}>{p.n}</span>
                      <span style={{
                        fontFamily: "var(--nyt-sans)", fontSize: 10.5, color: headColor,
                        letterSpacing: "0.05em", padding: "2px 7px",
                        border: "1px solid " + headColor + "55", borderRadius: 2,
                        whiteSpace: "nowrap", flexShrink: 0, fontWeight: 600
                      }}>{p.tag}</span>
                    </div>
                    <div style={{ fontFamily: "var(--nyt-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.5, marginTop: 4 }}>{p.d}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Capstone({ label, title }) {
  return (
    <FadeIn>
      <div style={{ margin: "84px 0 6px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--nyt-sans)", fontSize: 10.5, color: C.red, letterSpacing: "0.32em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>{label}</div>
        <div style={{ fontFamily: "var(--nyt-display)", fontSize: "clamp(28px, 4.4vw, 40px)", color: C.ink, fontWeight: 700, letterSpacing: "-0.005em", lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ width: 50, height: 2, background: C.ink, margin: "20px auto 0" }} />
      </div>
    </FadeIn>
  );
}

function Sources() {
  var globalIdx = 0;
  return (
    <section>
      <Capstone label="Appendix" title="Sources" />
      <FadeIn>
        <p style={{
          fontFamily: "var(--nyt-serif)", fontSize: 15, color: C.muted,
          lineHeight: 1.65, textAlign: "center", maxWidth: 600,
          margin: "22px auto 40px"
        }}>
          Primary filings, financial press, and industry publications consulted in building
          this narrative, grouped by subject. Inline numbers in the text above link to entries
          below. Every link opens in a new tab.
        </p>
      </FadeIn>
      {sources.map(function(g) {
        return (
          <div key={g.group} style={{ marginBottom: 32 }}>
            <Eyebrow>{g.group}</Eyebrow>
            <div>
              {g.items.map(function(s, i) {
                globalIdx += 1;
                var n = globalIdx;
                return (
                  <FadeIn key={g.group + "-" + i}>
                    <a id={"src-" + n} href={s.url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "flex", gap: 14, alignItems: "baseline",
                        padding: "11px 15px", marginBottom: 6,
                        background: C.paper, border: "1px solid " + C.faint,
                        borderRadius: 2, textDecoration: "none",
                        scrollMarginTop: 80,
                        transition: "border-color 0.2s, background 0.2s"
                      }}
                      onMouseEnter={function(e) { e.currentTarget.style.borderColor = C.ink; e.currentTarget.style.background = C.paperH; }}
                      onMouseLeave={function(e) { e.currentTarget.style.borderColor = C.faint; e.currentTarget.style.background = C.paper; }}>
                      <span style={{ fontFamily: "var(--nyt-sans)", fontSize: 11, color: C.red, minWidth: 26, flexShrink: 0, fontWeight: 700 }}>{n < 10 ? "0" + n : n}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontFamily: "var(--nyt-serif)", fontSize: 14.5, color: C.ink, fontWeight: 500, lineHeight: 1.4 }}>{s.t}</span>
                        <span style={{ display: "block", fontFamily: "var(--nyt-sans)", fontSize: 11, color: C.muted, marginTop: 3, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>{s.p}</span>
                      </span>
                      <span style={{ color: C.soft, fontSize: 13, flexShrink: 0 }}>&#8599;</span>
                    </a>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

// ==================== MAIN ====================

export default function NytTurnaround() {
  var [activeChapter, setActiveChapter] = useState("ch1");
  var [showNav, setShowNav] = useState(function() { return typeof window !== "undefined" && window.innerWidth <= 768; });
  var rafRef = useRef(null);
  var lastRef = useRef("ch1");

  useEffect(function() { window.scrollTo(0, 0); }, []);

  useEffect(function() {
    var onScroll = function() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(function() {
        rafRef.current = null;
        setShowNav(window.innerWidth <= 768 || window.scrollY > window.innerHeight * 0.7);
        var found = chapters[0].id;
        for (var i = chapters.length - 1; i >= 0; i--) {
          var el = document.getElementById(chapters[i].id);
          if (el && el.getBoundingClientRect().top < 160) { found = chapters[i].id; break; }
        }
        if (found !== lastRef.current) { lastRef.current = found; setActiveChapter(found); }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return function() {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="nyt-root" style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "var(--nyt-serif)" }}>

      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;0,900;1,500;1,700&family=Source+Serif+4:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
      <style>{`
        html, body { overflow-x: hidden; max-width: 100%; background: ${C.bg}; }
        .nyt-root {
          --nyt-display: 'Playfair Display', 'Times New Roman', Georgia, serif;
          --nyt-serif:   'Source Serif 4', Georgia, 'Times New Roman', serif;
          --nyt-sans:    'Inter', system-ui, sans-serif;
          --nyt-mono:    'JetBrains Mono', Menlo, monospace;
          overflow-x: clip;
          max-width: 100%;
        }
        .nyt-root *::selection { background: ${C.ink}; color: ${C.bg}; }
        .nyt-root nav div::-webkit-scrollbar { display: none; }
        .nyt-navscroll { padding-left: 100px; }
        .nyt-back-label::after { content: ""; }
        .nyt-cite a:hover { background: ${C.redS}; }
        .nyt-cite-pulse { background: ${C.redS} !important; transition: background 0.4s ease; }
        @media (min-width: 1024px) {
          .nyt-back { top: 24px !important; left: 24px !important; padding: 10px 16px !important; font-size: 12px !important; gap: 8px !important; }
          .nyt-back-label::after { content: " to research"; }
          .nyt-navscroll { padding-left: 170px; }
        }
        @media (max-width: 768px) {
          .nyt-hero-sec { min-height: auto !important; }
          .nyt-hero-in { padding-top: 80px !important; padding-bottom: 40px !important; }
        }
      `}</style>

      <ProgressBar />
      <BackButton />
      <NavBar active={activeChapter} show={showNav} />

      {/* ================= HERO / FRONT PAGE ================= */}
      <section className="nyt-hero-sec" style={{ minHeight: "92vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="nyt-hero-in" style={{ position: "relative", zIndex: 2, maxWidth: 920, margin: "0 auto", padding: "13vh 24px 7vh", width: "100%" }}>

          {/* Masthead strip */}
          <FadeIn>
            <div style={{
              borderTop: "1.5px solid " + C.ink,
              borderBottom: "1.5px solid " + C.ink,
              padding: "10px 0",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: 8,
              fontFamily: "var(--nyt-sans)", fontSize: 10.5,
              color: C.ink, letterSpacing: "0.18em", textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 44
            }}>
              <span>A Business Turnaround</span>
              <span style={{ color: C.red, fontWeight: 700 }}>All the Subscribers That Fit</span>
              <span>NYSE: NYT &middot; May 2026</span>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <h1 style={{
              fontFamily: "var(--nyt-display)",
              fontSize: "clamp(44px, 8vw, 88px)",
              lineHeight: 0.96,
              letterSpacing: "-0.018em",
              color: C.ink,
              margin: "0 0 22px",
              fontWeight: 800,
              textAlign: "center"
            }}>
              From Newsprint to Compounder<br />
              <span style={{ fontStyle: "italic", fontWeight: 700, color: C.ink, fontSize: "0.78em" }}>The New York Times Turnaround</span>
            </h1>
          </FadeIn>

          <FadeIn delay={220}>
            <div style={{
              width: 80, height: 1, background: C.ink,
              margin: "0 auto 26px"
            }} />
          </FadeIn>

          <FadeIn delay={260}>
            <p style={{
              fontFamily: "var(--nyt-serif)",
              fontSize: "clamp(17px, 2vw, 21px)",
              lineHeight: 1.5,
              color: C.text,
              maxWidth: 700,
              margin: "0 auto 36px",
              textAlign: "center"
            }}>
              A company that borrowed <strong style={{ fontWeight: 600 }}>$250 million from Carlos Slim at fourteen percent</strong> in
              January 2009, sold its building, dumped About.com and the Boston Globe, and watched
              its stock trade below five dollars &mdash; has become a roughly <strong style={{ fontWeight: 600 }}>$12 billion subscription
              business</strong> with <strong style={{ fontWeight: 600 }}>12.5 million digital subscribers</strong>, zero debt, and a stock that has
              compounded about eighteen percent a year for fifteen years. Nine chapters on how.
            </p>
          </FadeIn>

          <FadeIn delay={360}>
            <div style={{
              display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap",
              fontFamily: "var(--nyt-sans)", fontSize: 10.5, color: C.muted,
              letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600
            }}>
              <span>Nine chapters</span>
              <span style={{ color: C.faint }}>&bull;</span>
              <span>2009 &mdash; 2026</span>
              <span style={{ color: C.faint }}>&bull;</span>
              <span>Adib Choudhury</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 100px" }}>

        {/* STATS UP TOP (pre-chapter dek) */}
        <FadeIn>
          <div style={{
            fontFamily: "var(--nyt-sans)", fontSize: 10.5, color: C.red,
            letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700,
            textAlign: "center", marginTop: 0, marginBottom: 10
          }}>The Inflection &mdash; Q1 2026</div>
        </FadeIn>

        <StatBand />

        <FadeIn delay={120}>
          <p style={{
            fontFamily: "var(--nyt-serif)",
            fontSize: 16.5,
            lineHeight: 1.62,
            color: C.dim,
            textAlign: "center",
            maxWidth: 640, margin: "20px auto 0",
            fontStyle: "italic"
          }}>
            On May 7, 2026, NYT reported revenue up twelve percent year-over-year<Cite n={[2,6]} />, digital
            advertising up thirty-one and a half percent<Cite n={[6,8]} />, and net new digital subscribers of
            310,000 in three months<Cite n={9} />. The stock jumped about eight and a half percent on the
            print<Cite n={9} />. The company that almost defaulted in 2009 has become the only English-language
            news compounder at scale.
          </p>
        </FadeIn>

        {/* CHAPTER I */}
        <H2 id="ch1">The Decline</H2>
        <ChapterRule num="I" />
        <Lead>To understand the comeback you have to start where the company nearly died.</Lead>
        <P first="B">y the autumn of 2008, The New York Times Company was running out of options. The print classified line — once roughly forty percent of newspaper ad revenue industrywide<Cite n={14} /> — had been gutted by Craigslist, which researchers Robert Seamans and Feng Zhu would later estimate had stripped about five billion dollars from U.S. newspapers between 2000 and 2007<Cite n={[13,14]} />. The financial crisis had tanked the rest of the print display market. Brand advertising was migrating, structurally, to Google and Facebook. The Times had ridden three empire bets into the wrong end of the cycle: $1.1 billion paid in 1993 for The Boston Globe<Cite n={15} />, $410 million in 2005 for About.com<Cite n={16} />, and a Renzo Piano headquarters at 620 Eighth Avenue that had been completed in 2007 at a cost north of six hundred million<Cite n={17} />. By early 2009, a four-hundred-million-dollar credit line was rolling toward expiration with no realistic refinancing path<Cite n={11} />.</P>
        <P>The stock collapsed. Throughout the first half of 2009, NYT traded below five dollars<Cite n={[7,10]} />. The dividend was suspended that year and would not be reinstated until 2013<Cite n={7} />. Print advertising, which had still been over a billion dollars in 2008, was about to enter a multi-year free fall that would never reverse — by 2024, the entire ad line, print and digital combined, would total $506 million<Cite n={1} />, less than half the 2008 print figure alone. The question inside the building was no longer how to grow. It was whether the company could remain solvent long enough to figure out what it was going to grow into.</P>
        <P>The Ochs-Sulzberger family had been the owning family since Adolph Ochs bought a controlling stake in 1896. The dual-class structure — Class B supervoting shares held almost entirely by the family — meant no hostile takeover was possible. The protection was real. It did not, however, pay the company's bills. Arthur Sulzberger Jr., publisher since 1992, had presided over the dot-com bubble launches, the Globe purchase, the About.com purchase, the headquarters build. He would now preside over the dismantlement. The CEO Janet Robinson would shepherd the company through the worst of the crisis and exit at the end of 2011, just as the new strategy began to take hold.</P>

        {/* CHAPTER II */}
        <H2 id="ch2">Lifelines &amp; Losses</H2>
        <ChapterRule num="II" />
        <P first="O">n January 19, 2009, Carlos Slim Helú — at the time the wealthiest person in the world — extended the Times Company a $250 million senior unsecured loan<Cite n={[11,12]} />. The coupon was fourteen percent. There was a twelve percent premium on redemption. And Slim received warrants to purchase 15.9 million shares of Class A stock at $6.36, exercisable until January 2015<Cite n={12} />. The strike was struck almost exactly at the trough. The Times's treasurer, Tony Benten, would tell Poynter sixteen years later: "It was a very stressful time frame. We could have gotten a better rate, but the[ir] terms were much more restrictive."<Cite n={11} /></P>

        <Epigraph cite="Tony Benten, NYT treasurer in 2009, to Poynter (2025)">
          It was a very stressful time frame. We could have gotten a better rate, but the terms were much more restrictive.
        </Epigraph>

        <P>The asset disposals came quickly. In March 2009 the Times sold the leasehold to twenty-one floors of its Renzo Piano headquarters — about 750,000 square feet — to W. P. Carey for $225 million in a fifteen-year sale-leaseback at $24 million a year<Cite n={17} />. (It would buy the leasehold back in 2019 for $245 million<Cite n={17} />.) It sold its stake in the Boston Red Sox. It sold its New England regional papers. In August 2012 it sold About.com to IAC/Ask.com for $300 million — a roughly $110 million loss against the 2005 purchase price, with a $195 million impairment booked the same quarter<Cite n={[5,16]} />. In October 2013, John Henry — the hedge-fund manager who had bought the Boston Red Sox — closed the purchase of The Boston Globe and The Worcester Telegram &amp; Gazette for $70 million, against the $1.1 billion the Times had paid in 1993<Cite n={15} />. The Globe sold, as Ken Doctor put it at Nieman Lab, for less than four percent of what it had been worth in 1993 dollars<Cite n={18} />.</P>

        <Acquisitions />

        <P>The Slim loan was redeemed in 2011<Cite n={11} />. The warrants were exercised in January 2015, with the stock then at $12.60 — a paper profit Bloomberg estimated at over $263 million on the warrants alone, on top of roughly $122 million of interest and the redemption premium<Cite n={12} />. Slim held the position another five years, selling down through early 2020<Cite n={11} />. He never sought board representation. He had simply written the check that no one else would, taken the equity kicker the hour demanded, and held it as the stock did its work.</P>
        <P>What this period looked like from outside was a company in retreat. What it was, in retrospect, was a clearing of the balance sheet for the only bet that could possibly matter.</P>

        {/* CHAPTER III */}
        <H2 id="ch3">The Cast</H2>
        <ChapterRule num="III" />
        <P first="T">hree executives carried the transformation. <strong>Mark Thompson</strong> — the outgoing Director-General of the BBC, where he had run a £4 billion organization since 2004 — was hired as CEO in August 2012 and took the corner office in November<Cite n={25} />. He was a broadcaster, not a newspaperman, which the board had decided was a feature. Thompson brought broadcast-style audience thinking into a print-centric newsroom, launched Cooking and the NYT Now app, hired Meredith Kopit Levien from Forbes in 2013<Cite n={24} />, and pushed digital subscriptions from somewhere around five hundred thousand to roughly six and a half million during his eight-year tenure<Cite n={25} />. The stock rose from about nine dollars to over forty-six. CNBC, at his exit, called it a roughly four-hundred-percent gain<Cite n={25} />.</P>
        <P><strong>Meredith Kopit Levien</strong> became CEO on September 8, 2020. She was forty-nine<Cite n={23} />. She had come up through advertising sales — first at Forbes Media, then at the Times since 2013, where she had remade the entire ad organization (turning over seventy-five to eighty percent of the sales staff in her first fifteen to eighteen months, by her own account to Nieman Lab)<Cite n={24} />. She had been Thompson's chief operating officer since 2017. The strategic plan she released in her first year, "Times2020," identified NYT explicitly as "a subscription-first business"<Cite n={[21,24]} />. She would, more than anyone else, industrialize the bundle.</P>
        <P><strong>A.G. Sulzberger</strong>, the sixth-generation Ochs-Sulzberger to take the publisher's chair, became publisher on January 1, 2018, at the age of thirty-seven<Cite n={22} />. Before that — and the timing matters — he had been the lead author of the 96-page internal memo, the Innovation Report, that diagnosed the cultural failure to be digital-first in May 2014<Cite n={22} />. He took the combined chairman-and-publisher title on January 1, 2021. He was the inheritor of the family's structural patience and, simultaneously, the document that converted the patience into a plan.</P>
        <P>Editorial credibility came from two executive editors. <strong>Dean Baquet</strong>, the first Black executive editor of the Times, ran the newsroom from May 2014 to June 2022 and oversaw eighteen Pulitzer Prizes — Weinstein and #MeToo, the 1619 Project, the Trump tax returns<Cite n={26} />. <strong>Joe Kahn</strong>, a 24-year veteran of the paper and two-time Pulitzer winner, took over in June 2022<Cite n={26} />. Their work was not a charity; it was the business. The entire bundle proposition rests on NYT being the must-have English-language news subscription. Without the journalism, there is no bundle.</P>

        <Management />

        {/* CHAPTER IV */}
        <H2 id="ch4">The Paywall</H2>
        <ChapterRule num="IV" />
        <Lead>The most consequential strategic decision in American newspaper history.</Lead>
        <P first="O">n March 28, 2011, The New York Times turned on its metered paywall<Cite n={19} />. Non-subscribers got twenty free articles per month. After that, a soft wall asked them to pay — initially $8.75 a week for the digital basic plan<Cite n={19} />. The consensus view among media commentators, captured in Jay Rosen's retrospective at PressThink, was that it would fail. The free-online ad model was the model; everyone was sure of it. There were paywall failures already documented across the industry<Cite n={21} />. The cynicism was nearly total.</P>
        <P>Within three months, 224,000 people were paying<Cite n={19} />. By the end of 2013, the Times had 727,000 digital-only subscribers, generating about $150 million of annualized "new" digital reader revenue — the number Ken Doctor calculated in November 2013, in the Nieman Lab piece that, more than any other contemporaneous analysis, captured how big a deal the paywall already was<Cite n={20} />. The number doubled, then doubled again. By the end of 2020, the company had more than five million digital-only news subscribers and a stock price north of forty-six dollars<Cite n={25} />. By February 2022, after the close of The Athletic acquisition, the Times hit ten million subscribers — about three years ahead of the 2025 target it had set in 2019<Cite n={36} />. By Q1 2026 the number was 12.52 million digital-only, 13.08 million in total<Cite n={[2,9]} />.</P>

        <SubscriberChart />

        <P>What the paywall did, structurally, was reverse the causal arrow of the news business. The old model: produce news as a vehicle for advertising. The new model: produce news as a vehicle for reader payment, and use the reader relationship to do everything else — advertising, commerce, licensing — on top of it. The implications would take a decade to fully reveal themselves. They would mean that the Times had pricing power, which it would exercise across every product launch from 2014 forward. They would mean that the Times could afford to grow its newsroom while every other paper in America was shrinking, because subscriber economics scale on a marginal-cost basis the way print never did. They would mean that the Times's incentive was to make journalism a habit, not a click — which is why Cooking and Games and The Athletic would eventually become structurally important, because they made the relationship daily. And they would mean, ultimately, that the Times could survive a deflationary collapse in search-referred traffic, because most of its subscribers did not come through search.</P>

        <PullQuote>Reverse the causal arrow of the news business.</PullQuote>

        {/* CHAPTER V */}
        <H2 id="ch5">The Innovation Report</H2>
        <ChapterRule num="V" />
        <P first="T">he paywall worked at the business level. The culture, in the meantime, was still print. This was the diagnosis at the heart of a ninety-six-page internal memo led by a then thirty-three-year-old associate editor for newsroom strategy named A.G. Sulzberger<Cite n={22} />. The document, six months in the making, was leaked to BuzzFeed's Myles Tanzer in May 2014, amid the firing of executive editor Jill Abramson and the promotion of Dean Baquet<Cite n={22} />. Joshua Benton, founder of Nieman Lab, called it "one of the key documents of this media age."<Cite n={22} /></P>
        <P>What the report said, in flat language, was that the newsroom was being lapped — and that the competitors lapping it were not the Wall Street Journal or the Washington Post. They were Vox, BuzzFeed, First Look Media, the Huffington Post, Business Insider, ESPN<Cite n={22} />. Inside the Times newsroom, reporters were still evaluated by A1 placements. The "church and state" wall between newsroom and business — a structural protection of editorial independence for a century — was preventing product collaboration. The report recommended: hire and empower digital talent, integrate product and engineering with editorial, treat readers, not advertisers, as the primary customer.</P>

        <Epigraph cite="A.G. Sulzberger et al., the 2014 Innovation Report">
          The Times is winning at journalism. At the same time we are falling behind in a second critical area: the art and science of getting our journalism to readers.
        </Epigraph>

        <P>The Innovation Report became, almost overnight, the internal manifesto for the pivot. A.G. Sulzberger was named deputy publisher in October 2016 and publisher on January 1, 2018. The report's recommendations — particularly the ones about reader-first thinking, about product investment, about treating distribution as a core competency rather than someone else's problem — would be quoted back at the company by Levien in the 2020 "Times2020" strategic plan<Cite n={[21,24]} />. The modern Times — the bundle, the engineering organization, the family-plan pricing, the daily-habit products — all runs through that document.</P>

        {/* CHAPTER VI */}
        <H2 id="ch6">Building the Bundle</H2>
        <ChapterRule num="VI" />
        <P first="T">he architecture decision Levien made — and it was, more than any single product launch, the decision that defined her tenure — was to build a bundle. The Times would not sell News as a single subscription. It would sell News plus Games plus Cooking plus Wirecutter plus, eventually, The Athletic, in an All Access bundle priced at one number (about twenty-five dollars a month at standard rates, with substantial introductory discounting)<Cite n={33} />.</P>
        <P>The bundle was a moat decision. Once a household paid for a bundle, the marginal cost of any one component dropped, the perceived value of the entire package rose, and the household became dramatically less likely to churn. By Q3 2025, roughly fifty-one percent of NYT subscribers were on multi-product bundles, with bundle ARPU at about $13.40 against news-only ARPU of about $9.29 — a forty-four percent premium<Cite n={[33,34]} />. Bundle subscribers, the company would explain on its earnings calls, were habit-driven; they came direct, not through search; they engaged daily; they were structurally more resistant to the macro pressures that hit single-product subscriptions.</P>

        <BundleTree />

        <P>NYT Cooking launched in 2014 under Sam Sifton, the former dining editor. It became a standalone subscription, then a piece of the All Access bundle, and the kitchen relationship with a household — the same brand authority the Times has in news, applied to a categorically different daily problem (what to eat tonight). NYT Games, anchored for eight decades by the Crossword, added the Mini, Spelling Bee, Tiles, then Connections (2023), then Strands (2024). By December 2021, Games on its own had passed one million standalone subscribers<Cite n={[33,35]} />. The Wirecutter was acquired in October 2016 for roughly thirty million dollars<Cite n={27} /> and gave the Times an affiliate-commerce engine that, almost incidentally, would be carved out of the Amazon AI license eight years later because "Amazon and Wirecutter have a longstanding relationship," per a source quoted in Axios<Cite n={49} />.</P>
        <P>And then, on January 31, 2022, the Times bought Wordle from a Brooklyn software engineer named Josh Wardle for what it described as "low seven figures"<Cite n={30} />. Wordle's traffic, in the months after, became a household ritual; the Times integrated it into the Games app and used it as the top-of-funnel asset for the entire Games subscription. Connections, launched in 2023, became the retention play. The Games subscription is now the daily habit the entire household uses — the lifetime-value math is dramatically better than news alone.</P>

        {/* CHAPTER VII */}
        <H2 id="ch7">The Athletic &amp; Wordle</H2>
        <ChapterRule num="VII" />
        <P first="O">n January 6, 2022, The New York Times Company announced it would acquire The Athletic for five hundred and fifty million dollars in cash<Cite n={[28,29]} />. The Athletic was a sports-journalism subscription business founded in 2016 by Alex Mather and Adam Hansmann, two former Strava executives<Cite n={28} />. It had built itself by aggressively hiring beat writers away from local newspapers — sometimes in waves, the entire baseball or basketball beat for a metro market — and packaging them behind a single national paywall. At close, The Athletic had roughly 1.2 million paying subscribers<Cite n={28} />. The deal, the Times said, would be revenue-accretive immediately and operating-profit dilutive for about three years, with breakeven by 2025<Cite n={[28,29]} />.</P>
        <P>The strategic logic was nearly perfect. The Times had a bundle architecture; it had pricing power; it had a single product gap that mattered enormously to the kind of household that already paid for news (sports) — and the news org could not credibly fill the gap on its own. The Athletic filled it with a subscriber base that overlapped only modestly with NYT's. Mather and Hansmann were retained as co-presidents. The product was folded into the All Access bundle in 2023. On February 2, 2022, less than a month after close, the Times disclosed in its Q4 2021 earnings that it had hit ten million subscribers — three years ahead of the goal it had set in 2019<Cite n={36} />. Levien immediately announced the new target of fifteen million by the end of 2027<Cite n={36} />.</P>

        <Epigraph cite="NYT press release, January 6, 2022">
          The Athletic is a high-quality, exciting addition to The New York Times Company that is consistent with our long-term subscription growth strategy.
        </Epigraph>

        <P>The Athletic, viewed five years later, was the deal that locked in the structural shift. It demonstrated that the Times could integrate a subscription business at scale. It validated the bundle as the central commercial architecture. It established the playbook for future acquisitions — small enough to integrate, strategic enough to matter, focused on the daily-habit gap rather than on adjacent advertising businesses. And it pushed the company across the ten-million-subscriber threshold at the moment when the broader media market was beginning to crack.</P>

        {/* CHAPTER VIII */}
        <H2 id="ch8">The Numbers Now</H2>
        <ChapterRule num="VIII" />
        <P first="F">or fiscal year 2024, NYT reported total revenue of $2,585 million — up about 6.6 percent year-over-year — of which subscription revenue accounted for $1,788 million (sixty-nine percent), advertising for $506 million (twenty percent), and other (Wirecutter affiliate, licensing, live events) for $291 million (eleven percent)<Cite n={1} />. Within the advertising line, digital was about seventy-three percent of the total and growing; print was the residual and declining<Cite n={1} />. The print line, which had been over a billion dollars in 2008, was a small fraction of what the digital subscription line had become.</P>

        <RevenueMix />

        <P>The Q1 2026 results, reported on May 7, 2026, showed the engine running cleanly. Total revenue was $712 million against $635.9 million a year earlier, up twelve percent<Cite n={[2,6]} />. Subscription revenue was up 11.3 percent at $516.9 million; digital-only subscription revenue specifically was up 16.1 percent at $389 million, an annualized run-rate of roughly $1.55 billion<Cite n={[2,6]} />. Advertising revenue rose 17.3 percent overall; digital advertising rose 31.6 percent<Cite n={[6,8]} />. The GAAP operating margin was 12.7 percent; the adjusted operating margin was 16.6 percent<Cite n={[2,6]} />. Free cash flow over the trailing twelve months was about $540 million, on a 21 percent FCF margin<Cite n={[6,7]} />. Cash and securities were over $1.1 billion. Total debt remained zero. The undrawn credit facility was $400 million<Cite n={[2,7]} />. The company repurchased 779,365 shares in Q1 2026 for $56.3 million and raised the quarterly dividend to $0.23<Cite n={[2,6]} />.</P>
        <P>This is, for any practical analytical purpose, no longer the financial profile of a newspaper. It is the financial profile of a high-quality consumer subscription compounder. The roughly 16 percent adjusted operating margins, roughly 21 percent FCF margins, mid-teens recurring revenue growth, zero debt, eleven-figure cash balance, and forty-plus percent bundle penetration are closer to consumer SaaS economics than to anything published on the NYSE under a "Publishing" industry classification. The market has noticed: NYT trades at an EV/Revenue multiple of about 3.6x against News Corp's roughly 1.8x and Gannett's roughly 0.3x<Cite n={10} />.</P>

        <Ledger />

        {/* CHAPTER IX */}
        <H2 id="ch9">AI and the Long Game</H2>
        <ChapterRule num="IX" />
        <P first="O">n December 27, 2023, The New York Times Company filed suit against Microsoft and OpenAI in the Southern District of New York, alleging unlawful copying of millions of Times articles to train GPT models<Cite n={[45,47]} />. The complaint included specific allegations of verbatim regurgitation by ChatGPT of paywalled articles and Wirecutter recommendations<Cite n={45} />. OpenAI's response, still on its website, called the suit "a surprise and disappointment" and argued the use was fair<Cite n={46} />. In January 2025, three publisher cases — the Times's, the New York Daily News's, and the Center for Investigative Reporting's — were consolidated before Judge Sidney Stein<Cite n={47} />.</P>
        <P>The lawsuit is, financially, a long-tail option. The Times's damages theory rests on statutory damages of up to $150,000 per willful infringement, applied to millions of articles<Cite n={45} />. The math is enormous and largely speculative. But the strategic logic was clear: the Times had been the only major American news organization willing to be the named plaintiff against the largest generative-AI company in the world, and the longer the case proceeded without settlement, the more leverage the Times accumulated in licensing negotiations with every other AI lab.</P>
        <P>On May 29, 2025, that leverage produced its first deal. The Times announced its first generative-AI licensing agreement: a multi-year contract with Amazon, covering NYT, NYT Cooking, and The Athletic content<Cite n={[48,49]} />. (Wirecutter was carved out, per the Axios source<Cite n={49} />.) The terms were initially undisclosed. On July 30, 2025, the Wall Street Journal reported, citing people familiar, that the deal was worth twenty to twenty-five million dollars a year — "nearly one percent of the Times's total 2024 revenue" — confirmed the same day by GeekWire and PYMNTS<Cite n={[50,51,52]} />. Levien's internal memo characterized it as "consistent with our long-held principle that high-quality journalism is worth paying for"<Cite n={48} />. Aaron Rubin of Gunderson Dettmer told Digiday the deal implied that using NYT content without a license "may not be a fair use" — strengthening the damages case in the same motion<Cite n={53} />.</P>

        <Epigraph cite="Meredith Kopit Levien, Q1 2026 earnings call">
          We're able to meet that demand despite operating in a media environment dominated by a small number of tech companies whose moves continue to impact traffic to publishers.
        </Epigraph>

        <P>The structural risk is real and unresolved. Generative AI in search — Google's AI Overviews, ChatGPT-as-default research interface — is compressing the top of the funnel for every English-language publisher. The mitigation is precisely the bundle. Bundled subscribers come direct, not through search. They engage with Games, Cooking, The Athletic and audio in addition to news. They are habit-driven. They are insulated. Only about one-eighth of NYT's subscribers are news-only; the other seven-eighths are bundle or other-product subscribers whose relationship with the company does not depend on a Google referral<Cite n={33} />. This is the moat. Whether it is wide enough to outlast the deflation in search traffic is the open question.</P>

        <P>The easiest way to see what the Times did is to look at what its closest peers did not. The Washington Post is the cleanest counterfactual: a national newsroom, comparable brand equity, a billionaire owner (Jeff Bezos, who paid $250 million in 2013) with the resources to make any structural bet. In January 2021 the Post had roughly three million digital subscribers and its traffic peaked that month<Cite n={43} />. Five years later, WSJ reporting (citing people familiar, never officially confirmed) puts losses at $77 million in 2023, $100 million in 2024, and $100 million in 2025<Cite n={[42,43]} />. Executive editor Sally Buzbee resigned suddenly on June 2, 2024<Cite n={40} />. In October 2024, publisher Will Lewis spiked the Post's Kamala Harris endorsement on Bezos's instructions; more than 250,000 subscribers reportedly cancelled<Cite n={[41,43]} />. In February 2026 the Post laid off roughly one-third of its newsroom and Lewis stepped down<Cite n={[41,42]} />. The Post never built a bundle. It never built the lifestyle stack. It maintained a single-product subscription on a brand that, while strong, was not strong enough to support the same pricing power. Gannett, the largest U.S. local-newspaper chain, is similar: revenue down from $3.21 billion (2021) to $2.51 billion (2024), a $100 million cost reduction announced in 2025, a forecast net loss<Cite n={44} />. NYT is the exception.</P>

        <Peers />

        <P>What current management is trying to do, in plain language, is hit fifteen million subscribers by the end of 2027<Cite n={36} />, convert the bundle into the dominant English-language consumer-news product on Earth, and price AI licensing into a meaningful revenue line. The benchmarks the company watches — 310,000 net digital adds against a consensus of about 270,000 in Q1 2026<Cite n={9} />, ARPU growth of 2.4 percent year-over-year<Cite n={[6,8]} />, bundle penetration trending past fifty percent<Cite n={[33,34]} />, digital ad growth in double digits<Cite n={[6,8]} /> — are the numbers that confirm or refute the thesis. The structural compounders are in place. The print line is residual. The dividend is rising. The buyback is active. The newsroom is the largest in the company's history. The bundle is the moat. The AI licensing line has begun to scale. The lawsuit is unresolved but, in either direction, accretive to leverage.</P>

        <PullQuote>The print line is residual. The bundle is the moat. The dividend is rising.</PullQuote>

        <P>It is, in the end, a story about patience. About a company that nearly defaulted in 2009, paid Carlos Slim a fourteen percent coupon to stay solvent, sold The Boston Globe for ninety-three percent less than it had paid for it, and then, with the balance sheet finally clear, made one structural bet (the paywall), then a second (the bundle), then a third (The Athletic), then a fourth (AI licensing) — each compounding into the next, until the company that almost broke had become the company that nobody else in the English-language news business has been able to be.</P>

        <Capstone label="Appendix" title="Timeline, 2008 to 2026" />
        <Timeline />

        <FadeIn>
          <div style={{
            fontFamily: "var(--nyt-display)",
            fontSize: 22,
            lineHeight: 1.45,
            color: C.muted,
            fontStyle: "italic",
            textAlign: "center",
            margin: "40px 0 0",
            padding: "34px 0 10px",
            borderTop: "2px solid " + C.ink
          }}>
            From under five dollars a share to roughly twelve billion in market cap.<br />
            <span style={{ color: C.red, fontWeight: 600, fontStyle: "normal" }}>The bundle is the moat.</span>
          </div>
        </FadeIn>

        <Sources />

      </main>
    </div>
  );
}
