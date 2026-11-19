import styles from './pdpTrustIcons.module.css';

const STROKE = 'currentColor';

function IconSecurePayment() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={styles.svg}>
      <path
        d="M24 4 8 10v11c0 10.2 6.8 19.7 16 22 9.2-2.3 16-11.8 16-22V10L24 4Z"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M18 24.5 22 28.5 31 19.5"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFastDelivery() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={styles.svg}>
      <path
        d="M6 14h22v16H6V14Z"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M28 20h8l4 6v4h-12V20Z"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="32" r="3" stroke={STROKE} strokeWidth="2" />
      <circle cx="34" cy="32" r="3" stroke={STROKE} strokeWidth="2" />
      <path d="M6 32h5M37 32h5" stroke={STROKE} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconArtisanSupport() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={styles.svg}>
      <path
        d="M24 38s-12-7.2-12-16a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8.8-12 16-12 16Z"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 14c-2 2-3 4.5-3 7M32 14c2 2 3 4.5 3 7"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconAuthenticCraft() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={styles.svg}>
      <path
        d="M24 6 28 18h12L31 26l4 12-11-7-11 7 4-12-9-8h12L24 6Z"
        stroke={STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ITEMS = [
  { id: 'secure', label: 'Secure Payment', Icon: IconSecurePayment },
  { id: 'delivery', label: 'Fast Delivery', Icon: IconFastDelivery },
  { id: 'artisans', label: 'Artisan Support', Icon: IconArtisanSupport },
  { id: 'authentic', label: 'Authentic Craft', Icon: IconAuthenticCraft },
];

export default function PdpTrustIcons({ className = '' }) {
  return (
    <div className={`${styles.row} ${className}`.trim()} role="list">
      {ITEMS.map(({ id, label, Icon }) => (
        <div key={id} className={styles.item} role="listitem">
          <span className={styles.iconWrap}>
            <Icon />
          </span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}
