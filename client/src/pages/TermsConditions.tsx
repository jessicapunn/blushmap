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

export default function TermsConditions() {
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
            Terms &amp; Conditions
          </h1>
          <p className="text-sm" style={{ color: "#9b6674" }}>
            Last updated: April 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Preamble */}
        <div
          className="rounded-2xl px-6 py-4 mb-8 text-sm"
          style={{ background: "linear-gradient(135deg, #fff0f4, #fff8f0)", border: "1px solid #f0ccd6", color: "#5a3a42" }}
        >
          Please read these Terms &amp; Conditions carefully before using BlushMap. By accessing or using any part of our service, you agree to be bound by these terms. If you do not agree, you must not use BlushMap.
        </div>

        {/* 1. Service Description */}
        <SectionHeading>1. Service Description</SectionHeading>
        <Para>
          BlushMap ("we", "us", "our") is a UK-based AI skin analysis and beauty recommendation platform operated at blushmap.com. The service enables users to:
        </Para>
        <Ul items={[
          "Upload or capture facial photographs for AI-powered skin analysis",
          "Receive personalised skincare product recommendations based on their skin profile",
          "Scan product barcodes to assess ingredient compatibility",
          "Compare product prices across participating UK retailers",
          "Track their skin analysis history over time (registered users)",
          "Use virtual try-on and colour analysis tools",
        ]} />
        <Para>
          BlushMap is provided for personal, non-commercial use. We reserve the right to modify, suspend or discontinue any aspect of the service at any time with reasonable notice.
        </Para>

        {/* 2. NOT Medical Advice */}
        <SectionHeading>2. Not Medical Advice — Important Disclaimer</SectionHeading>
        <div
          className="rounded-2xl px-6 py-5 mb-4"
          style={{ background: "linear-gradient(135deg, #fff9ee, #fff0f4)", border: "2px solid #e8d5b7" }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: "#1a0a0e", fontFamily: "var(--font-display)" }}>
            BlushMap is a cosmetic and educational tool — not a medical service.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#5a3a42" }}>
            The AI skin analysis provided by BlushMap is intended for <strong>cosmetic and informational purposes only</strong>. It is not a substitute for professional medical or dermatological advice, diagnosis or treatment. BlushMap does not diagnose medical conditions, skin diseases or disorders. Our analysis describes cosmetic characteristics of your skin (such as hydration levels, oiliness, pigmentation patterns and tone) — it is not a clinical assessment.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: "#5a3a42" }}>
            If you have concerns about a skin condition — including persistent acne, rosacea, eczema, psoriasis, suspicious moles, lesions, rashes or any other dermatological issue — you should consult a qualified dermatologist or medical professional. Do not delay seeking medical advice because of information you have read on BlushMap.
          </p>
        </div>
        <Para>
          BlushMap, its operators and its suppliers accept no liability for any harm, injury, loss or damage arising from reliance on content published on this website as medical or professional advice.
        </Para>

        {/* 3. Affiliate Links */}
        <SectionHeading>3. Affiliate Links &amp; Commercial Relationships</SectionHeading>
        <Para>
          BlushMap participates in affiliate marketing programmes, including the Awin affiliate network (Publisher ID: 2854395). Some product links on our platform are affiliate links: if you click such a link and make a purchase, we may receive a small commission from the retailer at no additional cost to you.
        </Para>
        <Para>
          Our affiliate relationships do not influence our AI-driven product recommendations. Product scores are generated by our algorithm based on ingredient compatibility with your skin profile and are not affected by commercial arrangements. Affiliate links are used only to products that our system has recommended independently.
        </Para>
        <Para>
          By using BlushMap, you acknowledge and consent to this affiliate disclosure. For full details of how affiliate tracking works, please see our <Link href="/privacy"><span className="cursor-pointer" style={{ color: "#c9506e" }}>Privacy Policy</span></Link>.
        </Para>

        {/* 4. User Accounts */}
        <SectionHeading>4. User Accounts</SectionHeading>
        <SubHeading>4.1 Registration</SubHeading>
        <Para>
          You may create an account by providing a valid email address and password. You must be at least 13 years of age to create an account. By registering, you confirm that all information you provide is accurate and that you will keep it current.
        </Para>
        <SubHeading>4.2 Account Security</SubHeading>
        <Para>
          You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must notify us immediately at blushmap@gmail.com if you suspect unauthorised use of your account. We will not be liable for any loss resulting from unauthorised use of your account.
        </Para>
        <SubHeading>4.3 Account Termination</SubHeading>
        <Para>
          You may delete your account at any time via your profile settings. We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or misuse the service.
        </Para>

        {/* 5. Acceptable Use */}
        <SectionHeading>5. Acceptable Use</SectionHeading>
        <Para>You agree not to use BlushMap to:</Para>
        <Ul items={[
          "Upload images of any person without their explicit consent",
          "Upload illegal, obscene, defamatory, or harmful content",
          "Attempt to reverse engineer, decompile, or extract our AI models or proprietary algorithms",
          "Use automated tools to scrape, harvest or collect data from BlushMap without prior written consent",
          "Impersonate any person or entity or misrepresent your affiliation",
          "Interfere with or disrupt the integrity or performance of the service or its servers",
          "Use the service for any unlawful purpose or in violation of applicable law",
          "Transmit spam, malware, viruses or any other malicious code",
          "Attempt to gain unauthorised access to any part of the service or its infrastructure",
        ]} />
        <Para>
          We reserve the right to investigate and take appropriate action — including removing content and terminating accounts — for any violation of this acceptable use policy.
        </Para>

        {/* 6. Intellectual Property */}
        <SectionHeading>6. Intellectual Property</SectionHeading>
        <SubHeading>6.1 Our Content</SubHeading>
        <Para>
          All content on BlushMap — including but not limited to the software, algorithms, design, text, graphics, logos, and analysis outputs — is the intellectual property of BlushMap or its licensors and is protected by UK and international copyright, trademark and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, republish or transmit any BlushMap content without our prior written consent.
        </Para>
        <SubHeading>6.2 Your Content</SubHeading>
        <Para>
          By uploading images or other content to BlushMap, you grant us a limited, non-exclusive, royalty-free licence to process and use that content solely for the purpose of delivering the requested service to you. As stated in our Privacy Policy, face images are not stored; this licence terminates immediately upon processing. You retain all intellectual property rights in content you submit.
        </Para>
        <SubHeading>6.3 Feedback</SubHeading>
        <Para>
          If you submit feedback, suggestions or ideas about BlushMap, you grant us an irrevocable, perpetual, royalty-free licence to use such feedback without restriction or compensation to you.
        </Para>

        {/* 7. Third-Party Links */}
        <SectionHeading>7. Third-Party Links &amp; Content</SectionHeading>
        <Para>
          BlushMap contains links to third-party websites and retailers (including LOOKFANTASTIC, Boots, Cult Beauty, Space NK and others). These links are provided for your convenience. We do not control third-party websites and are not responsible for their content, privacy practices or accuracy. Accessing third-party websites is at your own risk.
        </Para>
        <Para>
          Product information, pricing and availability displayed on BlushMap is sourced from retailers and affiliate networks and may not always be up to date. We do not guarantee the accuracy of product descriptions, prices or availability.
        </Para>

        {/* 8. Limitation of Liability */}
        <SectionHeading>8. Limitation of Liability</SectionHeading>
        <SubHeading>8.1 Disclaimer of Warranties</SubHeading>
        <Para>
          BlushMap is provided on an "as is" and "as available" basis, without warranty of any kind, express or implied. To the fullest extent permitted by law, we disclaim all warranties including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, accuracy and non-infringement.
        </Para>
        <SubHeading>8.2 Limitation of Liability</SubHeading>
        <Para>
          To the fullest extent permitted by applicable law, BlushMap and its operators, directors, employees and agents shall not be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits, data, goodwill or other intangible losses, arising out of or in connection with:
        </Para>
        <Ul items={[
          "Your use of or inability to use the service",
          "Any reliance on AI skin analysis results for cosmetic or any other decisions",
          "Unauthorised access to your data or transmissions",
          "Any third-party products, services or content linked from BlushMap",
          "Any interruption, suspension or termination of the service",
        ]} />
        <Para>
          Our total aggregate liability to you for any claims arising from use of BlushMap shall not exceed the greater of (a) the amount you paid us in the 12 months preceding the claim, or (b) £100 GBP.
        </Para>
        <SubHeading>8.3 No Exclusion of Statutory Rights</SubHeading>
        <Para>
          Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded by law under the Consumer Rights Act 2015 or other applicable UK consumer protection legislation.
        </Para>

        {/* 9. Indemnity */}
        <SectionHeading>9. Indemnity</SectionHeading>
        <Para>
          You agree to indemnify, defend and hold harmless BlushMap and its operators from and against any claims, damages, losses, liabilities, costs and expenses (including reasonable legal fees) arising out of your breach of these Terms or your violation of any applicable law or third-party rights.
        </Para>

        {/* 10. Privacy */}
        <SectionHeading>10. Privacy</SectionHeading>
        <Para>
          Your use of BlushMap is also governed by our <Link href="/privacy"><span className="cursor-pointer" style={{ color: "#c9506e" }}>Privacy Policy</span></Link>, which is incorporated into these Terms by reference. By using BlushMap, you consent to the data practices described in our Privacy Policy.
        </Para>

        {/* 11. Changes */}
        <SectionHeading>11. Changes to These Terms</SectionHeading>
        <Para>
          We may update these Terms from time to time. Where changes are material, we will provide at least 14 days' notice by email (to registered users) or by displaying a prominent notice on the website. The "Last updated" date at the top of this page reflects the most recent revision. Your continued use of BlushMap after changes take effect constitutes acceptance of the revised Terms.
        </Para>

        {/* 12. Governing Law */}
        <SectionHeading>12. Governing Law &amp; Jurisdiction</SectionHeading>
        <Para>
          These Terms and any dispute or claim arising out of or in connection with them or their subject matter (including non-contractual disputes or claims) shall be governed by and construed in accordance with the law of <strong>England and Wales</strong>.
        </Para>
        <Para>
          The courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these Terms, subject to your rights as a consumer to bring proceedings in the courts of your country of residence under applicable consumer protection law.
        </Para>

        {/* 13. Severability */}
        <SectionHeading>13. Severability &amp; Entire Agreement</SectionHeading>
        <Para>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect. These Terms, together with our Privacy Policy, constitute the entire agreement between you and BlushMap regarding your use of the service and supersede any prior agreements.
        </Para>

        {/* 14. Contact */}
        <SectionHeading>14. Contact</SectionHeading>
        <Para>
          For questions or concerns about these Terms &amp; Conditions, please contact us:
        </Para>
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{ background: "white", border: "1px solid #f0ccd6", color: "#5a3a42" }}
        >
          <strong style={{ color: "#1a0a0e" }}>BlushMap</strong><br />
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
            <Link href="/privacy">
              <span className="hover:underline cursor-pointer" style={{ color: "#c9506e" }}>Privacy Policy</span>
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
