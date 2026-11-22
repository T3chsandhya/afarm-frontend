/** Variant pricing helpers for storefront cards and listings */

export function hasSelectableVariants(product) {
  return getLowestVariantOffer(product) != null;
}

/** Lowest-priced variant option (for “From ₹…” on cards). */
export function getLowestVariantOffer(product) {
  let best = null;
  for (const v of product?.variants ?? []) {
    for (const o of v?.options ?? []) {
      const price = Number(o?.price);
      if (!Number.isFinite(price) || price <= 0) continue;
      const mrp = Number(o?.mrp);
      if (!best || price < best.price) {
        best = {
          price,
          mrp: Number.isFinite(mrp) && mrp > 0 ? mrp : null,
        };
      }
    }
  }
  return best;
}