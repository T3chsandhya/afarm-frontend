import styles from './home.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import {
  HomeBanner,
  MobileHeroIntro,
  CategoryShowcase,
  ProductShowcase,
  WhyChooseUs,
  WhoWeAre,
  CategoryMarquee,
} from './components';

export default function HomeScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.homeTop}>
        <Header />
        <HomeBanner />
      </div>
      <MobileHeroIntro />
      <main className={styles.main}>
        <CategoryShowcase />
        <ProductShowcase />
        <WhyChooseUs />
        <WhoWeAre />
        <CategoryMarquee />
      </main>
      <Footer />
    </div>
  );
}
