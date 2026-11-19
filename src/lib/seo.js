import { ASSETS } from '@/lib/assets';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/+$/,
  ''
);
export const BRAND = process.env.NEXT_PUBLIC_SITE_NAME || 'AFARM';
export const BRAND_TAGLINE = 'Maharashtra-based group of FPOs';
export const BRAND_SHORT = 'AFARM';
export const COLLECTIVE_NAME = 'Maharashtra FPO Collective';
/** Marketplace listing slug (reference for ONDC / partner storefronts). */
export const SHOP_LISTING_SLUG = 'afarm-maharashtra-fpo-collective';

export const INSTAGRAM_URL = (process.env.NEXT_PUBLIC_INSTAGRAM_URL || '').trim();
export const SOCIAL_LINKS = [INSTAGRAM_URL].filter(Boolean);

export const CONTACT = {
  phone: '+91 98765 43210',
  phoneIntl: '+91-98765-43210',
  whatsapp: '919876543210',
  email: 'contact@afarm.in',
  street: '',
  locality: 'Maharashtra',
  region: 'Maharashtra',
  postalCode: '',
  address: 'AFARM — Maharashtra-based group of Farmer Producer Organisations (FPOs), India',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=AFARM+Farmer+Producer+Organisation+Maharashtra',
  gstin: '',
};

export const SERVICE_AREAS = ['Maharashtra', 'India'];

export const HOME_DESCRIPTION_LONG =
  'AFARM unites Farmer Producer Organisations across Maharashtra into one trusted marketplace. Farmers gather in local FPOs; FPOs come together as AFARM so seasonal harvests, farm-direct staples, and honest quality can move from growers to your kitchen with traceability and fair value at every step. When you shop with us, you support collective farming enterprise, strengthen rural Maharashtra, and choose food sourced closer to the field.';

export const HOME_TITLE = `Farm-Fresh From Maharashtra FPOs | ${BRAND_SHORT}`;
export const HOME_DESCRIPTION =
  'Shop seasonal harvests and farm-direct staples from AFARM — a Maharashtra-based group of FPOs delivering honest quality from growers to your home. Pan-India delivery.';

export const SITE_KEYWORDS = [
  'AFARM',
  'Maharashtra FPO',
  'farmer producer organisation',
  'farm direct groceries',
  'seasonal harvest Maharashtra',
  'farm to home India',
  'FPO collective Maharashtra',
  'fresh staples online',
  'agri marketplace India',
  BRAND_SHORT,
  COLLECTIVE_NAME,
];

const defaultOgImageUrl = ASSETS.ogImage.startsWith('http')
  ? ASSETS.ogImage
  : `${SITE_URL}${ASSETS.ogImage.startsWith('/') ? '' : '/'}${ASSETS.ogImage}`;

export const DEFAULT_OG_IMAGE = {
  url: defaultOgImageUrl,
  width: 512,
  height: 512,
  type: 'image/png',
  alt: `${BRAND} – ${BRAND_TAGLINE}`,
};

const TITLE_MAX = 65;
const DESCRIPTION_MAX = 160;

const API_BASE = (
  process.env.API_INTERNAL_BASE ||
  process.env.NEXT_PUBLIC_API_BASE ||
  'http://localhost:8000/api/v1'
).replace(/\/+$/, '');

/** Server-side JSON fetch that never throws; `status` is 0 on network failure. */
export async function fetchApi(path, { revalidate = 60 } = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false, status: res.status, data: null };
    return { ok: true, status: res.status, data: await res.json() };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

