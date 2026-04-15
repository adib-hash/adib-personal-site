import { motion } from "framer-motion";
import GeometricAccent from "../components/GeometricAccent";

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

const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.25, 1, 0.5, 1] },
};

export default function Home() {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {/* Hero */}
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(48px, 6vw, 72px)",
          fontWeight: 400,
          letterSpacing: "-0.5px",
          margin: "0 0 12px",
          lineHeight: 1.05,
        }}
      >
        Adib Choudhury
      </h1>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "18px",
          color: "var(--text-muted)",
          maxWidth: "56ch",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        A place for sharing my thoughts and side projects while exploring tech,
        business, and spirituality.
      </p>

      <GeometricAccent />

      {/* Previously */}
      <motion.section {...sectionReveal}>
        <h2 style={{ fontSize: "28px", fontWeight: 400, marginBottom: 24, marginTop: 0 }}>
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
      </motion.section>

      {/* On the Side */}
      <motion.section
        {...sectionReveal}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
        style={{ marginTop: 56 }}
      >
        <h2 style={{ fontSize: "28px", fontWeight: 400, marginBottom: 24, marginTop: 0 }}>
          On the Side
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {onTheSide.map((item) => (
            <div
              key={item.org}
              style={{ display: "flex", alignItems: "baseline", gap: 10, lineHeight: 1.7 }}
            >
              {/* Diamond marker — echoes the CardCornerAccent motif */}
              <span
                aria-hidden="true"
                style={{
                  color: "var(--accent)",
                  fontSize: 8,
                  flexShrink: 0,
                  position: "relative",
                  top: "-1px",
                  opacity: 0.7,
                }}
              >
                ◆
              </span>
              <div>
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
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
