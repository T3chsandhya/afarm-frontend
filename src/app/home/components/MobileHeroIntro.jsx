import { ShoppingCart } from 'lucide-react';
import { HOME_HERO_COPY } from '@/lib/heroCopy';
import styles from './banner.module.css';

export default function MobileHeroIntro() {
  return (
    <section className={styles.mobileHeroIntro} aria-labelledby="mobile-hero-intro-title">
      <p className={styles.mobileIntroEyebrow}>{HOME_HERO_COPY.line1}</p>
      <h2 id="mobile-hero-intro-title" className={styles.mobileIntroHeadline}>
        <span className={styles.mobileIntroHeadlineRow}>
          <span>{HOME_HERO_COPY.line2}</span>
          <ShoppingCart className={styles.mobileIntroCartIcon} strokeWidth={1.25} aria-hidden />
        </span>
      </h2>
      <p className={styles.mobileIntroBody}>{HOME_HERO_COPY.body}</p>
    </section>
  );
}