export const absoluteUrl = (path = '/') => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const stripHtml = (raw) =>
  String(raw || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

export const truncate = (text, max) => {
  const value = String(text || '').trim();
  if (value.length <= max) return value;
  const cut = value.slice(0, max - 1);
  const atWord = cut.slice(0, Math.max(cut.lastIndexOf(' '), Math.floor(max * 0.6)));
  return `${atWord.replace(/[\s,.;:–—-]+$/, '')}…`;
};

/** Drops store-name suffixes admins add to product titles. */
export const cleanProductName = (name) =>
  String(name || '')
    .replace(/\s*[|–—-]\s*chair\s*dekho(\.com)?\s*$/i, '')
    .replace(/\s*[|–—-]\s*amakund(\s*producer(\s*company)?(\s*limited)?)?\s*$/i, '')
    .replace(/\s*[|–—-]\s*afarm(\s*(\(|\[)?\s*maharashtra)?\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

const PRODUCT_TYPES = [
  { key: 'grain', label: 'grain', plural: 'grains', re: /wheat|rice|jowar|bajra|ragi|grain|atta|flour/i },
  { key: 'pulse', label: 'pulse', plural: 'pulses', re: /dal|pulse|lentil|bean|chana|moong|urad/i },
  { key: 'oil', label: 'edible oil', plural: 'edible oils', re: /oil|ghee|cold.?pressed/i },
  { key: 'spice', label: 'spice', plural: 'spices', re: /spice|masala|turmeric|chilli/i },
  { key: 'vegetable', label: 'vegetable', plural: 'vegetables', re: /vegetable|onion|potato|tomato|fresh produce/i },
  { key: 'fruit', label: 'fruit', plural: 'fruits', re: /fruit|mango|banana|citrus/i },
  { key: 'staple', label: 'staple', plural: 'staples', re: /staple|grocery|kitchen|pantry/i },
  { key: 'produce', label: 'farm product', plural: 'farm products', re: /farm|organic|natural|harvest/i },
];

export function detectProductType(product) {
  const metaType = product?.metafields?.product_type;
  const sources = [product?.name, metaType, product?.category];
  for (const source of sources) {
    if (!source) continue;
    const found = PRODUCT_TYPES.find((t) => t.re.test(String(source)));
    if (found) return found;
  }
  return null;
}

const metaValue = (product, key) => stripHtml(product?.metafields?.[key] || '');

/** Title-cased label/value pairs in the same order the PDP renders Key Highlights. */
export function getHighlights(product, defs = []) {
  const values = product?.metafields || {};
  const ordered = (Array.isArray(defs) ? defs : [])
    .filter((d) => d?.is_active !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((d) => ({ key: d.key, name: d.name, value: stripHtml(values[d.key]) }));
  const list = ordered.length
    ? ordered
    : Object.entries(values).map(([key, value]) => ({
        key,
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: stripHtml(value),
      }));
  return list.filter((h) => h.value && !/faq/i.test(h.key) && h.value.length <= 80);
}

export function buildProductTitle(product) {
  const override = String(product?.seo_title || '').trim();
  if (override) return override;

  const name = cleanProductName(product?.name) || 'Farm product';
  const candidates = [
    `${name} – Farm Direct | ${BRAND_SHORT}`,
    `${name} – Maharashtra FPO | ${BRAND_SHORT}`,
    `${name} | ${BRAND_SHORT}`,
    name,
  ];
  return candidates.find((c) => c.length <= TITLE_MAX) || truncate(name, TITLE_MAX);
}

const formatInr = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return '';
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export function getPriceRange(product) {
  const optionPrices = (product?.variants || [])
    .flatMap((v) => v?.options || [])
    .map((o) => Number(o?.price))
    .filter((p) => Number.isFinite(p) && p > 0);
  const prices = optionPrices.length ? optionPrices : [Number(product?.price)].filter((p) => p > 0);
  if (!prices.length) return { low: null, high: null };
  return { low: Math.min(...prices), high: Math.max(...prices) };
}

export function getTotalStock(product) {
  const optionStocks = (product?.variants || [])
    .flatMap((v) => v?.options || [])
    .map((o) => Number(o?.stock) || 0);
  if (optionStocks.length) return optionStocks.reduce((a, b) => a + b, 0);
  return Number(product?.stock) || 0;
}

function firstSentence(text) {
  const clean = stripHtml(text);
  if (!clean) return '';
  const match = clean.match(/^.+?[.!?](\s|$)/);
  return (match ? match[0] : clean).trim();
}

export function buildProductDescription(product, defs = []) {
  const override = String(product?.seo_description || '').trim();
  if (override) return truncate(override, DESCRIPTION_MAX);

  const name = cleanProductName(product?.name) || 'this product';
  const { low } = getPriceRange(product);
  const price = formatInr(low);
  const lead = `Buy ${name} online${price ? ` at ${price}` : ''} from ${BRAND_SHORT} — farm-direct staples from Maharashtra FPOs, shipped across India.`;

  const highlightKeys = ['origin', 'variety', 'grade', 'pack_size', 'weight', 'shelf_life'];
  const highlightValues = highlightKeys
    .map((key) => metaValue(product, key))
    .filter((v) => v && v.length <= 30);
  if (!highlightValues.length) {
    getHighlights(product, defs)
      .filter((h) => !/product_type/i.test(h.key))
      .slice(0, 4)
      .forEach((h) => highlightValues.push(h.value));
  }
  const highlights = highlightValues.length ? `${[...new Set(highlightValues)].join(', ')}.` : '';

  const parts = [lead, highlights, firstSentence(product?.description), 'Cash on delivery available.'];
  let result = '';
  for (const part of parts) {
    if (!part) continue;
    const next = result ? `${result} ${part}` : part;
    if (next.length <= DESCRIPTION_MAX) result = next;
  }
  return result || truncate(lead, DESCRIPTION_MAX);
}

export function buildProductKeywords(product) {
  const name = cleanProductName(product?.name);
  const type = detectProductType(product);
  const words = [name];
  if (type) {
    words.push(
      type.plural,
      `${type.label} price`,
      `buy ${type.label} online`,
      `${type.plural} Maharashtra`,
      `FPO ${type.label}`,
    );
  }
  if (product?.category) words.push(product.category);
  words.push(
    'farm direct groceries',
    'Maharashtra FPO',
    'AFARM online',
    BRAND_SHORT,
    COLLECTIVE_NAME
  );
  return [...new Set(words.filter(Boolean))];
}

const productImages = (product) =>
  (product?.images || [])
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean)
    .map((url) => absoluteUrl(url));

export function buildProductMetadata(product, defs = []) {
  const title = buildProductTitle(product);
  const description = buildProductDescription(product, defs);
  const path = `/products/${product.slug}`;
  const images = productImages(product).slice(0, 4);
  const { low } = getPriceRange(product);
  const inStock = getTotalStock(product) > 0;

  return {
    title: { absolute: title },
    description,
    keywords: buildProductKeywords(product),
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: BRAND,
      locale: 'en_IN',
      url: path,
      title,
      description,
      images: images.length
        ? images.map((url) => ({ url, alt: cleanProductName(product.name) }))
        : [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.length ? [images[0]] : [DEFAULT_OG_IMAGE.url],
    },
    other: {
      ...(low ? { 'product:price:amount': String(low), 'product:price:currency': 'INR' } : {}),
      'product:availability': inStock ? 'in stock' : 'out of stock',
      'product:brand': BRAND,
      'product:condition': 'new',
    },
  };
}

// Must stay in sync with /policy/shipping-policy and /policy/refund-policy.
const OFFER_SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'INR' },
  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
    transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 10, unitCode: 'DAY' },
  },
};

