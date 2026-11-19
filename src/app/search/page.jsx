'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './search.module.css';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push('/shop');
      return;
    }
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Search products</h1>
          <p className={styles.hint}>Find farm-direct staples from Maharashtra FPOs.</p>
          <form className={styles.form} onSubmit={handleSubmit} role="search">
            <div className={styles.fieldWrap}>
              <Search size={20} strokeWidth={1.75} className={styles.fieldIcon} aria-hidden />
              <input
                type="search"
                className={styles.input}
                placeholder="Search products…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
                autoComplete="off"
                autoFocus
              />
            </div>
            <button type="submit" className={styles.submit}>
              Search
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
