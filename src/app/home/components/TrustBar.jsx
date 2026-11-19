import Image from 'next/image';
import styles from '../home.module.css';

export default function TrustBar() {
  const items = [
    {
      icon: '/images/trust/quality.png',
      title: 'Quality Checked',
      desc: 'Sourced through Maharashtra FPOs',
    },
    {
      icon: '/images/trust/network.png',
      title: 'Pan-India Delivery',
      desc: 'Farm-direct staples shipped nationwide',
    },
    {
      icon: '/images/trust/farmdirect.png',
      title: 'Easy Returns',
      desc: '7-day hassle-free returns',
    },
    {
      icon: '/images/trust/farmerfirst.png',
      title: 'Dedicated Support',
      desc: 'Personalized customer care',
    },
  ];

  return (
    <div className={styles.trustBar}>
      {items.map((item) => (
        <div key={item.title} className={styles.trustItem}>
          <div className={styles.trustIcon}>
            <Image
              src={item.icon}
              alt=""
              width={64}
              height={64}
              sizes="(max-width: 1024px) 48px, 64px"
              className={styles.trustIconImg}
            />
          </div>
          <div>
            <div className={styles.trustTitle}>{item.title}</div>
            <div className={styles.trustDesc}>{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
