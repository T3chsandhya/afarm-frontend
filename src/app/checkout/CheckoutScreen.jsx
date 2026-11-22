'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Minus, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ShopNowButton from '@/components/ShopNowButton';
import { useCart } from '@/context/CartContext';
import authService from '@/lib/services/auth';
import paymentService from '@/lib/services/payments';
import shippingService from '@/lib/services/shipping';
import orderService from '@/lib/services/orders';
import promoService from '@/lib/services/promos';
import apiClient from '@/lib/api';
import { BRAND } from '@/lib/seo';
import {
  INDIAN_STATES,
  formatPrice,
  digitsOnly,
  buildCheckoutItems,
  submitPayuForm,
  loadRazorpayScript,
  formatVariantLabel,
} from './checkoutUtils';
import styles from './checkout.module.css';

const emptyForm = {
  name: '',
  mobile: '',
  email: '',
  line1: '',
  line2: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
};

const ADDRESS_KEYS = ['line1', 'line2', 'landmark', 'city', 'state', 'pincode'];

const emptyAddress = Object.fromEntries(ADDRESS_KEYS.map((k) => [k, '']));

const addressFromProfile = (profile) => {
  if (!profile?.address_line1 || !profile?.address_pincode) return null;
  return {
    line1: profile.address_line1 || '',
    line2: profile.address_line2 || '',
    landmark: profile.address_landmark || '',
    city: profile.address_city || '',
    state: profile.address_state || '',
    pincode: digitsOnly(profile.address_pincode).slice(0, 6),
  };
};

const formatAddressLines = (addr) => [
  [addr.line1, addr.line2].filter(Boolean).join(', '),
  addr.landmark ? `Landmark: ${addr.landmark}` : '',
  [addr.city, addr.state].filter(Boolean).join(', ') + (addr.pincode ? ` - ${addr.pincode}` : ''),
].filter(Boolean);

