import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, bffClient } from '../api/bffClient';
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
      const updated = await bffClient.addCartItem(cart.cartId, { itemId: item.itemId, quantity: 1 });
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
      const updated = await bffClient.removeCartItem(cart.cartId, item.itemId);
      setCart(updated);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to remove item';
      setError(msg);
    } finally {
      setBusyItem(null);
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <section>
      <h2>Cart</h2>
      {error && <p className="error">{error}</p>}
      {cart && cart.items.length > 0 ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.itemId}>
                  <td>{item.name}</td>
                  <td>${item.unitPrice.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button disabled={busyItem === item.itemId} onClick={() => addOne(item)} type="button">
                      +1
                    </button>{' '}
                    <button disabled={busyItem === item.itemId} onClick={() => remove(item)} type="button">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="total">Total: ${cart.total.toFixed(2)}</p>
          <Link className="button-link" to="/order">
            Go to order
          </Link>
        </>
      ) : (
        <>
          <p>Your cart is empty.</p>
          <Link className="button-link" to="/catalog">
            Back to catalog
          </Link>
        </>
      )}
    </section>
  );
}
