import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${COMPANY.name}. Learn how we collect, use, and protect your personal information.`,
};

export default function PrivacyPage() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-site max-w-[900px]">
        <div className="prose prose-navy max-w-none">
        <h1>Privacy Policy</h1>
        <p><strong>We Deliver Laundry, LLC</strong></p>
        <p><em>Effective Date: March 26, 2026 | Last Updated: March 26, 2026</em></p>

        <p>
          We Deliver Laundry, LLC (&ldquo;WDL,&rdquo; &ldquo;we,&rdquo;
          &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting
          your privacy. This Privacy Policy explains what information we collect,
          how we use and protect it, and the choices available to you.
        </p>
        <p>
          This policy applies to our website (wedeliverlaundry.com), mobile
          applications, SMS/text messaging programs, and all related services
          (collectively, the &ldquo;Services&rdquo;). By using our Services, you
          acknowledge and agree to the practices described in this policy.
        </p>
        <p>
          We may update this policy from time to time. When we make material
          changes, we will notify you by updating the &ldquo;Last Updated&rdquo;
          date above and, where required by law, by providing additional notice
          (such as email notification). Your continued use of the Services after
          any changes constitutes your acceptance of the updated policy.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>Information You Provide</h3>
        <p>
          When you create an account, place an order, or contact us, you may
          provide:
        </p>
        <ul>
          <li>Name, email address, phone number, and physical address</li>
          <li>Payment information (credit/debit card details, processed by our third-party payment processor)</li>
          <li>Service preferences and special instructions</li>
          <li>Communications you send to us (emails, chat messages, phone calls)</li>
        </ul>

        <h3>Information Collected Automatically</h3>
        <p>When you use our Services, we automatically collect:</p>
        <ul>
          <li>Device and browser information (IP address, browser type, operating system)</li>
          <li>Usage data (pages visited, features used, access times, referring URLs)</li>
          <li>Location data (general location derived from IP address)</li>
          <li>Cookie and similar tracking technology data (see Section 6 below)</li>
        </ul>

        <h3>Information from Third Parties</h3>
        <p>
          We may receive information from third-party services you connect to
          your account, analytics providers, and publicly available sources, to
          the extent permitted by applicable law.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and improve our Services</li>
          <li>Process transactions and send order-related communications (pickup confirmations, delivery updates, receipts)</li>
          <li>Communicate with you about your account, respond to inquiries, and provide customer support</li>
          <li>Send administrative notices (service changes, policy updates, security alerts)</li>
          <li>Send promotional communications, where you have opted in (you may opt out at any time)</li>
          <li>Notify you when our service area expands to your location, if you have provided your email for that purpose</li>
          <li>Analyze usage trends and improve the user experience</li>
          <li>Detect, prevent, and address fraud, abuse, and security issues</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>
          We process your information in the United States. By providing your
          information, you consent to this processing.
        </p>

        <h2>3. How We Share Your Information</h2>
        <p><strong>We do not sell your personal information.</strong></p>
        <p>We may share your information with:</p>
        <ul>
          <li>Service providers who perform services on our behalf (payment processing, hosting, customer support, analytics, SMS delivery)</li>
          <li>Professional advisors (attorneys, accountants, auditors) as needed</li>
          <li>Law enforcement or government agencies when required by law, legal process, or to protect the rights, property, or safety of WDL, our customers, or others</li>
          <li>A successor entity in connection with a merger, acquisition, bankruptcy, or sale of all or substantially all of our assets</li>
        </ul>

        <h2>4. SMS/Text Messaging</h2>
        <p>
          By providing your phone number and opting in during account creation,
          online scheduling, or by texting START to our number, you consent to
          receive SMS/text messages from WDL.
        </p>
        <p>
          <strong>Types of messages:</strong> Pickup and delivery confirmations,
          order status updates, appointment reminders, service notifications, and
          (with separate opt-in) promotional offers.
        </p>
        <p>
          <strong>Message frequency:</strong> Varies based on your service usage.
          Transactional messages are sent as needed to fulfill your orders.
          Promotional messages will not exceed 4 per month.
        </p>
        <p>
          <strong>Costs:</strong> Message and data rates may apply. Check with
          your mobile carrier.
        </p>
        <p>
          <strong>Opt-out:</strong> Reply STOP to any message to cancel. You will
          receive a single confirmation message.
        </p>
        <p>
          <strong>Help:</strong> Reply HELP for assistance, or contact us at{" "}
          <a href="mailto:start@wedeliverlaundry.com">start@wedeliverlaundry.com</a>{" "}
          or <a href={`tel:${COMPANY.phone}`}>{COMPANY.phone}</a>.
        </p>
        <p>
          No mobile information (including phone numbers and opt-in data) will be
          shared with third parties or affiliates for marketing or promotional
          purposes.
        </p>

        <h2>5. Data Retention</h2>
        <p>
          We retain your personal information for as long as your account is
          active or as needed to provide you Services, comply with our legal
          obligations, resolve disputes, and enforce our agreements. When personal
          information is no longer needed for these purposes, we will delete or
          anonymize it in accordance with applicable law.
        </p>

        <h2>6. Cookies and Tracking Technologies</h2>
        <p>We use cookies, pixels, and similar technologies to:</p>
        <ul>
          <li>Recognize you and maintain your session</li>
          <li>Remember your preferences</li>
          <li>Analyze site traffic and usage patterns</li>
          <li>Measure the effectiveness of our marketing campaigns</li>
          <li>Conduct A/B tests to improve our Services, which involves showing different versions of pages to different visitors and measuring which performs better</li>
        </ul>
        <p>
          Specific cookies we set include: <strong>ab_visitor_id</strong> (a
          unique identifier for analytics and A/B testing, stored for up to 1
          year) and <strong>ab_variant</strong> (your assigned site variant,
          stored for up to 30 days).
        </p>
        <p>
          You can control cookies through your browser settings. Disabling
          cookies may limit some functionality of the Services. We use
          third-party analytics services, including PostHog and Google Analytics,
          that collect and analyze usage data on our behalf. These services may
          set their own cookies and collect information about your use of our
          Services in accordance with their own privacy policies.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We implement industry-standard administrative, technical, and physical
          safeguards to protect your personal information, including encryption in
          transit (TLS/SSL) and secure storage. However, no method of
          transmission over the internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </p>

        <h2>8. Children&apos;s Privacy</h2>
        <p>
          Our Services are not directed to individuals under 18 years of age. We
          do not knowingly collect personal information from children. If you
          believe we have collected information from a child, please contact us
          immediately and we will take steps to delete it.
        </p>

        <h2>9. Your Rights and Choices</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt out of promotional communications</li>
          <li>Opt out of the sale or sharing of personal information (we do not sell your data, but you may still make this request)</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:start@wedeliverlaundry.com">start@wedeliverlaundry.com</a>.
          We will respond within the timeframes required by applicable law. We
          will not discriminate against you for exercising your privacy rights.
        </p>

        <h2>10. State-Specific Privacy Rights</h2>
        <p>
          <strong>California Residents:</strong> Under the California Consumer
          Privacy Act (CCPA/CPRA), you have the right to know what personal
          information we collect, request its deletion, and opt out of its sale.
          We do not sell personal information. To submit a verifiable consumer
          request, contact us using the information below.
        </p>
        <p>
          <strong>Other States:</strong> Residents of Connecticut, Virginia,
          Colorado, and other states with comprehensive privacy laws may have
          additional rights under their respective laws. Contact us to exercise
          any applicable rights.
        </p>

        <h2>11. Email Communications</h2>
        <p>
          We may send you service-related emails (order confirmations, account
          updates, policy changes) that are necessary for the operation of your
          account. You may also receive promotional emails if you have opted in.
          You can unsubscribe from promotional emails at any time by clicking the
          &ldquo;unsubscribe&rdquo; link in any email. Service-related emails
          will continue regardless of your promotional email preferences.
        </p>

        <h2>12. Third-Party Links</h2>
        <p>
          Our Services may contain links to third-party websites. We are not
          responsible for the privacy practices of those websites. We encourage
          you to review their privacy policies before providing any personal
          information.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, want to exercise your
          privacy rights, or have a complaint, contact us at:
        </p>
        <p>
          <strong>We Deliver Laundry, LLC</strong><br />
          Email: <a href="mailto:start@wedeliverlaundry.com">start@wedeliverlaundry.com</a><br />
          Phone: <a href={`tel:${COMPANY.phone}`}>{COMPANY.phone}</a><br />
          Website: <a href="https://wedeliverlaundry.com">wedeliverlaundry.com</a>
        </p>
        </div>
      </div>
    </section>
  );
}
