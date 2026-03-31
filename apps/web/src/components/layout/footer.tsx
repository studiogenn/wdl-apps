import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/shared/button-link";

const SERVICING_AREAS = [
  { label: "New York", href: "/areas/new-york" },
  { label: "New Jersey", href: "/areas/new-jersey" },
  { label: "Check Service Areas", href: "/service-areas" },
];

const EXPLORE_LINKS = [
  { label: "Login", href: "/account/" },
  { label: "Start Service", href: "/account/" },
  { label: "FAQs", href: "/faq" },
  { label: "About", href: "/our-story" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Blog", href: "/blog" },
];

export function Footer() {
  return (
    <footer className="bg-footer-bg text-white">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h4 className="text-lg font-heading-medium mb-4">About us</h4>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-white/70 leading-relaxed mb-6">
              We Deliver Laundry is your go-to service for premium laundry
              pickup and delivery, fast, easy, and reliable. Schedule your
              pickup today!
            </p>
            <h4 className="text-lg font-heading-medium mb-3">Contact us</h4>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-white/70 mb-1">
              <a href="tel:8559685511" className="hover:text-white transition-colors">
                (855) 968-5511
              </a>
            </p>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-white/70 mb-1">
              <a
                href="mailto:start@wedeliverlaundry.com"
                className="hover:text-white transition-colors"
              >
                start@wedeliverlaundry.com
              </a>
            </p>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-white/70 mt-3">
              <a
                href="https://careers.wedeliverlaundry.com"
                className="hover:text-white transition-colors"
              >
                Careers
              </a>
            </p>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-white/70 mt-1">
              <a
                href="https://careers.wedeliverlaundry.com/jobs/delivery-driver"
                className="hover:text-white transition-colors"
              >
                Deliver Driver
              </a>
            </p>
          </div>

          {/* Servicing Areas */}
          <div>
            <h4 className="text-lg font-heading-medium mb-4">Servicing Areas</h4>
            <ul className="space-y-2">
              {SERVICING_AREAS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-poppins)] text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-lg font-heading-medium mb-4">Explore</h4>
            <ul className="space-y-2">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-poppins)] text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA + App */}
          <div>
            <h4 className="text-lg font-heading-medium mb-4">
              You do you, we do laundry
            </h4>
            <p className="font-[family-name:var(--font-poppins)] text-sm text-white/70 mb-4">
              Trusted by 9,000+
              <br />
              happy customers.
            </p>
            <ButtonLink href="/account/" className="mb-6">
              Schedule Pick-up
            </ButtonLink>
            <div className="flex gap-3 mt-2">
              <a
                href="https://apps.apple.com/app/we-deliver-laundry/id1234567890"
                className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <p className="text-[10px] text-white/60">download the app</p>
                  <p className="text-xs font-body-medium">App Store</p>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.cleancloudapp.wedeliverlaundry"
                className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 hover:bg-white/20 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div>
                  <p className="text-[10px] text-white/60">download the app</p>
                  <p className="text-xs font-body-medium">Play Store</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/">
              <Image
                src="/images/logo-white.svg"
                alt="We Deliver Laundry"
                width={140}
                height={40}
              />
            </Link>

            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/wedeliverlaundry/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/people/We-Deliver-Laundry/61581397901196/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.google.com/search?q=we+deliver+laundry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google"
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </a>
            </div>

            <p className="font-[family-name:var(--font-poppins)] text-xs text-white/40">
              &copy; Copyright {new Date().getFullYear()} wedeliverlaundry.com
            </p>

            <p className="font-[family-name:var(--font-poppins)] text-xs text-white/30">
              Powered by{" "}
              <a
                href="https://www.studiogen.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/50 transition-colors"
              >
                StudioGen
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
