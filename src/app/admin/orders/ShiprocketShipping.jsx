'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Rocket, ExternalLink } from 'lucide-react';
import adminService from '@/lib/services/admin';
import styles from './orders.module.css';

function groupItemsBySeller(items) {
  const groups = new Map();
  for (const item of items || []) {
    const key = item.seller_id != null ? String(item.seller_id) : 'none';
    const label = item.seller_name || (item.seller_id ? `Seller #${item.seller_id}` : 'No seller');
    if (!groups.has(key)) {
      groups.set(key, {
        seller_id: item.seller_id ?? null,
        seller_name: label,
        items: [],
      });
    }
    groups.get(key).items.push(item);
  }
  if (groups.size === 0) {
    groups.set('none', { seller_id: null, seller_name: 'All items', items: items || [] });
  }
  return Array.from(groups.values());
}

export default function ShiprocketShipping({ order, onShipmentChange, compact = false }) {
  const [busyKey, setBusyKey] = useState(null);

  const groups = useMemo(
    () => groupItemsBySeller(order?.items),
    [order?.items]
  );

  const shipments = order?.shipments?.length
    ? order.shipments
    : order?.shipment
      ? [order.shipment]
      : [];

  const shipmentForSeller = (sellerId) =>
    shipments.find((s) =>
      sellerId == null
        ? s.seller_id == null
        : Number(s.seller_id) === Number(sellerId)
    );

  const handleShip = async (sellerId) => {
    const key = sellerId == null ? 'none' : String(sellerId);
    try {
      setBusyKey(key);
      const shipment = await adminService.sendOrderToShiprocket(order.order_id, sellerId);
      toast.success('Pushed to Shiprocket');
      onShipmentChange?.(order.order_id, shipment, { sellerId });
    } catch (err) {
      toast.error(err.message || 'Shiprocket push failed');
    } finally {
      setBusyKey(null);
    }
  };

  if (compact && groups.length === 1) {
    const g = groups[0];
    const sh = shipmentForSeller(g.seller_id);
    if (sh?.awb_code) {
      return (
        <span className={styles.muted} title="Shiprocket AWB">
          SR · {sh.awb_code}
        </span>
      );
    }
    if (sh?.shiprocket_order_id) {
      return <span className={styles.muted}>SR created</span>;
    }
    return <span className={styles.muted}>—</span>;
  }

  return (
    <div className={styles.shiprocketBlock}>
      {groups.map((g) => {
        const sh = shipmentForSeller(g.seller_id);
        const key = g.seller_id == null ? 'none' : String(g.seller_id);
        const loading = busyKey === key;

        return (
          <div key={key} className={styles.sellerShipRow}>
            <div>
              <strong>{g.seller_name}</strong>
              <div className={styles.muted}>
                {g.items.length} item{g.items.length === 1 ? '' : 's'}
              </div>
            </div>
            <div className={styles.sellerShipActions}>
              {sh?.awb_code ? (
                <span className={styles.shipBadge}>
                  AWB {sh.awb_code}
                  {sh.tracking_url && (
                    <a
                      href={sh.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.trackLink}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </span>
              ) : sh?.shiprocket_order_id ? (
                <span className={styles.muted}>Shiprocket order {sh.shiprocket_order_id}</span>
              ) : (
                <button
                  type="button"
                  className={styles.shipBtn}
                  disabled={loading}
                  onClick={() => handleShip(g.seller_id)}
                >
                  {loading ? (
                    <Loader2 size={16} className={styles.spin} />
                  ) : (
                    <Rocket size={16} />
                  )}
                  Ship via Shiprocket
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
