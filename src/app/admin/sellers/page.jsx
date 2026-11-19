'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Store, Save, X } from 'lucide-react';
import adminService from '@/lib/services/admin';
import productStyles from '../products/products.module.css';
import styles from './sellers.module.css';

const formatMoney = (n) => {
  const v = Number(n);
  if (Number.isNaN(v)) return '—';
  return `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPickup, setNewPickup] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPickup, setEditPickup] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getSellers();
      setSellers(Array.isArray(data?.sellers) ? data.sellers : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load sellers');
      setSellers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPickup.trim()) {
      toast.error('Name and pickup location are required');
      return;
    }
    try {
      setSaving(true);
      await adminService.createSeller({
        name: newName.trim(),
        pickup_location: newPickup.trim(),
      });
      toast.success('Seller added');
      setNewName('');
      setNewPickup('');
      setAddOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not add seller');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditName(row.name || '');
    setEditPickup(row.pickup_location || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPickup('');
  };

  const saveEdit = async (id) => {
    if (!editName.trim() || !editPickup.trim()) {
      toast.error('Name and pickup location are required');
      return;
    }
    try {
      setSaving(true);
      await adminService.updateSeller(id, {
        name: editName.trim(),
        pickup_location: editPickup.trim(),
      });
      toast.success('Seller updated');
      cancelEdit();
      load();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={productStyles.container}>
      <div className={productStyles.header}>
        <div>
          <h1 className={productStyles.title}>Sellers</h1>
          <p className={productStyles.subtitle}>
            Each seller has a Shiprocket pickup location nickname. Products and per-seller
            shipments use this pickup when you click Ship on an order.
          </p>
        </div>
        <button
          type="button"
          className={productStyles.primaryBtn}
          onClick={() => setAddOpen(true)}
        >
          <Plus size={18} />
          Add seller
        </button>
      </div>

      {addOpen && (
        <form className={styles.addCard} onSubmit={handleCreate}>
          <h3 className={styles.addTitle}>New seller</h3>
          <div className={styles.addGrid}>
            <div>
              <label className={productStyles.formLabel}>Seller name</label>
              <input
                className={productStyles.formInput}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Nashik FPO"
              />
            </div>
            <div>
              <label className={productStyles.formLabel}>Shiprocket pickup location</label>
              <input
                className={productStyles.formInput}
                value={newPickup}
                onChange={(e) => setNewPickup(e.target.value)}
                placeholder="Exact nickname from Shiprocket dashboard"
              />
            </div>
          </div>
          <div className={styles.addActions}>
            <button
              type="button"
              className={productStyles.secondaryBtn}
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={productStyles.primaryBtn} disabled={saving}>
              Save seller
            </button>
          </div>
        </form>
      )}

      <div className={productStyles.tableCard}>
        {loading ? (
          <div className={productStyles.loadingState}>Loading sellers…</div>
        ) : sellers.length === 0 ? (
          <div className={productStyles.emptyState}>
            <Store size={40} className={productStyles.emptyIcon} />
            <h3 className={productStyles.emptyTitle}>No sellers yet</h3>
            <p className={productStyles.emptyDesc}>
              Add a seller with their Shiprocket pickup location, then assign products to them.
            </p>
          </div>
        ) : (
          <div className={productStyles.tableWrapper}>
            <table className={productStyles.table}>
              <thead>
                <tr>
                  <th className={productStyles.th}>#</th>
                  <th className={productStyles.th}>Seller name</th>
                  <th className={productStyles.th}>Pickup location</th>
                  <th className={productStyles.th}>Products</th>
                  <th className={productStyles.th}>Orders</th>
                  <th className={productStyles.th}>Total sales</th>
                  <th className={productStyles.th} />
                </tr>
              </thead>
              <tbody>
                {sellers.map((row) => {
                  const isEditing = editingId === row.id;
                  return (
                    <tr key={row.id} className={productStyles.tr}>
                      <td className={productStyles.td}>{row.serial ?? row.id}</td>
                      <td className={productStyles.td}>
                        {isEditing ? (
                          <input
                            className={productStyles.formInput}
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        ) : (
                          row.name
                        )}
                      </td>
                      <td className={productStyles.td}>
                        {isEditing ? (
                          <input
                            className={productStyles.formInput}
                            value={editPickup}
                            onChange={(e) => setEditPickup(e.target.value)}
                          />
                        ) : (
                          <code className={styles.pickupCode}>{row.pickup_location}</code>
                        )}
                      </td>
                      <td className={productStyles.td}>{row.total_products ?? 0}</td>
                      <td className={productStyles.td}>{row.total_orders ?? 0}</td>
                      <td className={productStyles.td}>{formatMoney(row.total_profit)}</td>
                      <td className={productStyles.td}>
                        {isEditing ? (
                          <div className={styles.rowActions}>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              disabled={saving}
                              onClick={() => saveEdit(row.id)}
                              title="Save"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              onClick={cancelEdit}
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className={productStyles.secondaryBtn}
                            onClick={() => startEdit(row)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
