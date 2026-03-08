import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, storeClient } from '../api/storeClient';
import { clearStoredCartId } from '../features/cart/cartStorage';
import { loadCart } from '../features/cart/cartSession';
import type { CartDetail, OrderRequest } from '../types';

type OrderForm = Omit<OrderRequest, 'cartId'>;

const initialForm: OrderForm = {
  name: '',
  address: '',
  telephone: '',
  mailAddress: '',
  cardNumber: '',
  cardExpire: '',
  cardName: ''
};

function validate(form: OrderForm): string | null {
  if (Object.values(form).some((v) => !v.trim())) return 'All fields are required';
  if (!/^\S+@\S+\.\S+$/.test(form.mailAddress)) return 'Invalid mail address';
  if (!/^[0-9-]+$/.test(form.telephone)) return 'Invalid telephone';
  if (!/^\d+$/.test(form.cardNumber)) return 'Card number must contain only digits';
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpire)) return 'Card expire must be MM/yy';
  return null;
}

export function OrderPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDetail | null>(null);
  const [form, setForm] = useState<OrderForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const detail = await loadCart();
        setCart(detail);
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : 'Failed to load cart';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const validationError = useMemo(() => validate(form), [form]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!cart || cart.items.length === 0 || validationError) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await storeClient.checkout({ ...form, cartId: cart.cartId });
      clearStoredCartId();
      navigate('/order/complete', { replace: true });
    } catch (e) {
      if (e instanceof ApiError && e.status >= 500) {
        setServerError(true);
      } else {
        const msg = e instanceof ApiError ? e.message : 'Failed to place order';
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading order form...
      </div>
    );
  }

  return (
    <section>
      <h2 className="page-title">Checkout</h2>
      {error && <p className="error">{error}</p>}
      {cart && cart.items.length > 0 ? (
        <>
          <p className="order-total">Order total: ${cart.total.toFixed(2)}</p>
          <p className="demo-notice">
            This is a demo application. No real payment or email delivery will occur.
            You may enter any dummy values in all fields.
          </p>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-section">
              <h3 className="form-section-title">Shipping Information</h3>
              <div className="form-fields">
                <label>
                  Name
                  <input onChange={(e) => setForm({ ...form, name: e.target.value })} value={form.name} />
                </label>
                <label>
                  Address
                  <input onChange={(e) => setForm({ ...form, address: e.target.value })} value={form.address} />
                </label>
                <label>
                  Telephone
                  <input onChange={(e) => setForm({ ...form, telephone: e.target.value })} value={form.telephone} />
                </label>
                <label>
                  Email
                  <input
                    onChange={(e) => setForm({ ...form, mailAddress: e.target.value })}
                    type="email"
                    value={form.mailAddress}
                  />
                </label>
              </div>
            </div>
            <div className="form-section">
              <h3 className="form-section-title">Payment Details</h3>
              <div className="form-fields">
                <label>
                  Card Number
                  <input
                    onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                    value={form.cardNumber}
                  />
                </label>
                <label>
                  Expiry (MM/yy)
                  <input
                    onChange={(e) => setForm({ ...form, cardExpire: e.target.value })}
                    placeholder="MM/yy"
                    value={form.cardExpire}
                  />
                </label>
                <label>
                  Cardholder Name
                  <input
                    onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                    value={form.cardName}
                  />
                </label>
              </div>
            </div>
            {validationError && <p className="error">{validationError}</p>}
            <button disabled={submitting || Boolean(validationError)} type="submit">
              {submitting ? 'Placing order...' : 'Place order'}
            </button>
          </form>
        </>
      ) : (
        <div className="empty-state">
          <h3>Cart is empty</h3>
          <p>Please add items from the catalog before checking out.</p>
        </div>
      )}
      {serverError && (
        <div className="modal-backdrop" role="presentation">
          <div aria-live="polite" className="modal" role="dialog">
            <p className="modal-title">Order Failed</p>
            <p>A server error occurred. Please try again later.</p>
            <div className="modal-actions">
              <button onClick={() => setServerError(false)} type="button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
