import Image from 'next/image';
import Link from 'next/link';
import styles from './pagehero.module.css';

const IMAGE_SIZES = '(max-width: 900px) 50vw, 380px';

export default function PageHeroBanner({
  title,
  subtitle,
  backLabel,
  backHref,
  variant = 'default',
}) {
  const simple = variant === 'simple';

  return (
    <section
      className={`${styles.heroBanner} ${simple ? styles.heroBannerSimple : ''}`}
    >
      {!simple && <div className={styles.heroBg} aria-hidden="true" />}
      {!simple && (
        <>
          <Image
            src="/images/hero/chairleft.webp"
            alt=""
            width={1254}
            height={1254}
            sizes={IMAGE_SIZES}
            className={`${styles.heroImg} ${styles.heroImgLeft}`}
          />
          <Image
            src="/images/hero/chairright.webp"
            alt=""
            width={1254}
            height={1254}
            sizes={IMAGE_SIZES}
            className={`${styles.heroImg} ${styles.heroImgRight}`}
          />
        </>
      )}
      <div className={styles.heroInner}>
        {backLabel && backHref && (
          <Link href={backHref} className={styles.backLink}>
            ← {backLabel}
          </Link>
        )}
        <div className={styles.accentLine} />
        <h1 className={styles.heroTitle}>{title}</h1>
        {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
      </div>
    </section>
  );
}
