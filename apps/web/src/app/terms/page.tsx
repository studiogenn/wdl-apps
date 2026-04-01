import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${COMPANY.name}. Read our terms covering service, pricing, liability, and more.`,
};

export default function TermsPage() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container-site max-w-[900px]">
        <div className="prose prose-navy max-w-none">
        <h1>Terms of Service</h1>
        <p><strong>We Deliver Laundry, LLC</strong></p>
        <p><em>Effective Date: March 26, 2026 | Last Updated: March 26, 2026</em></p>

        <h2>1. Agreement to Terms</h2>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally
          binding agreement between you and We Deliver Laundry, LLC
          (&ldquo;WDL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
          &ldquo;us&rdquo;). They govern your access to and use of our website
          (wedeliverlaundry.com), mobile applications, and all related laundry
          pickup, cleaning, and delivery services (collectively, the
          &ldquo;Services&rdquo;).
        </p>
        <p>
          <strong>
            By creating an account, placing an order, or otherwise using our
            Services, you agree to be bound by these Terms and our{" "}
            <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not
            use our Services.
          </strong>
        </p>
        <p>
          We may modify these Terms at any time. Material changes will be
          communicated via email or notice on our website at least 14 days before
          taking effect. Your continued use of the Services after the effective
          date constitutes acceptance. You are responsible for reviewing these
          Terms periodically.
        </p>

        <h2>2. Service Description</h2>
        <p>
          WDL provides weekly subscription and on-demand laundry pickup, washing,
          folding, dry cleaning, pressing, and delivery services in the greater
          New York City metropolitan area. Services are scheduled through our
          website and mobile applications. Cleaning may be performed by WDL or by
          independent third-party contractors working with WDL.
        </p>
        <p>
          While we aim to return standard laundry orders within 24 hours of
          pickup, turnaround times are estimates and not guarantees. Factors
          including order volume, service type, weather, and operational capacity
          may affect timing. We will communicate anticipated delays when
          possible.
        </p>
        <p>
          Service availability, turnaround times, and coverage areas are subject
          to change.
        </p>

        <h2>3. Eligibility and Accounts</h2>
        <p>To use our Services, you must:</p>
        <ul>
          <li>Be at least 18 years of age</li>
          <li>Provide accurate, complete, and current account information</li>
          <li>Maintain valid payment information on file</li>
          <li>Be located within our service area</li>
        </ul>
        <p>
          You may possess only one account per household unless otherwise
          authorized by WDL in writing. You may not authorize third parties to
          use your account or assign or transfer your account to any other person
          or entity.
        </p>
        <p>
          You are responsible for all activity under your account and for
          maintaining the security of your login credentials. Notify us
          immediately at{" "}
          <a href="mailto:start@wedeliverlaundry.com">
            start@wedeliverlaundry.com
          </a>{" "}
          if you suspect unauthorized access. You remain responsible for charges
          incurred through unauthorized use until you notify us and take steps to
          secure your account.
        </p>
        <p>
          We may require proof of identity to access or use the Services and may
          deny access if you refuse. We reserve the right to suspend or terminate
          accounts that violate these Terms, engage in fraudulent activity, or
          remain inactive for an extended period.
        </p>

        <h2>4. Orders, Pickup, and Delivery</h2>
        <p>
          Orders are placed through our website or mobile application. You are
          responsible for ensuring items are properly bagged, accessible at the
          designated pickup location, and available during the selected pickup
          window.
        </p>
        <p>
          <strong>Pickup and delivery at unattended locations:</strong> We will
          accommodate drop-off and pickup wherever you direct. However, WDL is
          not responsible for items that are not personally handed to or received
          from a WDL employee or driver. Items left in unsecured or unattended
          locations are left at your own risk.
        </p>
        <p>
          We reserve the right to refuse service for items that are hazardous,
          contaminated with biohazardous materials, infested with pests,
          excessively soiled beyond normal laundering, or otherwise unsuitable for
          processing. Refused items will be returned unprocessed.
        </p>

        <h2>5. Prohibited Items</h2>
        <p>The following items may not be submitted for service:</p>
        <ul>
          <li>
            Items contaminated with hazardous materials, chemicals, or
            biohazardous substances
          </li>
          <li>Items with active pest infestations (bedbugs, lice, etc.)</li>
          <li>Heavily soiled items requiring specialized industrial cleaning</li>
          <li>
            Fur, leather, suede, or items requiring specialized preservation
            (unless explicitly offered)
          </li>
          <li>
            Rugs, carpets, or oversized items not within our published size
            limits
          </li>
        </ul>
        <p>
          If prohibited items are submitted, we may return them unprocessed or,
          if necessary for health and safety, dispose of them with notice to you.
        </p>

        <h2>6. Pricing, Payment, and Fees</h2>
        <h3>Pricing</h3>
        <ul>
          <li>
            Minimum order amount is disclosed on the WDL price list and may
            change from time to time
          </li>
          <li>
            Weekly subscription customers receive complimentary pickup and
            delivery
          </li>
          <li>
            Pay-As-You-Go customers are charged a transport fee per order as
            listed on our website
          </li>
          <li>
            All prices are in U.S. dollars and are exclusive of applicable taxes
          </li>
        </ul>
        <p>
          We will provide notice before price increases take effect. Price
          changes do not apply to orders already placed. Promotional offers,
          credits, and discounts are subject to their specific terms, may not be
          combined unless explicitly permitted, and may be disabled or modified at
          any time. Promotional codes must be used for their intended audience and
          purpose, may not be duplicated or sold, and are not redeemable for
          cash. We reserve the right to revoke credits obtained through
          fraudulent or unauthorized use of promotions.
        </p>
        <h3>Payment</h3>
        <p>
          Charges are processed to your card on file upon order completion. By
          providing payment information, you authorize WDL to charge applicable
          fees for Services rendered. Charges are final and non-refundable unless
          otherwise determined by WDL or required by applicable law.
        </p>
        <h3>Disputes</h3>
        <p>
          If you are dissatisfied with service quality, contact us within 48
          hours of delivery at{" "}
          <a href="mailto:start@wedeliverlaundry.com">
            start@wedeliverlaundry.com
          </a>
          . We will, at our discretion, re-clean the affected items at no charge
          or issue account credit. Payment disputes should be directed to{" "}
          <a href="mailto:start@wedeliverlaundry.com">
            start@wedeliverlaundry.com
          </a>{" "}
          before initiating a chargeback. Bad-faith chargebacks may result in
          account suspension.
        </p>

        <h2>7. Subscriptions and Cancellation</h2>
        <p>
          Weekly subscription plans may be cancelled at any time with no
          cancellation fee. Cancellation takes effect at the end of your current
          billing cycle. Orders placed before cancellation will be fulfilled and
          charged at the applicable rate.
        </p>
        <p>
          To cancel, contact us at{" "}
          <a href="mailto:start@wedeliverlaundry.com">
            start@wedeliverlaundry.com
          </a>{" "}
          or through your account settings.
        </p>

        <h2>8. Care of Your Items</h2>
        <p>
          <strong>Our responsibility:</strong> We follow the standards set forth
          by the Fabricare Industry and the International Fabricare Institute. We
          exercise reasonable professional care in handling, cleaning, and
          delivering your items, using processes best suited to the nature and
          condition of each garment. We follow manufacturer care label
          instructions where provided.
        </p>
        <p><strong>Your responsibility:</strong></p>
        <ul>
          <li>
            Remove all personal belongings and valuables from pockets and bags
            before pickup (including cash, keys, electronics, documents, jewelry)
          </li>
          <li>
            Identify items requiring special care, or that are delicate,
            irreplaceable, or of high sentimental value
          </li>
          <li>
            Provide accurate care instructions for items without manufacturer
            labels
          </li>
          <li>Inspect delivered items promptly upon receipt</li>
        </ul>
        <p><strong>WDL is not responsible for:</strong></p>
        <ul>
          <li>Items left in pockets or bundles of garments</li>
          <li>
            Damage from items left in pockets (lipstick, gum, pens, etc.)
          </li>
          <li>
            Inherent weaknesses or defects in materials that result in tears or
            holes not apparent prior to processing
          </li>
          <li>
            Color loss, color bleeding, or shrinkage consistent with the
            garment&apos;s fiber content
          </li>
          <li>Damage to weak and tender fabrics</li>
          <li>Damage to items with missing or inaccurate care labels</li>
        </ul>

        <h2>9. Damaged Items</h2>
        <p>
          Despite exercising professional care, damage can occasionally occur. If
          an item is damaged as a result of our negligence, liability is limited
          as follows:
        </p>
        <ul>
          <li>
            <strong>Per item:</strong> The lesser of (a) ten (10) times our
            cleaning charge for that item, or (b) $25.00
          </li>
          <li>
            <strong>Per order:</strong> Maximum aggregate liability of $100.00,
            regardless of order cost
          </li>
          <li>
            <strong>High-value items:</strong> Items of extraordinary value
            (designer, couture, heirloom, or items valued over $50) must be
            declared at the time of order. Failure to declare high-value items
            releases WDL from liability beyond the standard limits.
          </li>
        </ul>
        <p>
          Claims must be submitted in writing to{" "}
          <a href="mailto:start@wedeliverlaundry.com">
            start@wedeliverlaundry.com
          </a>{" "}
          within 48 hours of delivery, including a description of the damage and
          photographs if available. We will investigate in good faith and respond
          within 5 business days.
        </p>

        <h2>10. Lost Items</h2>
        <p>
          Report any missing items within 48 hours of delivery to{" "}
          <a href="mailto:start@wedeliverlaundry.com">
            start@wedeliverlaundry.com
          </a>
          . We will conduct a thorough search of our facility. If the item cannot
          be located within 14 days, compensation will be provided subject to the
          liability limits in Section 9.
        </p>
        <p>
          Items reported missing more than 48 hours after delivery may not be
          eligible for compensation, as the ability to investigate diminishes
          significantly after that window.
        </p>

        <h2>11. SMS/Text Messaging</h2>
        <p>
          By creating an account and opting in, you consent to receive SMS
          messages from WDL.
        </p>
        <p>
          <strong>Types of messages:</strong> Service notifications (order
          updates, pickup/delivery confirmations, appointment reminders) and,
          with separate opt-in, occasional promotional messages.
        </p>
        <p>
          <strong>Message frequency:</strong> Varies based on your service usage.
          Promotional messages will not exceed 4 per month.
        </p>
        <p>
          <strong>Costs:</strong> Message and data rates may apply. Check with
          your carrier. Carriers are not responsible for delayed or undelivered
          messages.
        </p>
        <p>
          <strong>Opt-out:</strong> Reply STOP to any message to cancel. You will
          receive a single confirmation.
        </p>
        <p>
          <strong>Help:</strong> Reply HELP for assistance, or contact{" "}
          <a href="mailto:start@wedeliverlaundry.com">
            start@wedeliverlaundry.com
          </a>{" "}
          or <a href={`tel:${COMPANY.phone}`}>{COMPANY.phone}</a>.
        </p>
        <p>
          <strong>Eligibility:</strong> You must be 18 years of age or older to
          participate in the SMS program.
        </p>
        <p>
          <strong>
            No mobile information (including phone numbers and opt-in data) will
            be shared with third parties or affiliates for marketing or
            promotional purposes.
          </strong>
        </p>
        <p>
          Personal information collected via SMS is governed by our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <p>
          Opting out of SMS may affect your ability to receive certain service
          notifications.
        </p>

        <h2>12. User Content</h2>
        <p>
          If you submit content through the Services (reviews, ratings,
          instructions, or other materials), you represent that you own or have
          the right to provide it. You grant WDL an irrevocable, transferable,
          royalty-free, perpetual, non-exclusive, worldwide, sublicensable
          license to use, copy, display, modify, distribute, and create
          derivative works from your content in connection with the Services and
          our business operations.
        </p>
        <p>
          You agree to indemnify WDL against claims arising from your submitted
          content. We reserve the right to remove any content at our discretion.
        </p>

        <h2>13. Intellectual Property</h2>
        <p>
          All content on our website and applications — including text, graphics,
          logos, images, and software — is the property of WDL or our licensors
          and is protected by copyright, trademark, and other intellectual
          property laws.
        </p>
        <p>
          Subject to your compliance with these Terms, WDL grants you a limited,
          non-exclusive, non-transferable, revocable license to access and use
          the Services and related materials solely for your personal,
          noncommercial use. You may not reproduce, distribute, modify, or create
          derivative works from our content without prior written consent. All
          rights not expressly granted are reserved.
        </p>

        <h2>14. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Services for any unlawful purpose</li>
          <li>Interfere with or disrupt the operation of the Services</li>
          <li>
            Attempt to gain unauthorized access to our systems or other
            users&apos; accounts
          </li>
          <li>
            Submit false claims, chargebacks, or payment disputes in bad faith
          </li>
          <li>
            Harass, threaten, or abuse WDL staff, drivers, or other personnel
          </li>
          <li>
            Engage in any acts inconsistent with copyright protection
          </li>
          <li>
            Create multiple accounts or submit purposely inaccurate information
          </li>
        </ul>
        <p>
          Violation may result in immediate account suspension or termination
          without refund. WDL reserves the right to seek all remedies available
          at law and in equity.
        </p>

        <h2>15. Disclaimer of Warranties</h2>
        <p>
          <strong>
            THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
            AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </strong>
        </p>
        <p>
          We do not warrant that the Services will be uninterrupted, error-free,
          or completely secure, or that defects will be corrected. We make no
          guarantees regarding cleaning results beyond exercising reasonable
          professional care. It is your responsibility to inspect items upon
          receipt.
        </p>
        <p>
          Applicable law may not allow the exclusion of implied warranties, so
          the above exclusion may not apply to you.
        </p>

        <h2>16. Limitation of Liability</h2>
        <p>
          <strong>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WDL&apos;S TOTAL LIABILITY
            FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE
            SERVICES SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU PAID TO
            WDL IN THE THREE (3) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED
            DOLLARS ($100.00).
          </strong>
        </p>
        <p>
          <strong>
            IN NO EVENT SHALL WDL, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS,
            OR REPRESENTATIVES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS
            OF PROFITS, DATA, USE, OR GOODWILL, REGARDLESS OF THE CAUSE OF
            ACTION OR THEORY OF LIABILITY, EVEN IF ADVISED OF THE POSSIBILITY OF
            SUCH DAMAGES.
          </strong>
        </p>
        <p>
          These limitations do not purport to limit liability that cannot be
          excluded under applicable law.
        </p>

        <h2>17. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless WDL, its officers,
          directors, employees, and agents from and against any claims,
          liabilities, damages, losses, costs, and expenses (including reasonable
          attorneys&apos; fees) arising out of or related to: (a) your use of the
          Services; (b) your violation of these Terms; (c) WDL&apos;s use of
          your User Content; or (d) your violation of the rights of any third
          party.
        </p>

        <h2>18. Third-Party Links</h2>
        <p>
          Our Services may contain links to third-party websites and services. We
          do not operate, endorse, or assume responsibility for those sites. Use
          of third-party links is at your own risk.
        </p>

        <h2>19. Dispute Resolution</h2>
        <p>
          <strong>Informal resolution:</strong> Before filing any formal claim,
          you agree to contact us at{" "}
          <a href="mailto:start@wedeliverlaundry.com">
            start@wedeliverlaundry.com
          </a>{" "}
          and attempt to resolve the dispute informally for at least 30 days.
        </p>
        <p>
          <strong>Governing law and jurisdiction:</strong> These Terms are
          governed by the laws of the State of New York, without regard to
          conflict of laws provisions. Any legal action shall be brought
          exclusively in the state or federal courts located in New York County,
          New York, and you consent to the personal jurisdiction of such courts,
          waiving any objections to venue or inconvenient forum.
        </p>
        <p>
          <strong>Class action waiver:</strong> You agree that any dispute
          resolution proceedings will be conducted only on an individual basis and
          not in a class, consolidated, or representative action.
        </p>

        <h2>20. Notices</h2>
        <p>
          WDL may provide notice via the Services, email to your account address,
          or written communication to your account address. Email notice is
          deemed given 12 hours after sending; postal notice 48 hours after
          mailing.
        </p>
        <p>You may provide notice to WDL by first class mail to:</p>
        <p>
          <strong>We Deliver Laundry, LLC</strong><br />
          69 Franklin Street<br />
          Belleville, NJ 07109
        </p>

        <h2>21. General Provisions</h2>
        <ul>
          <li>
            You may not assign these Terms without WDL&apos;s prior written
            approval
          </li>
          <li>
            WDL may assign this agreement to a subsidiary, affiliate, acquirer,
            or successor by merger
          </li>
          <li>
            No joint venture, partnership, employment, or agency relationship
            exists between you and WDL
          </li>
          <li>
            If any provision is held invalid, the remaining provisions remain in
            full force
          </li>
          <li>
            WDL&apos;s failure to enforce any provision does not constitute a
            waiver
          </li>
          <li>
            This agreement, together with the{" "}
            <Link href="/privacy">Privacy Policy</Link>, constitutes the entire
            agreement between you and WDL
          </li>
        </ul>

        <h2>22. Contact Us</h2>
        <p>
          Questions about these Terms? Contact us at:
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
