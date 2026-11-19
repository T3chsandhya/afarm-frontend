import { BRAND_SHORT, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: `FAQs | ${BRAND_SHORT}`,
  description:
    'Answers about ordering farm-direct staples from AFARM — Maharashtra FPO collective, shipping across India, payments, returns, and product care.',
  path: '/faqs',
});

export default function FaqsLayout({ children }) {
  return children;
}
