/**
 * Custom trust-section icons (stroke style, scales via width/height or CSS).
 */

const svgProps = (size, className) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  width: size,
  height: size,
  viewBox: '0 0 64 64',
  fill: 'none',
  className,
  'aria-hidden': true,
  role: 'presentation',
});

function stroke() {
  return {
    stroke: 'currentColor',
    strokeWidth: 2.25,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
}

/** FPO network — linked nodes */
export function IconNetwork({ size = 64, className }) {
  const s = stroke();
  return (
    <svg {...svgProps(size, className)}>
      <circle cx="32" cy="32" r="5" fill="currentColor" fillOpacity="0.15" {...s} />
      <circle cx="32" cy="32" r="5" {...s} />
      <circle cx="14" cy="18" r="4" {...s} />
      <circle cx="50" cy="18" r="4" {...s} />
      <circle cx="14" cy="46" r="4" {...s} />
      <circle cx="50" cy="46" r="4" {...s} />
      <path d="M18 20 L28 28" {...s} />
      <path d="M46 20 L36 28" {...s} />
      <path d="M18 44 L28 36" {...s} />
      <path d="M46 44 L36 36" {...s} />
    </svg>
  );
}

/** Field to home — farm direct */
export function IconFarmDirect({ size = 64, className }) {
  const s = stroke();
  return (
    <svg {...svgProps(size, className)}>
      <path d="M10 44 L32 24 L54 44" {...s} />
      <path d="M16 44 V34 H48 V44" {...s} />
      <rect x="28" y="38" width="8" height="6" rx="0.5" {...s} />
      <path d="M22 52 H42" {...s} />
      <path
        d="M44 20 C44 16 48 14 52 16 C54 20 50 24 46 22"
        fill="currentColor"
        fillOpacity="0.12"
        {...s}
      />
      <circle cx="50" cy="18" r="6" {...s} />
      <path d="M48 52 L56 44 M56 44 L52 44 M56 44 L56 48" {...s} />
    </svg>
  );
}

/** Farmer first — grower + crop */
export function IconFarmerFirst({ size = 64, className }) {
  const s = stroke();
  return (
    <svg {...svgProps(size, className)}>
      <path d="M20 22 C20 14 28 10 32 10 C38 10 44 16 44 24" {...s} />
      <path d="M18 22 H46" {...s} />
      <circle cx="32" cy="34" r="8" {...s} />
      <path d="M32 42 V52" {...s} />
      <path d="M24 52 H40" {...s} />
      <path d="M48 28 V52" {...s} />
      <path d="M48 28 C44 32 42 38 42 44" {...s} />
      <path d="M52 28 C56 32 58 38 58 44" {...s} />
      <path d="M46 52 H50" {...s} />
    </svg>
  );
}

/** Quality — badge + check */
export function IconQuality({ size = 64, className }) {
  const s = stroke();
  return (
    <svg {...svgProps(size, className)}>
      <path
        d="M32 8 L40 12 V22 C40 32 36 40 32 44 C28 40 24 32 24 22 V12 Z"
        fill="currentColor"
        fillOpacity="0.1"
        {...s}
      />
      <path d="M32 8 L40 12 V22 C40 32 36 40 32 44 C28 40 24 32 24 22 V12 Z" {...s} />
      <path d="M26 30 L30 34 L38 24" {...s} />
      <path d="M14 50 H50" {...s} />
      <path d="M20 54 H44" {...s} />
    </svg>
  );
}

/** Pan-India delivery */
export function IconDelivery({ size = 64, className }) {
  const s = stroke();
  return (
    <svg {...svgProps(size, className)}>
      <rect x="8" y="26" width="34" height="22" rx="2" {...s} />
      <path d="M42 32 H50 L58 40 V48 H42" {...s} />
      <circle cx="20" cy="52" r="5" {...s} />
      <circle cx="50" cy="52" r="5" {...s} />
      <path d="M16 32 H8 M12 20 H28" {...s} />
      <path d="M48 14 C52 12 56 14 56 18 C56 22 52 24 48 22" {...s} />
    </svg>
  );
}

/** Easy returns */
export function IconReturns({ size = 64, className }) {
  const s = stroke();
  return (
    <svg {...svgProps(size, className)}>
      <path d="M20 24 C20 16 28 10 38 10 C48 10 54 16 54 24" {...s} />
      <path d="M44 18 L54 24 L44 30" {...s} />
      <path d="M44 40 C44 48 36 54 26 54 C16 54 10 48 10 40" {...s} />
      <path d="M20 46 L10 40 L20 34" {...s} />
    </svg>
  );
}

/** Customer support */
export function IconSupport({ size = 64, className }) {
  const s = stroke();
  return (
    <svg {...svgProps(size, className)}>
      <path d="M16 28 C16 18 24 12 32 12 C40 12 48 18 48 28 V36 H44 C40 36 38 38 38 42 V44 H26 V42 C26 38 24 36 20 36 H16 Z" {...s} />
      <path d="M22 44 V48 C22 52 26 56 32 56 C38 56 42 52 42 48 V44" {...s} />
      <path d="M10 32 H16 M54 32 H48" {...s} />
      <circle cx="32" cy="28" r="2" fill="currentColor" />
    </svg>
  );
}

const TRUST_ICON_MAP = {
  network: IconNetwork,
  farmDirect: IconFarmDirect,
  farmerFirst: IconFarmerFirst,
  quality: IconQuality,
  delivery: IconDelivery,
  returns: IconReturns,
  support: IconSupport,
};

export function TrustIcon({ name, size = 64, className }) {
  const Icon = TRUST_ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

export default TrustIcon;
