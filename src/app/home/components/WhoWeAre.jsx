import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { BRAND_SHORT, BRAND_TAGLINE, HOME_DESCRIPTION_LONG } from '@/lib/seo';
import homeStyles from '../home.module.css';

const ABOUT_IMAGE = '/images/home/afarmabout.png';

export default function WhoWeAre() {
  return (
    <section className={`${homeStyles.section} ${homeStyles.aboutSection}`}>
      <div className={homeStyles.aboutGrid}>
        <div className={homeStyles.aboutMosaicFrame}>
          <Image
            src={ABOUT_IMAGE}
            alt={`${BRAND_SHORT} — Maharashtra FPO collective`}
            width={880}
            height={880}
            sizes="(max-width: 768px) min(320px, 88vw), (max-width: 1024px) 520px, 600px"
            className={homeStyles.aboutHeroImg}
            priority={false}
          />
        </div>

        <div className={homeStyles.aboutContent}>
          <div className={homeStyles.sectionHeader}>
            <h2 className={homeStyles.sectionTitle}>WHO WE ARE</h2>
            <p className={homeStyles.sectionSubtitle}>{BRAND_TAGLINE}</p>
          </div>

          <p className={homeStyles.aboutText}>{HOME_DESCRIPTION_LONG}</p>
          <p className={homeStyles.aboutText}>
            {BRAND_SHORT} is a Maharashtra-based group of FPOs — connecting growers, collective
            enterprise, and customers through one trusted farm-direct marketplace online.
          </p>

          <div className={homeStyles.aboutActions}>
            <Link href="/shop" className={`${homeStyles.aboutBtn} ${homeStyles.aboutBtnPrimary}`}>
              Shop Now <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
