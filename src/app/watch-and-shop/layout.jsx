import { notFound } from 'next/navigation';
import { FEATURES } from '@/lib/features';
import { BRAND_SHORT, COLLECTIVE_NAME, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: `Watch & Shop | ${BRAND_SHORT}`,
  description:
    `Watch short videos from ${COLLECTIVE_NAME} and shop farm-direct staples instantly.`,
  path: '/watch-and-shop',
});

export default function WatchAndShopLayout({ children }) {
  if (!FEATURES.watchAndShop) notFound();
  return children;
}
