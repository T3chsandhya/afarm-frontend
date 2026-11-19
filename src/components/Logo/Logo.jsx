import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/seo';
import styles from './logo.module.css';

export default function Logo({ size = 'md', className = '', onDark = false, onClick }) {
  return (
    <Link
      href="/"
      className={`${styles.logo} ${styles[size] || ''} ${onDark ? styles.onDark : ''} ${className}`.trim()}
      aria-label={`${BRAND} home`}
      onClick={onClick}
    >
      <span className={styles.imageWrap}>
        <Image
          src="/assets/logo.svg"
          alt=""
          width={256}
          height={256}
          unoptimized
          className={styles.image}
          priority={size === 'md'}
        />
      </span>
    </Link>
  );
}
