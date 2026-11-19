import Image from 'next/image';
import { BRAND_SHORT, COLLECTIVE_NAME, BRAND_TAGLINE } from '@/lib/seo';
import styles from '../home.module.css';

const PRINCIPLES = [
  {
    num: '01',
    title: 'FPO Network',
    desc: 'Farmers unite in local FPOs; FPOs come together as AFARM for scale, stability, and fair market access.',
    icon: '/images/trust/network.png',
  },
  {
    num: '02',
    title: 'Farm Direct',
    desc: 'Seasonal harvests and staples sourced closer to the field — traceable from Maharashtra growers to you.',
    icon: '/images/trust/farmdirect.png',
  },
  {
    num: '03',
    title: 'Farmer First',
    desc: 'Collective selling helps members earn better value while keeping quality honest and supply dependable.',
    icon: '/images/trust/farmerfirst.png',
  },
  {
    num: '04',
    title: 'Quality You Trust',
    desc: 'Clear grading, careful handling, and dependable delivery — farm-direct staples for everyday kitchens.',
    icon: '/images/trust/quality.png',
  },
];

export default function WhyChooseUs({
  title = `WHY ${BRAND_SHORT.toUpperCase()}`,
  subtitle = COLLECTIVE_NAME,
}) {
  return (
    <section className={`${styles.section} ${styles.featuresSection}`}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{subtitle || BRAND_TAGLINE}</p>
      </div>

      <ul className={styles.principlesList}>
        {PRINCIPLES.map((item) => (
          <li key={item.num} className={styles.principleItem}>
            <span className={styles.principleNum} aria-hidden="true">
              {item.num}
            </span>
            <div className={styles.principleIcon}>
              <Image src={item.icon} alt="" width={400} height={400} sizes="(max-width: 768px) 88px, 176px" />
            </div>
            <h3 className={styles.principleTitle}>{item.title}</h3>
            <p className={styles.principleDesc}>{item.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
