import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, bffClient } from '../api/bffClient';
import { ensureCartId } from '../features/cart/cartSession';
import type { CatalogItem } from '../types';

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export function CatalogPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await bffClient.getCatalog();
        setItems(data);
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : 'Failed to load catalog';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addToCart = async (itemId: number) => {
    setUpdatingId(itemId);
    setError(null);
    try {
      const cartId = await ensureCartId();
      await bffClient.addCartItem(cartId, { itemId, quantity: 1 });
      setShowAddedModal(true);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to add item';
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p>Loading catalog...</p>;

  return (
    <section>
      <h2>Catalog</h2>
      {error && <p className="error">{error}</p>}
      <div className="catalog-grid">
        {items.map((item) => (
          <article className="card" key={item.id}>
            <img alt={item.name} className="thumb" src={item.image} />
            <h3>{item.name}</h3>
            <p>{item.author}</p>
            <p>${item.unitPrice.toFixed(2)}</p>
            <p>Release: {formatDate(item.release)}</p>
            <button
              disabled={!item.inStock || updatingId === item.id}
              onClick={() => addToCart(item.id)}
              type="button"
            >
              {item.inStock ? 'Add to cart' : 'Out of stock'}
            </button>
          </article>
        ))}
      </div>
      {showAddedModal && (
        <div className="modal-backdrop" role="presentation">
          <div aria-live="polite" className="modal" role="dialog">
            <p>1 item has been added to your cart.</p>
            <div className="modal-actions">
              <button onClick={() => setShowAddedModal(false)} type="button">
                Continue shopping
              </button>
              <button onClick={() => navigate('/cart')} type="button">
                Go to cart
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
