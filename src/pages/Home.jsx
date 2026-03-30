import { motion } from "framer-motion";
import GeometricAccent from "../components/GeometricAccent";

const previously = [
  {
    company: "Alliance Solutions Group",
    url: "https://alliance-sg.com",
    description:
      "Ran a software/services company serving construction & real estate customers, as part of ",
    suffix: "Evergreen",
    suffixUrl: "https://evergreensg.com",
  },
  {
    company: "Pine Services Group",
    url: "https://pineservicesgroup.com",
    description:
      "Built an M&A-focused holding company, scaled from 2 proof-of-concept acquisitions to 12 operating companies",
  },
  {
    company: "Aledade",
    url: "https://aledade.com",
    description:
      "First corp dev hire at the #1 partner to independent primary care doctors. Responsible for buy/build/partner decisions including two earliest acquisitions",
  },
  {
    company: "Investure",
    url: "https://investure.com",
    description:
      "Ran the Investment Analyst program for an investment manager serving nonprofit foundations and colleges. Sourced, diligenced, and invested with some of the world's best money managers",
  },
];

const onTheSide = [
  {
    role: "Startup advisor to",
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
        A place for me to share thoughts and projects in the realms of
        technology, business, and spirituality.
      </p>

      <GeometricAccent />

      {/* Previously */}
      <section>
        <h2 style={{ fontSize: "24px", marginBottom: 20, marginTop: 0 }}>
          Previously
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {previously.map((item) => (
            <div key={item.company} style={{ lineHeight: 1.6 }}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 600 }}
              >
                {item.company}
              </a>
              <span style={{ color: "var(--text-muted)", marginLeft: 8 }}>
                {item.description}
                {item.suffix && (
                  <>
                    <a
                      href={item.suffixUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.suffix}
                    </a>
                  </>
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