const MERCHANT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'IN',
  returnPolicyCountry: 'IN',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 7,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/FreeReturn',
  refundType: 'https://schema.org/FullRefund',
  merchantReturnLink: `${SITE_URL}/policy/refund-policy`,
};

export function buildProductJsonLd(product, defs = []) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const { low, high } = getPriceRange(product);
  const availability =
    getTotalStock(product) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  const material = metaValue(product, 'material');
  const color = metaValue(product, 'color');
  const offerCount = (product?.variants || []).flatMap((v) => v?.options || []).length;

  const offers =
    low != null && high != null && high > low
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: low,
          highPrice: high,
          offerCount: offerCount || 1,
          availability,
          url,
          shippingDetails: OFFER_SHIPPING_DETAILS,
          hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
        }
      : low != null
        ? {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: low,
            availability,
            itemCondition: 'https://schema.org/NewCondition',
            url,
            seller: { '@type': 'Organization', name: BRAND },
            shippingDetails: OFFER_SHIPPING_DETAILS,
            hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
          }
        : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: cleanProductName(product.name),
    description: truncate(stripHtml(product.description) || buildProductDescription(product, defs), 5000),
    url,
    image: productImages(product),
    sku: String(product.id),
    brand: { '@type': 'Brand', name: BRAND },
    category: product.category || undefined,
    material: material || undefined,
    color: color || undefined,
    additionalProperty: getHighlights(product, defs).map((h) => ({
      '@type': 'PropertyValue',
      name: h.name,
      value: h.value,
    })),
    offers,
  };
}

