import { COLLECTIVE_NAME, HOME_TITLE, fetchApi } from '@/lib/seo';
import { resolveBannerUrl } from '@/lib/banners';
import { HOME_HERO_COPY } from '@/lib/heroCopy';
import BannerSlider from './BannerSlider';
import styles from './banner.module.css';

async function getSlides(device) {
  const { data } = await fetchApi(`/banners/?device=${device}`, { revalidate: 30 });
  if (!Array.isArray(data)) return [];
  return data
    .filter((slide) => slide.image_url)
    .map((slide, index) => {
      const fromAdmin1 = (slide.title_highlight || '').trim();
      const fromAdmin2 = (slide.subtitle || '').trim();
      const altTitle = (slide.title || '').trim();
      const useDefault =
        device === 'desktop' && index === 0 && !fromAdmin1 && !fromAdmin2;
      const heroLine1 = fromAdmin1 || (useDefault ? HOME_HERO_COPY.line1 : '');
      const heroLine2 = fromAdmin2 || (useDefault ? HOME_HERO_COPY.line2 : '');
      const heroBody = useDefault ? HOME_HERO_COPY.body : '';
      const ctaHref = (slide.link_url || '').trim() || HOME_HERO_COPY.ctaHref;
      const hasHeroCopy = Boolean(heroLine1 || heroLine2 || heroBody);

      return {
        id: slide.id,
        src: resolveBannerUrl(slide.image_url),
        alt: altTitle || `${COLLECTIVE_NAME} – home`,
        href: hasHeroCopy && device === 'desktop' ? '' : slide.link_url || '',
        heroLine1,
        heroLine2,
        heroBody,
        ctaLabel: HOME_HERO_COPY.ctaLabel,
        ctaHref,
        hasHeroCopy: hasHeroCopy && device === 'desktop',
      };
    });
}

export default async function HomeBanner() {
  const [desktopSlides, mobileSlides] = await Promise.all([
    getSlides('desktop'),
    getSlides('mobile'),
  ]);

  return (
    <section
      className={`${styles.banner} ${styles.mobileHeroBanner}`}
      aria-labelledby="home-banner-heading"
    >
      <h1 id="home-banner-heading" className={styles.srOnly}>
        {HOME_TITLE}
      </h1>
      <div className={styles.desktopOnly}>
        <BannerSlider slides={desktopSlides} device="desktop" />
      </div>
      <div className={styles.mobileOnly}>
        <BannerSlider slides={mobileSlides} device="mobile" />
      </div>
    </section>
  );
}
