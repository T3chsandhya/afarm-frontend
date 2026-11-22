import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import { FEATURES } from '@/lib/features';
import SocialLinks from '@/components/SocialLinks/SocialLinks';
import { HOME_DESCRIPTION, CONTACT } from '@/lib/seo';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.inner}>
          <div className={styles.brandCol}>
            <Logo size="lg" className={styles.brandLogoLink} onDark />
            <p className={styles.brandDesc}>{HOME_DESCRIPTION}</p>
            <SocialLinks className={styles.socialRow} />
            {CONTACT.gstin ? (
              <p className={styles.gstin}>GST - {CONTACT.gstin}</p>
            ) : null}
          </div>

          <div className={styles.quickCol}>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <div className={styles.linkList}>
              <Link href="/shop" className={styles.link}>
                Shop Collection
              </Link>
              {FEATURES.watchAndShop && (
                <Link href="/watch-and-shop" className={styles.link}>
                  Watch &amp; Shop
                </Link>
              )}
              <Link href="/about" className={styles.link}>
                About Us
              </Link>
              <Link href="/contact-us" className={styles.link}>
                Contact Us
              </Link>
              <Link href="/faqs" className={styles.link}>
                FAQs
              </Link>
            </div>
          </div>

          <div className={styles.policyCol}>
            <h3 className={styles.colTitle}>Policies</h3>
            <div className={styles.linkList}>
              <Link href="/policy/privacy-policy" className={styles.link}>
                Privacy Policy
              </Link>
              <Link href="/policy/terms-and-conditions" className={styles.link}>
                Terms &amp; Conditions
              </Link>
              <Link href="/policy/shipping-policy" className={styles.link}>
                Shipping Policy
              </Link>
              <Link href="/policy/refund-policy" className={styles.link}>
                Returns &amp; Refunds
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <div className={styles.credit}>
        <p className={styles.creditCopy}>
          <span className={styles.creditLead}>Developed &amp; Managed by</span>
          <span className={styles.creditOrgRow}>
            <a
              href="https://techsandhya.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.creditLink}
            >
              Sandhya Technology Solutions and Operations LLP
            </a>
            <a
              href="https://techsandhya.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.creditBtn}
              aria-label="Visit Sandhya Technology Solutions and Operations LLP website"
              title="techsandhya.com"
            >
              <ArrowUpRight size={16} strokeWidth={2.25} aria-hidden="true" />
            </a>
          </span>
        </p>
      </div>
    </>
  );
}