export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Store', 'OnlineStore'],
    '@id': `${SITE_URL}/#organization`,
    name: BRAND,
    alternateName: [COLLECTIVE_NAME, BRAND_SHORT, BRAND_TAGLINE],
    description: HOME_DESCRIPTION_LONG,
    url: SITE_URL,
    logo: absoluteUrl('/icon.png'),
    image: defaultOgImageUrl,
    ...(SOCIAL_LINKS.length ? { sameAs: SOCIAL_LINKS } : {}),
    email: CONTACT.email,
    telephone: CONTACT.phoneIntl,
    priceRange: '₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT.locality,
      addressRegion: CONTACT.region,
      addressCountry: 'IN',
      ...(CONTACT.street ? { streetAddress: CONTACT.street } : {}),
      ...(CONTACT.postalCode ? { postalCode: CONTACT.postalCode } : {}),
    },
    ...(CONTACT.gstin ? { taxID: CONTACT.gstin } : {}),
    areaServed: SERVICE_AREAS.map((name) => ({ '@type': 'AdministrativeArea', name })),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: CONTACT.phoneIntl,
      email: CONTACT.email,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi', 'mr'],
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: BRAND,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-IN',
  };
}

export function buildCategorySeo(category) {
  const name = String(category?.name || '').trim();
  const autoTitle =
    [
      `${name} – Farm Direct | ${BRAND_SHORT}`,
      `${name} – Shop Online | ${BRAND_SHORT}`,
      `${name} | ${BRAND_SHORT}`,
    ].find((c) => c.length <= TITLE_MAX) || name;
  const title = String(category?.seo_title || '').trim() || autoTitle;

  const intro = stripHtml(category?.description);
  const parts = [
    intro ? (/[.!?]$/.test(intro) ? intro : `${intro}.`) : '',
    `Shop ${name.toLowerCase()} from ${BRAND_SHORT} — sourced through Maharashtra FPOs, delivered across India.`,
    'Secure checkout & cash on delivery.',
  ];
  let autoDescription = '';
  for (const part of parts) {
    if (!part) continue;
    const next = autoDescription ? `${autoDescription} ${part}` : part;
    if (next.length <= DESCRIPTION_MAX) autoDescription = next;
  }
  const description = truncate(
    String(category?.seo_description || '').trim() || autoDescription,
    DESCRIPTION_MAX
  );

  return { title, description };
}

/** Full metadata for a static page, keeping the default OG image when a page has none. */
export function pageMetadata({ title, description, path, noindex = false, images, keywords }) {
  const ogImages = images?.length ? images : [DEFAULT_OG_IMAGE];
  return {
    title: { absolute: title },
    description,
    ...(keywords ? { keywords } : {}),
    ...(path ? { alternates: { canonical: path } } : {}),
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      siteName: BRAND,
      locale: 'en_IN',
      ...(path ? { url: path } : {}),
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((img) => (typeof img === 'string' ? img : img.url)),
    },
  };
}

export function jsonLdString(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
