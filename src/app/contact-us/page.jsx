import styles from './contact.module.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageHeroBanner from '@/components/PageHeroBanner/PageHeroBanner';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import { BRAND, BRAND_SHORT, CONTACT, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: `Contact Us | ${BRAND_SHORT} – Maharashtra`,
  description:
    'Contact AFARM for orders, FPO enquiries, or product questions. Call, WhatsApp, email, or reach our Maharashtra-based FPO collective team.',
  path: '/contact-us',
});

const phoneHref = `tel:+${CONTACT.whatsapp}`;

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    extra: 'We typically respond within 24–48 hours',
  },
  {
    icon: Phone,
    label: 'Call / WhatsApp',
    value: CONTACT.phone,
    href: phoneHref,
    extra: 'Orders, bulk enquiries and support',
  },
  {
    icon: Clock,
    label: 'Operating Hours',
    value: 'Mon – Sat: 10:00 AM – 6:00 PM IST',
    extra: 'Timings may vary on local holidays',
  },
  {
    icon: MapPin,
    label: 'Store Address',
    value: BRAND,
    href: CONTACT.mapsUrl,
    extra: CONTACT.address,
    external: true,
  },
];

export default function ContactUsPage() {
  return (
    <div className={styles.container}>
      <Header />
      <PageHeroBanner
        variant="simple"
        title="Contact Us"
        subtitle="Reach out for orders, FPO partnerships, or questions about our farm-direct range."
      />

      <main className={styles.main}>
        <section className={styles.infoSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>GET IN TOUCH</h2>
            <p className={styles.sectionSubtitle}>Ways to Reach Us</p>
          </div>
          <div className={styles.infoGrid}>
            {contactInfo.map((item) => {
              const IconComp = item.icon;
              return (
                <article key={item.label} className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <IconComp size={22} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <span className={styles.infoLabel}>{item.label}</span>
                  {item.href ? (
                    <a
                      className={styles.infoValueLink}
                      href={item.href}
                      {...(item.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className={styles.infoValue}>{item.value}</p>
                  )}
                  <p className={styles.infoExtra}>{item.extra}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>SEND US A MESSAGE</h2>
            <p className={styles.sectionSubtitle}>Let Us Know</p>
          </div>

          <div className={styles.formCard}>
            <form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="contact-name">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="contact-email">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Your email address"
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="contact-phone">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    placeholder="Your mobile number"
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="Order, wholesale, or general enquiry"
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  placeholder="How can we help you today?"
                  className={styles.textarea}
                />
              </div>
              <button type="button" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
