import { NavBar } from "@/components/NavBar";
import { Link } from "wouter";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.35rem",
        color: "#c9506e",
        marginBottom: "0.75rem",
        marginTop: "2.5rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid #f0ccd6",
      }}
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1rem",
        color: "#1a0a0e",
        marginBottom: "0.5rem",
        marginTop: "1.25rem",
      }}
    >
      {children}
    </h3>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed mb-3" style={{ color: "#5a3a42" }}>
      {children}
    </p>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 mb-3 pl-4">
      {items.map((item) => (
        <li key={item} className="text-sm leading-relaxed" style={{ color: "#5a3a42", listStyleType: "disc" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <NavBar />

      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(160deg, #fff0f4 0%, #fff9f5 100%)",
          borderBottom: "1px solid #f0ccd6",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#c9506e", letterSpacing: "0.18em" }}
          >
            Legal
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: "#1a0a0e",
              lineHeight: 1.05,
              marginBottom: "1rem",
            }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: "#9b6674" }}>
            Last updated: April 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div
          className="rounded-2xl px-6 py-4 mb-8 text-sm"
          style={{ background: "linear-gradient(135deg, #fff0f4, #fff8f0)", border: "1px solid #f0ccd6", color: "#5a3a42" }}
        >
          <strong style={{ color: "#c9506e" }}>Summary:</strong> BlushMap takes your privacy seriously. We process face images only in memory to deliver your analysis — they are never stored on our servers. We collect minimal account data and use cookies for analytics and affiliate tracking, which you can manage via our cookie banner.
        </div>

        {/* 1. Data Controller */}
        <SectionHeading>1. Data Controller</SectionHeading>
        <Para>
          The data controller responsible for your personal data is:
        </Para>
        <div
          className="rounded-xl px-5 py-4 mb-4 text-sm"
          style={{ background: "white", border: "1px solid #f0ccd6", color: "#5a3a42" }}
        >
          <strong style={{ color: "#1a0a0e" }}>BlushMap</strong><br />
          Website: blushmap.com<br />
          Email: <a href="mailto:blushmap@gmail.com" style={{ color: "#c9506e" }}>blushmap@gmail.com</a>
        </div>
        <Para>
          For all data protection enquiries, including subject access requests and deletion requests, please contact us at the email address above.
        </Para>

        {/* 2. Data Collected */}
        <SectionHeading>2. What Data We Collect</SectionHeading>

        <SubHeading>2.1 Face Images</SubHeading>
        <Para>
          When you use the Face Mapping or Colour Analysis features, you may upload a photograph or use your device camera. <strong>Face images are processed entirely in memory and are NOT stored on our servers.</strong> The image is transmitted securely to our AI processing service (Anthropic) solely for the purpose of generating your skin analysis, and is discarded immediately after the analysis is complete. We never retain, sell or share your facial imagery.
        </Para>

        <SubHeading>2.2 Account Data</SubHeading>
        <Para>If you create an account, we collect:</Para>
        <Ul items={[
          "Email address (used for authentication and, if opted in, personalised recommendations)",
          "Password (stored as a cryptographic hash — we never store your plaintext password)",
          "Display name (optional)",
        ]} />

        <SubHeading>2.3 Scan History & Analysis Results</SubHeading>
        <Para>
          If you are logged in, we store the results of your skin analyses (skin type, concerns, recommended products) so you can review your history over time. The underlying face images that generated these results are not stored — only the derived analysis output.
        </Para>

        <SubHeading>2.4 Session & Technical Data</SubHeading>
        <Para>We automatically collect certain technical data when you visit BlushMap:</Para>
        <Ul items={[
          "IP address and approximate location (country/city level)",
          "Browser type, version and device type",
          "Pages visited, time on page and navigation path",
          "Referring URL",
          "Session identifiers",
        ]} />
        <Para>This data is used to operate and improve the service and is not linked to your identity unless you are logged in.</Para>

        {/* 3. Cookies */}
        <SectionHeading>3. Cookies & Tracking Technologies</SectionHeading>
        <Para>
          BlushMap uses cookies and similar technologies. Our cookie management is powered by Cookiebot (ID: 7e7d85ae-5b6f-4c3e-b571-50ce299f3503), which presents a consent banner on your first visit and allows you to control which categories of cookies are set.
        </Para>

        <SubHeading>3.1 Strictly Necessary Cookies</SubHeading>
        <Para>These are required for the website to function. They cannot be disabled. They include session cookies that keep you logged in and security tokens.</Para>

        <SubHeading>3.2 Analytics Cookies (Google Analytics 4)</SubHeading>
        <Para>
          We use Google Analytics 4 (Measurement ID: G-75MW4WEXFD) to understand how visitors interact with BlushMap — which pages are popular, how users navigate the site, and how many users visit over time. This data is aggregated and anonymised. GA4 analytics cookies are only set with your consent.
        </Para>

        <SubHeading>3.3 Affiliate Tracking Cookies (Awin)</SubHeading>
        <Para>
          BlushMap participates in the Awin affiliate network (Publisher ID: 2854395). When you click a product link on BlushMap that leads to a retailer (such as LOOKFANTASTIC, Boots, Cult Beauty or Space NK), Awin places a tracking cookie in your browser. This cookie records that the click originated from BlushMap, enabling us to receive a small commission if you subsequently make a purchase — at no extra cost to you. Awin's cookies are only set when you click an affiliate link, subject to your cookie preferences.
        </Para>
        <Para>
          For more information, see <a href="https://www.awin.com/gb/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#c9506e" }}>Awin's Privacy Policy</a>.
        </Para>

        <SubHeading>3.4 Managing Cookies</SubHeading>
        <Para>
          You can review and change your cookie preferences at any time by clicking the cookie settings link in our footer, or through your browser settings. Withdrawing consent for non-essential cookies will not affect the core functionality of BlushMap.
        </Para>

        {/* 4. Legal Basis */}
        <SectionHeading>4. Legal Basis for Processing</SectionHeading>
        <Para>We process your personal data on the following legal bases under UK GDPR and EU GDPR:</Para>
        <Ul items={[
          "Consent — for analytics cookies (GA4), affiliate tracking cookies (Awin), and marketing communications. You may withdraw consent at any time.",
          "Legitimate Interest — for fraud prevention, service security, and aggregated product analytics. We have assessed that these interests do not override your fundamental rights.",
          "Contract Performance — for processing data necessary to deliver the services you have requested (account creation, saving scan history).",
          "Legal Obligation — where we are required to retain or process data by applicable law.",
        ]} />

        {/* 5. Third Parties */}
        <SectionHeading>5. Third-Party Services</SectionHeading>
        <Para>We share limited data with the following trusted third parties, strictly for the purposes described:</Para>

        <div className="space-y-4 mb-4">
          {[
            {
              name: "Anthropic (Claude AI)",
              desc: "Processes face images to generate skin analysis. Images are transmitted over TLS, processed in-memory, and not retained. Anthropic's privacy policy governs their data handling.",
              link: "https://www.anthropic.com/privacy",
            },
            {
              name: "Railway (Hosting)",
              desc: "Our backend infrastructure is hosted on Railway. Server logs, which may include IP addresses and request metadata, are retained for up to 30 days for security and debugging purposes.",
              link: "https://railway.app/legal/privacy",
            },
            {
              name: "Awin (Affiliate Network)",
              desc: "Awin places tracking cookies when you click product links. They process click and transaction data to calculate affiliate commissions.",
              link: "https://www.awin.com/gb/legal/privacy-policy",
            },
            {
              name: "Google Analytics",
              desc: "GA4 collects anonymised usage data to help us understand how the service is used. Google may process data on servers outside the UK/EEA.",
              link: "https://policies.google.com/privacy",
            },
          ].map((tp) => (
            <div
              key={tp.name}
              className="rounded-xl px-5 py-4 text-sm"
              style={{ background: "white", border: "1px solid #f0ccd6" }}
            >
              <strong style={{ color: "#1a0a0e" }}>{tp.name}</strong>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "#5a3a42" }}>{tp.desc}</p>
              <a href={tp.link} target="_blank" rel="noopener noreferrer" className="text-xs mt-1.5 inline-block" style={{ color: "#c9506e" }}>
                View Privacy Policy →
              </a>
            </div>
          ))}
        </div>

        <Para>We do not sell your personal data to third parties under any circumstances.</Para>

        {/* 6. Data Retention */}
        <SectionHeading>6. Data Retention</SectionHeading>
        <Ul items={[
          "Face images: Not stored. Processed in-memory and discarded immediately after analysis.",
          "Account data (email, password hash, name): Retained until you delete your account.",
          "Scan history and analysis results: Retained for 2 years from the date of each scan, or until account deletion, whichever is sooner.",
          "Server logs: Retained for 30 days, then automatically deleted.",
          "Analytics data: Aggregated and anonymised; retained per Google's standard retention settings (up to 26 months in GA4).",
        ]} />

        {/* 7. Your Rights */}
        <SectionHeading>7. Your Rights</SectionHeading>
        <Para>Under UK GDPR and, where applicable, CCPA, you have the following rights:</Para>
        <Ul items={[
          "Right of Access — request a copy of the personal data we hold about you.",
          "Right to Rectification — request correction of inaccurate or incomplete data.",
          "Right to Erasure ('Right to be Forgotten') — request deletion of your personal data, subject to legal retention obligations.",
          "Right to Data Portability — receive your data in a structured, machine-readable format.",
          "Right to Object — object to processing based on legitimate interests.",
          "Right to Restrict Processing — request that we limit processing of your data in certain circumstances.",
          "Right to Withdraw Consent — withdraw consent for cookie-based processing at any time via our cookie banner.",
          "CCPA Rights (California residents) — right to know, delete, and opt out of the sale of personal information. We do not sell personal information.",
        ]} />
        <Para>
          To exercise any of these rights, contact us at <a href="mailto:blushmap@gmail.com" style={{ color: "#c9506e" }}>blushmap@gmail.com</a>. We will respond within 30 days (or within the statutory period required by applicable law). You also have the right to lodge a complaint with the <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" style={{ color: "#c9506e" }}>Information Commissioner's Office (ICO)</a> if you believe we have not complied with applicable data protection law.
        </Para>

        {/* 8. International Transfers */}
        <SectionHeading>8. International Data Transfers</SectionHeading>
        <Para>
          Some of our third-party providers (including Google and Anthropic) may process data outside the United Kingdom or European Economic Area. Where this occurs, we rely on appropriate safeguards such as Standard Contractual Clauses or the UK's International Data Transfer Agreements (IDTAs) to ensure your data receives an equivalent level of protection.
        </Para>

        {/* 9. Security */}
        <SectionHeading>9. Data Security</SectionHeading>
        <Para>
          We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure or destruction. All data transmitted to and from BlushMap is encrypted using TLS. Passwords are stored using cryptographic hashing. We conduct regular security reviews of our infrastructure.
        </Para>

        {/* 10. Children */}
        <SectionHeading>10. Children's Privacy</SectionHeading>
        <Para>
          BlushMap is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you believe a child under 13 has provided us with personal data, please contact us immediately so we can delete it.
        </Para>

        {/* 11. Changes */}
        <SectionHeading>11. Changes to This Policy</SectionHeading>
        <Para>
          We may update this Privacy Policy from time to time. Where changes are material, we will notify registered users by email or by displaying a prominent notice on the website. The "Last updated" date at the top of this page reflects when the policy was last revised. Continued use of BlushMap after changes constitutes acceptance of the updated policy.
        </Para>

        {/* 12. Contact */}
        <SectionHeading>12. Contact Us</SectionHeading>
        <Para>
          For any questions, concerns or requests relating to this Privacy Policy or your personal data, please contact:
        </Para>
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{ background: "white", border: "1px solid #f0ccd6", color: "#5a3a42" }}
        >
          <strong style={{ color: "#1a0a0e" }}>BlushMap — Data Controller</strong><br />
          Email: <a href="mailto:blushmap@gmail.com" style={{ color: "#c9506e" }}>blushmap@gmail.com</a><br />
          Website: <a href="https://blushmap.com" style={{ color: "#c9506e" }}>blushmap.com</a>
        </div>

        {/* Footer links */}
        <footer style={{ borderTop: "1px solid #f0ccd6", paddingTop: "2rem", marginTop: "3rem" }}>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/about">
              <span className="hover:underline cursor-pointer" style={{ color: "#c9506e" }}>About BlushMap</span>
            </Link>
            <span style={{ color: "#f0ccd6" }}>·</span>
            <Link href="/terms">
              <span className="hover:underline cursor-pointer" style={{ color: "#c9506e" }}>Terms &amp; Conditions</span>
            </Link>
            <span style={{ color: "#f0ccd6" }}>·</span>
            <Link href="/">
              <span className="hover:underline cursor-pointer" style={{ color: "#c9506e" }}>Home</span>
            </Link>
          </div>
          <p className="text-center text-[11px] mt-4" style={{ color: "#c9b0b8" }}>
            © {new Date().getFullYear()} BlushMap · blushmap.com · blushmap@gmail.com
          </p>
        </footer>
      </div>
    </div>
  );
}
