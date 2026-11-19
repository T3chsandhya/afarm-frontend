'use client';

import styles from '@/app/admin/products/products.module.css';

const emptyColor = () => ({ name: '', hex: '#155d27' });

/** Product-level color editor (solid or multicolor). */
export default function ProductColorEditor({ colors = [], onChangeColors }) {
  const updateColor = (index, patch) => {
    onChangeColors(
      colors.map((c, i) => (i === index ? { ...c, ...patch } : c))
    );
  };

  const removeColor = (index) => {
    onChangeColors(colors.filter((_, i) => i !== index));
  };

  const addColor = () => {
    onChangeColors([...(colors || []), emptyColor()]);
  };

  return (
    <section className={styles.formSection}>
      <h2 className={styles.sectionTitle}>Color</h2>
      <p className={styles.formHint}>
        Add one color for a solid swatch, or multiple for a multicolor split on product cards
        and the product page.
      </p>

      <div className={styles.colorEditorList}>
        {(colors || []).map((c, index) => (
          <div key={index} className={styles.colorEditorRow}>
            <input
              type="color"
              className={styles.colorCircle}
              value={c.hex || '#155d27'}
              onChange={(e) => updateColor(index, { hex: e.target.value })}
              aria-label={`Color ${index + 1}`}
            />
            <input
              type="text"
              className={styles.formInput}
              placeholder="Color name (e.g. Brown)"
              value={c.name || ''}
              onChange={(e) => updateColor(index, { name: e.target.value })}
            />
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => removeColor(index)}
              aria-label="Remove color"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={styles.colorEditorActions}>
        <button type="button" className={styles.secondaryBtn} onClick={addColor}>
          {colors?.length ? 'Add another color (multicolor)' : 'Add color'}
        </button>
      </div>
    </section>
  );
}

export { emptyColor };
