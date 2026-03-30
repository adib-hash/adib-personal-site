import { motion } from "framer-motion";
import GeometricAccent from "../components/GeometricAccent";

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const previously = [
  {
    company: "Alliance Solutions Group",
    url: "https://alliancesg.com",
    description:
      "Ran a software/services company serving construction & real estate customers, as part of ",
    suffix: "Evergreen.",
    suffixUrl: "https://evergreensg.com",
  },
  {
    company: "Pine Services Group",
    url: "https://pineservicesgroup.com",
    description:
      "Built an M&A-focused holding company, scaled from 2 proof-of-concept acquisitions to 12 operating companies.",
  },
  {
    company: "Aledade",
    url: "https://aledade.com",
    description:
      "Ran corp dev and new business incubation for the #1 technology partner to independent primary care doctors. Responsible for buy/build/partner decisions, including two earliest acquisitions.",
  },
  {
    company: "Investure",
    url: "https://investure.com",
    description:
      "Ran the Investment Analyst program for an investment manager serving nonprofit foundations and colleges. Sourced, diligenced, and invested with some of the world's best money managers.",
  },
];

const onTheSide = [
  {
    role: "Board Member & Advisor,",
    org: "SpendPlan",
    url: "https://spendplan.com",
  },
  {
    role: "Treasurer & Board Member,",
    org: "Center for Open Science",
    url: "https://cos.io",
  },
  {
    role: "Board Member,",
    org: "UVA Miller Center",
    url: "https://millercenter.org",
  },
];

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Home() {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {/* Bold typographic moment */}
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(48px, 6vw, 72px)",
          fontWeight: 500,
          letterSpacing: "-1.5px",
          margin: "0 0 16px",
          lineHeight: 1.05,
        }}
      >
        Adib Choudhury
        <a
          href="https://www.linkedin.com/in/adib-choudhury-26b282b8"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            verticalAlign: "baseline",
            marginLeft: 14,
            color: "var(--text-muted)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <LinkedInIcon />
        </a>
      </h1>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "18px",
          color: "var(--text-muted)",
          maxWidth: 520,
          lineHeight: 1.6,
          marginBottom: 8,
        }}
      >
        A place for sharing my thoughts and side projects while exploring tech,
        business, and spirituality.
      </p>

      <GeometricAccent />

      {/* Previously */}
      <section>
        <h2 style={{ fontSize: "24px", marginBottom: 20, marginTop: 0 }}>
          Previously
        </h2>
        <div className="prev-entries">
          {previously.map((item) => (
            <div key={item.company} className="prev-entry">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="prev-entry-name"
              >
                {item.company}
              </a>
              <span className="prev-entry-bar" />
              <span className="prev-entry-desc">
                {item.description}
                {item.suffix && (
                  <a
                    href={item.suffixUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.suffix}
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* On the Side */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: "24px", marginBottom: 20, marginTop: 0 }}>
          On the Side
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {onTheSide.map((item) => (
            <div key={item.org} style={{ lineHeight: 1.6 }}>
              <span style={{ color: "var(--text-muted)" }}>{item.role} </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 600 }}
              >
                {item.org}
              </a>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
