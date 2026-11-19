import Image from 'next/image';
import styles from './about.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageHeroBanner from '@/components/PageHeroBanner/PageHeroBanner';
import { HandHeart, Leaf, Sparkles, Users } from 'lucide-react';
import WhyChooseUs from '@/app/home/components/WhyChooseUs';
import {
  BRAND,
  BRAND_SHORT,
  BRAND_TAGLINE,
  COLLECTIVE_NAME,
  HOME_DESCRIPTION_LONG,
  pageMetadata,
} from '@/lib/seo';

export const metadata = pageMetadata({
  title: `About Us | ${COLLECTIVE_NAME} – ${BRAND_SHORT}`,
  description:
    'Learn about AFARM — a Maharashtra-based group of Farmer Producer Organisations delivering farm-direct staples from growers to your home.',
  path: '/about',
});

const WHY_POINTS = [
  {
    icon: Sparkles,
    title: 'Collective Strength',
    desc: 'Individual farmers gain market power by organising into FPOs and collaborating under AFARM.',
  },
  {
    icon: Users,
    title: 'Grower-Led',
    desc: 'Decisions stay close to the field — members set quality standards and share in the value created.',
  },
  {
    icon: Leaf,
    title: 'Seasonal & Honest',
    desc: 'Harvests and staples move with the season, with traceability from Maharashtra farms to your kitchen.',
  },
  {
    icon: HandHeart,
    title: 'Farm to Home',
    desc: 'We shorten the chain between producers and families — fair pricing, dependable supply, pan-India delivery.',
  },
];

const WHY_STATS = [
  { value: 'FPO', label: 'Farmer collectives' },
  { value: 'MH', label: 'Maharashtra rooted' },
  { value: 'AFARM', label: 'United marketplace' },
];

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Header />
      <PageHeroBanner
        variant="simple"
        title={`About ${BRAND_SHORT}`}
        subtitle={`${BRAND_TAGLINE} — from growers to your home.`}
      />

      <main className={styles.main}>
        <section className={styles.storySection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>OUR STORY</h2>
            <p className={styles.sectionSubtitle}>Farmers, FPOs, and one trusted marketplace</p>
          </div>

          <div className={styles.storyContent}>
            <div className={styles.storyMedia}>
              <Image
                src="/assets/logo.svg"
                alt={`${BRAND} logo`}
                width={512}
                height={512}
                sizes="(max-width: 900px) 80vw, 280px"
                className={styles.storyImage}
                unoptimized
              />
            </div>
            <div className={styles.storyText}>
              <p className={styles.paragraph}>{HOME_DESCRIPTION_LONG}</p>
              <p className={styles.paragraph}>
                {BRAND_SHORT} works across Maharashtra so member FPOs can list seasonal produce,
                staples, and value-added goods on one platform — with logistics and customer care
                that help smallholders compete at scale.
              </p>
            </div>
          </div>
        </section>

        <div className={styles.valuesWrap}>
          <WhyChooseUs title="OUR VALUES" subtitle="What we stand for" />
        </div>

        <section className={styles.whySection}>
          <div className={styles.whyCard}>
            <div className={styles.whyIntro}>
              <h2 className={styles.whyTitle}>WHY {BRAND_SHORT.toUpperCase()}</h2>
              <p className={styles.whySubtitle}>{COLLECTIVE_NAME}</p>
              <p className={styles.whyLead}>
                When you shop with {BRAND_SHORT}, you support collective farming enterprise in
                Maharashtra — and choose food sourced closer to the people who grow it.
              </p>
              <ul className={styles.whyStats}>
                {WHY_STATS.map((stat) => (
                  <li key={stat.label} className={styles.whyStat}>
                    <strong className={styles.whyStatValue}>{stat.value}</strong>
                    <span className={styles.whyStatLabel}>{stat.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className={styles.whyGrid}>
              {WHY_POINTS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className={styles.whyItem}>
                  <span className={styles.whyIcon}>
                    <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <h3 className={styles.whyItemTitle}>{title}</h3>
                  <p className={styles.whyItemDesc}>{desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
