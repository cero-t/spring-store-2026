import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, storeClient } from '../api/storeClient';
import { loadCart } from '../features/cart/cartSession';
import type { CartDetail, CartItem } from '../types';

export function CartPage() {
  const [cart, setCart] = useState<CartDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyItem, setBusyItem] = useState<number | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const detail = await loadCart();
      setCart(detail);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to load cart';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const addOne = async (item: CartItem) => {
    if (!cart) return;
    setBusyItem(item.itemId);
    try {
      const updated = await storeClient.addCartItem(cart.cartId, { itemId: item.itemId, quantity: 1 });
      setCart(updated);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to update quantity';
      setError(msg);
    } finally {
      setBusyItem(null);
    }
  };

  const remove = async (item: CartItem) => {
    if (!cart) return;
    setBusyItem(item.itemId);
    try {
      const updated = await storeClient.removeCartItem(cart.cartId, item.itemId);
      setCart(updated);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to remove item';
      setError(msg);
    } finally {
      setBusyItem(null);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading cart...
      </div>
    );
  }

  return (
    <section>
      <h2 className="page-title">Cart</h2>
      {error && <p className="error">{error}</p>}
      {cart && cart.items.length > 0 ? (
        <>
          <div className="cart-table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.itemId}>
                    <td><span className="item-name">{item.name}</span></td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td><span className="item-qty">{item.quantity}</span></td>
                    <td>
                      <div className="item-actions">
                        <button className="btn-sm btn-ghost" disabled={busyItem === item.itemId} onClick={() => addOne(item)} type="button">
                          +1
                        </button>
                        <button className="btn-sm btn-outline-danger" disabled={busyItem === item.itemId} onClick={() => remove(item)} type="button">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cart-summary">
            <span className="total">Total: ${cart.total.toFixed(2)}</span>
            <Link className="button-link" to="/order">
              Proceed to checkout
            </Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </div>
          <h3>Your cart is empty</h3>
          <p>Browse the catalog and add some items.</p>
          <Link className="button-link" to="/catalog">
            Browse catalog
          </Link>
        </div>
      )}
    </section>
  );
}
