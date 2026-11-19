import { BRAND_SHORT, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: `Search | ${BRAND_SHORT}`,
  description: 'Search farm-direct products from AFARM.',
  path: '/search',
});

export default function SearchLayout({ children }) {
  return children;
}
