'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import styles from './header.module.css';

export default function HeaderSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (pathname === '/shop') {
      setSearchQuery(searchParams.get('q') || '');
    } else if (pathname === '/search') {
      setSearchQuery(searchParams.get('q') || '');
    } else {
      setSearchQuery('');
    }
  }, [pathname, searchParams]);

  const runSearch = (q) => {
    const trimmed = q.trim();
    if (!trimmed) {
      router.push('/shop');
      return;
    }
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    runSearch(searchQuery);
  };

  return (
    <div className={styles.searchWrap}>
      <form className={styles.searchForm} onSubmit={handleSearchSubmit} role="search">
        <Search size={18} strokeWidth={1.75} className={styles.searchFieldIcon} aria-hidden />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search products…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search products"
          autoComplete="off"
        />
      </form>

      <Link href="/search" className={styles.searchIconBtn} aria-label="Open search page">
        <Search size={20} strokeWidth={1.5} />
      </Link>
    </div>
  );
}