export default function CheckoutScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart, hydrated } =
    useCart();

  const [form, setForm] = useState(emptyForm);
  const [savedAddress, setSavedAddress] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('prepaid');
  const [promoCode, setPromoCode] = useState('');
  const [showPromoField, setShowPromoField] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoApplying, setPromoApplying] = useState(false);
  const [baseShippingCharge, setBaseShippingCharge] = useState(null);
  const [shippingCharge, setShippingCharge] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [step, setStep] = useState(1);
  const [pincodeLookupLoading, setPincodeLookupLoading] = useState(false);

  const CHECKOUT_STEPS = [
    { num: 1, label: 'Contact' },
    { num: 2, label: 'Pincode' },
    { num: 3, label: 'Address' },
    { num: 4, label: 'Payment' },
  ];

  const paymentFailed = searchParams.get('payment') === 'failed';
  const failReason = searchParams.get('reason');

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      router.replace('/account/login?next=/checkout');
      return;
    }

    const applyProfile = (profile, keepEmail) => {
      const saved = addressFromProfile(profile);
      setSavedAddress(saved);
      setUseSavedAddress(Boolean(saved));
      setForm((prev) => ({
        ...prev,
        name: profile?.name || prev.name,
        mobile: digitsOnly(profile?.phone || '').slice(-10) || prev.mobile,
        email: profile?.email?.includes('@mobile.')
          ? keepEmail
            ? prev.email
            : ''
          : profile?.email || prev.email,
        ...(saved || {}),
      }));
    };

    applyProfile(authService.getUser(), false);

    apiClient
      .get('/auth/me')
      .then((me) => applyProfile(me, true))
      .catch(() => {})
      .finally(() => setAuthChecked(true));

    paymentService
      .getConfig()
      .then(setPaymentConfig)
      .catch(() => setPaymentConfig({ configured: false }));
  }, [router]);

  useEffect(() => {
    if (paymentFailed) {
      toast.error(
        failReason
          ? `Payment failed (${failReason}). You can try again.`
          : 'Payment failed. You can try again.'
      );
    }
  }, [paymentFailed, failReason]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectSavedAddress = () => {
    if (!savedAddress) return;
    setUseSavedAddress(true);
    setForm((prev) => ({ ...prev, ...savedAddress }));
  };

  const startNewAddress = () => {
    setUseSavedAddress(false);
    setForm((prev) => ({ ...prev, ...emptyAddress }));
  };

  const fetchShipping = useCallback(async () => {
    if (!hydrated || items.length === 0) return;
    const pin = digitsOnly(form.pincode);
    if (pin.length !== 6 && !form.state) {
      setShippingCharge(null);
      return;
    }

    try {
      setShippingLoading(true);
      const quote = await shippingService.quote({
        subtotal: totalAmount,
        state: form.state || undefined,
        pincode: pin.length === 6 ? pin : undefined,
        payment_method: paymentMethod === 'cod' ? 'cod' : 'prepaid',
      });
      setShippingCharge(
        Number(
          paymentMethod === 'cod'
            ? quote.cod_shipping_charge ?? quote.shipping_charge
            : quote.prepaid_shipping_charge ?? quote.shipping_charge
        ) || 0
      );
      setBaseShippingCharge(
        Number(
          paymentMethod === 'cod'
            ? quote.cod_shipping_charge ?? quote.shipping_charge
            : quote.prepaid_shipping_charge ?? quote.shipping_charge
        ) || 0
      );
    } catch {
      setShippingCharge(null);
      setBaseShippingCharge(null);
    } finally {
      setShippingLoading(false);
    }
  }, [hydrated, items.length, form.pincode, form.state, totalAmount, paymentMethod]);

  useEffect(() => {
    if (!appliedPromo) return;
    if (appliedPromo.action_type === 'free_shipping') {
      setShippingCharge(0);
      return;
    }
    if (baseShippingCharge != null) {
      setShippingCharge(baseShippingCharge);
    }
  }, [appliedPromo, baseShippingCharge]);

  useEffect(() => {
    // Re-validate applied promo when cart/shipping changes
    if (!appliedPromo?.code) return undefined;
    let cancelled = false;
    promoService
      .validate({
        code: appliedPromo.code,
        subtotal: totalAmount,
        shipping_charge: baseShippingCharge ?? 0,
        phone: digitsOnly(form.mobile),
      })
      .then((data) => {
        if (cancelled) return;
        setAppliedPromo(data);
        if (data.action_type === 'free_shipping') {
          setShippingCharge(0);
        } else if (typeof data.shipping_charge === 'number') {
          setShippingCharge(data.shipping_charge);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setAppliedPromo(null);
        toast.error('Promo code is no longer valid');
      });
    return () => {
      cancelled = true;
    };
  }, [totalAmount, baseShippingCharge, form.mobile, appliedPromo?.code]);

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (code.length < 2) {
      toast.error('Enter a promo code');
      return;
    }
    try {
      setPromoApplying(true);
      const data = await promoService.validate({
        code,
        subtotal: totalAmount,
        shipping_charge: baseShippingCharge ?? shippingCharge ?? 0,
        phone: digitsOnly(form.mobile),
      });
      setAppliedPromo(data);
      setPromoCode(data.code || code);
      if (data.action_type === 'free_shipping') {
        setShippingCharge(0);
      } else if (typeof data.shipping_charge === 'number') {
        setShippingCharge(data.shipping_charge);
      }
      toast.success(data.message || 'Promo applied');
    } catch (err) {
      setAppliedPromo(null);
      toast.error(err.message || 'Invalid promo code');
    } finally {
      setPromoApplying(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setShowPromoField(false);
    if (baseShippingCharge != null) setShippingCharge(baseShippingCharge);
  };

  useEffect(() => {
    const timer = setTimeout(fetchShipping, 400);
    return () => clearTimeout(timer);
  }, [fetchShipping]);

  useEffect(() => {
    const pin = digitsOnly(form.pincode);
    if (pin.length !== 6 || useSavedAddress || step < 2) return undefined;

    let cancelled = false;
    setPincodeLookupLoading(true);
    shippingService
      .lookupPincode(pin)
      .then((details) => {
        if (cancelled || !details) return;
        setForm((prev) => ({
          ...prev,
          city: details.city || prev.city,
          state: details.state || prev.state,
        }));
      })
      .catch(() => {
        if (!cancelled && step === 2) {
          toast.error('Could not find city/state for this pincode');
        }
      })
      .finally(() => {
        if (!cancelled) setPincodeLookupLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [form.pincode, useSavedAddress, step]);

  const payableTotal = useMemo(() => {
    const ship = shippingCharge == null ? 0 : shippingCharge;
    const discount = Number(appliedPromo?.discount_amount) || 0;
    return Math.max(0, totalAmount - discount + ship);
  }, [totalAmount, shippingCharge, appliedPromo]);

  const validateStep1 = () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      toast.error('Please enter your full name');
      return false;
    }
    if (digitsOnly(form.mobile).length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (digitsOnly(form.pincode).length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    if (pincodeLookupLoading) {
      toast.error('Looking up city and state…');
      return false;
    }
    if (!form.city.trim() || !form.state.trim()) {
      toast.error('Enter a valid pincode to load city and state');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!form.line1.trim()) {
      toast.error('Please enter your address');
      return false;
    }
    if (!form.city.trim() || !form.state.trim()) {
      toast.error('City and state are required');
      return false;
    }
    if (digitsOnly(form.pincode).length !== 6) {
      toast.error('Please enter a valid pincode');
      return false;
    }
    return true;
  };

  const validate = () =>
    validateStep1() && validateStep2() && validateStep3();

  const goNextFromStep1 = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const confirmPincodeStep = () => {
    if (!validateStep2()) return;
    setStep(3);
  };

  const proceedFromAddress = () => {
    if (!validateStep3()) return;
    setStep(4);
  };

  const buildPayload = () => ({
    customer: {
      name: form.name.trim(),
      mobile: digitsOnly(form.mobile),
      email: form.email.trim() || null,
    },
    address: {
      line1: form.line1.trim(),
      line2: form.line2.trim() || null,
      landmark: form.landmark.trim() || null,
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: digitsOnly(form.pincode),
      country: 'India',
    },
    items: buildCheckoutItems(items),
    promo_code: appliedPromo?.code || promoCode.trim() || null,
  });

  const handleOnlinePay = async () => {
    const payload = buildPayload();
    const data = await paymentService.createOrder(payload);

    if (data.provider === 'payu' && data.payment_url && data.payu) {
      submitPayuForm(data.payment_url, data.payu);
      return;
    }

    if (data.provider === 'razorpay' && data.razorpay_order_id && data.key_id) {
      await loadRazorpayScript();
      setSubmitting(false);
      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: Math.round(Number(data.amount) * 100),
        currency: data.currency || 'INR',
        name: BRAND,
        description: 'Order payment',
        order_id: data.razorpay_order_id,
        prefill: {
          name: payload.customer.name,
          contact: payload.customer.mobile,
          email: payload.customer.email || undefined,
        },
        handler: async (response) => {
          try {
            const verified = await paymentService.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            const orderId = verified?.order_id || verified?.order?.order_id || '';
            router.push(orderId ? `/orders?order=${orderId}&payment=success` : '/orders?payment=success');
          } catch (err) {
            toast.error(err.message || 'Payment verification failed');
          }
        },
      });
      rzp.open();
      return;
    }

    throw new Error('Online payment could not be started. Please try again.');
  };

  const handleCodOrder = async () => {
    const payload = {
      ...buildPayload(),
      payment_method: 'cod',
    };
    const order = await orderService.createCodOrder(payload);
    clearCart();
    const orderId = order?.order_id || order?.id || '';
    router.push(orderId ? `/orders?order=${orderId}&payment=cod` : '/orders?payment=cod');
  };

  const handlePlaceOrder = async (e) => {
    e?.preventDefault?.();
    if (!validate() || submitting) return;

    if (paymentMethod === 'prepaid' && !paymentConfig?.configured) {
      toast.error('Online payment is not configured yet. Please choose Cash on Delivery.');
      return;
    }

    try {
      setSubmitting(true);
      if (paymentMethod === 'cod') {
        await handleCodOrder();
      } else {
        await handleOnlinePay();
      }
    } catch (err) {
      toast.error(err.message || 'Could not place order');
      setSubmitting(false);
    }
  };

  if (!hydrated || !authChecked) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.inner}>
            <p className={styles.loadingText}>Preparing checkout…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.inner}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>CHECKOUT</h1>
              <p className={styles.sectionSubtitle}>Your cart is empty</p>
            </div>
            <div className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>Nothing to checkout</h2>
              <p className={styles.emptyDesc}>Add products to your cart before placing an order.</p>
              <ShopNowButton href="/shop" variant="onLight" text="Continue Shopping" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>CHECKOUT</h1>
            <p className={styles.sectionSubtitle}>
              {totalItems} item{totalItems === 1 ? '' : 's'} · Secure order
            </p>
          </div>

          <div
            className={`${styles.layout} ${step === 4 ? styles.layoutStep4 : ''}`}
          >
            <div className={styles.formsColumn}>
              <nav className={styles.stepper} aria-label="Checkout progress">
                {CHECKOUT_STEPS.map(({ num, label }) => (
                  <div
                    key={num}
                    className={`${styles.stepItem} ${
                      step === num ? styles.stepItemActive : ''
                    } ${step > num ? styles.stepItemDone : ''}`}
                  >
                    <span className={styles.stepBadge}>{num}</span>
                    <span className={styles.stepLabel}>{label}</span>
                  </div>
                ))}
              </nav>

              {step === 1 && (
                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Step 1 — Contact details</h2>
                  <div className={styles.formGrid}>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label className={styles.label} htmlFor="co-name">
                        Full Name
                      </label>
                      <input
                        id="co-name"
                        className={styles.input}
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label className={styles.label} htmlFor="co-mobile">
                        Mobile Number
                      </label>
                      <div className={styles.phoneRow}>
                        <span className={styles.phonePrefix}>+91</span>
                        <input
                          id="co-mobile"
                          className={`${styles.input} ${styles.phoneInput}`}
                          inputMode="numeric"
                          value={form.mobile}
                          onChange={(e) =>
                            updateField('mobile', digitsOnly(e.target.value).slice(0, 10))
                          }
                        />
                      </div>
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label className={styles.label} htmlFor="co-email">
                        Email <span className={styles.optional}>(optional)</span>
                      </label>
                      <input
                        id="co-email"
                        type="email"
                        className={styles.input}
                        value={form.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className={styles.stepActions}>
                    <button type="button" className={styles.primaryBtn} onClick={goNextFromStep1}>
                      Next
                    </button>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Step 2 — Delivery pincode</h2>
                  <p className={styles.stepHint}>
                    Enter your pincode. City and state will be filled automatically.
                  </p>
                  <div className={styles.formGrid}>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label className={styles.label} htmlFor="co-pincode-step2">
                        Pincode
                      </label>
                      <input
                        id="co-pincode-step2"
                        className={styles.input}
                        inputMode="numeric"
                        value={form.pincode}
                        onChange={(e) =>
                          updateField('pincode', digitsOnly(e.target.value).slice(0, 6))
                        }
                        placeholder="6-digit pincode"
                        autoFocus
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="co-city-step2">
                        City
                      </label>
                      <input
                        id="co-city-step2"
                        className={`${styles.input} ${styles.inputReadonly}`}
                        value={pincodeLookupLoading ? 'Looking up…' : form.city}
                        readOnly
                        tabIndex={-1}
                        aria-readonly="true"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="co-state-step2">
                        State
                      </label>
                      <input
                        id="co-state-step2"
                        className={`${styles.input} ${styles.inputReadonly}`}
                        value={pincodeLookupLoading ? '…' : form.state}
                        readOnly
                        tabIndex={-1}
                        aria-readonly="true"
                      />
                    </div>
                  </div>
                  <div className={styles.stepActions}>
                    <button type="button" className={styles.secondaryBtn} onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button type="button" className={styles.primaryBtn} onClick={confirmPincodeStep}>
                      Confirm
                    </button>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className={styles.card}>
                  <h2 className={styles.cardTitle}>Step 3 — Delivery address</h2>
                  {savedAddress && (
                    <div className={styles.savedAddressBlock}>
                      <label
                        className={`${styles.payOption} ${
                          useSavedAddress ? styles.payOptionActive : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="addressChoice"
                          checked={useSavedAddress}
                          onChange={selectSavedAddress}
                        />
                        <span>
                          <strong>Saved address</strong>
                          {formatAddressLines(savedAddress).map((line) => (
                            <small key={line}>{line}</small>
                          ))}
                        </span>
                      </label>
                      <button
                        type="button"
                        className={`${styles.newAddressBtn} ${
                          !useSavedAddress ? styles.newAddressBtnActive : ''
                        }`}
                        onClick={startNewAddress}
                        aria-pressed={!useSavedAddress}
                      >
                        <Plus size={16} />
                        Or enter a new address
                      </button>
                    </div>
                  )}
                  {(!savedAddress || !useSavedAddress) && (
                    <div className={styles.formGrid}>
                      <div className={`${styles.field} ${styles.fullWidth}`}>
                        <label className={styles.label} htmlFor="co-line1">
                          Address
                        </label>
                        <input
                          id="co-line1"
                          className={styles.input}
                          value={form.line1}
                          onChange={(e) => updateField('line1', e.target.value)}
                          placeholder="House no., street, area"
                          autoFocus
                        />
                      </div>
                      <div className={`${styles.field} ${styles.fullWidth}`}>
                        <label className={styles.label} htmlFor="co-line2">
                          Address Line 2 <span className={styles.optional}>(optional)</span>
                        </label>
                        <input
                          id="co-line2"
                          className={styles.input}
                          value={form.line2}
                          onChange={(e) => updateField('line2', e.target.value)}
                        />
                      </div>
                      <div className={`${styles.field} ${styles.fullWidth}`}>
                        <label className={styles.label} htmlFor="co-landmark">
                          Landmark <span className={styles.optional}>(optional)</span>
                        </label>
                        <input
                          id="co-landmark"
                          className={styles.input}
                          value={form.landmark}
                          onChange={(e) => updateField('landmark', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                  <div className={`${styles.formGrid} ${styles.locationReview}`}>
                    <div className={styles.field}>
                      <label className={styles.label}>Pincode</label>
                      <input
                        className={`${styles.input} ${styles.inputReadonly}`}
                        value={form.pincode}
                        readOnly
                        aria-readonly="true"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label}>City</label>
                      <input
                        className={`${styles.input} ${styles.inputReadonly}`}
                        value={form.city}
                        readOnly
                        aria-readonly="true"
                      />
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label className={styles.label}>State</label>
                      <input
                        className={`${styles.input} ${styles.inputReadonly}`}
                        value={form.state}
                        readOnly
                        aria-readonly="true"
                      />
                    </div>
                  </div>
                  <div className={styles.stepActions}>
                    <button type="button" className={styles.secondaryBtn} onClick={() => setStep(2)}>
                      Back
                    </button>
                    <button type="button" className={styles.primaryBtn} onClick={proceedFromAddress}>
                      Proceed
                    </button>
                  </div>
                </section>
              )}

              {step === 4 && (
                <>
                  <section className={`${styles.card} ${styles.step4Title}`}>
                    <h2 className={styles.cardTitle}>Step 4 — Payment method</h2>
                  </section>
                  <section className={`${styles.card} ${styles.step4Pay}`}>
                    <div className={styles.payOptions}>
                      <label
                        className={`${styles.payOption} ${
                          paymentMethod === 'prepaid' ? styles.payOptionActive : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'prepaid'}
                          onChange={() => setPaymentMethod('prepaid')}
                        />
                        <span>
                          <strong>Pay Online</strong>
                          <small>
                            {paymentConfig?.configured
                              ? `Secure payment via ${
                                  paymentConfig.provider === 'razorpay' ? 'Razorpay' : 'PayU'
                                }`
                              : 'Online gateway not configured yet'}
                          </small>
                        </span>
                      </label>
                      <label
                        className={`${styles.payOption} ${
                          paymentMethod === 'cod' ? styles.payOptionActive : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                        <span>
                          <strong>Cash on Delivery</strong>
                          <small>Pay when your order arrives</small>
                        </span>
                      </label>
                    </div>
                    <div className={styles.stepActions}>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => setStep(3)}
                      >
                        Back
                      </button>
                      <ShopNowButton
                        as="button"
                        type="button"
                        text={
                          submitting
                            ? 'Please wait…'
                            : paymentMethod === 'cod'
                              ? 'Place COD Order'
                              : 'Pay Online'
                        }
                        variant="onLight"
                        disabled={submitting}
                        showArrow={!submitting}
                        onClick={handlePlaceOrder}
                      />
                    </div>
                  </section>
                </>
              )}
            </div>

            <aside className={styles.summaryPanel}>
              <h2 className={styles.summaryTitle}>Order summary</h2>

              <div className={styles.summaryItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    <div className={styles.summaryThumb}>
                      {item.image ? (
                        <img src={item.image} alt="" />
                      ) : (
                        <span>No img</span>
                      )}
                    </div>
                    <div className={styles.summaryItemInfo}>
                      <p className={styles.summaryItemName}>{item.name}</p>
                      {formatVariantLabel(item) && (
                        <p className={styles.summaryItemMeta}>{formatVariantLabel(item)}</p>
                      )}
                      <div className={styles.summaryItemActions}>
                        <div className={styles.summaryQtyControl}>
                          <button
                            type="button"
                            className={styles.summaryQtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className={styles.summaryQtyValue}>{item.quantity}</span>
                          <button
                            type="button"
                            className={styles.summaryQtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className={styles.summaryRemoveBtn}
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className={styles.summaryItemPrice}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {!showPromoField && !appliedPromo ? (
                <button
                  type="button"
                  className={styles.promoToggle}
                  onClick={() => setShowPromoField(true)}
                >
                  Enter promo code
                </button>
              ) : (
                <>
                  <div className={styles.promoRow}>
                    <input
                      className={styles.input}
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      disabled={Boolean(appliedPromo)}
                      autoFocus={showPromoField && !appliedPromo}
                    />
                    {appliedPromo ? (
                      <button type="button" className={styles.promoBtn} onClick={handleRemovePromo}>
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.promoBtn}
                        onClick={handleApplyPromo}
                        disabled={promoApplying}
                      >
                        {promoApplying ? '…' : 'Apply'}
                      </button>
                    )}
                  </div>
                  {appliedPromo && (
                    <p className={styles.promoApplied}>
                      {appliedPromo.message || 'Promo applied'}
                    </p>
                  )}
                </>
              )}

              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              {appliedPromo?.discount_amount > 0 && (
                <div className={styles.summaryRow}>
                  <span>Discount ({appliedPromo.code})</span>
                  <span>-{formatPrice(appliedPromo.discount_amount)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>
                  {shippingLoading
                    ? 'Calculating…'
                    : shippingCharge == null
                      ? 'Enter pincode'
                      : shippingCharge === 0
                        ? 'Free'
                        : formatPrice(shippingCharge)}
                </span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>{formatPrice(payableTotal)}</span>
              </div>

              <Link href="/cart" className={styles.backLink}>
                ← Back to cart
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
