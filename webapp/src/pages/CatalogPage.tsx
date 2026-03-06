import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, storeClient } from '../api/storeClient';
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
        const data = await storeClient.getCatalog();
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
      await storeClient.addCartItem(cartId, { itemId, quantity: 1 });
      setShowAddedModal(true);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Failed to add item';
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading catalog...
      </div>
    );
  }

  return (
    <section>
      <h2 className="page-title">Catalog</h2>
      {error && <p className="error">{error}</p>}
      <div className="catalog-grid">
        {items.map((item) => (
          <article className="card" key={item.id}>
            <img alt={item.name} className="thumb" src={item.image} />
            <div className="card-body">
              <h3>{item.name}</h3>
              <p className="card-author">{item.author}</p>
              <div className="card-meta">
                <span className="card-price">${item.unitPrice.toFixed(2)}</span>
                <span className="card-release">{formatDate(item.release)}</span>
              </div>
            </div>
            <div className="card-footer">
              <button
                disabled={!item.inStock || updatingId === item.id}
                onClick={() => addToCart(item.id)}
                type="button"
              >
                {updatingId === item.id
                  ? 'Adding...'
                  : item.inStock
                    ? 'Add to cart'
                    : 'Out of stock'}
              </button>
            </div>
          </article>
        ))}
      </div>
      {showAddedModal && (
        <div className="modal-backdrop" role="presentation">
          <div aria-live="polite" className="modal" role="dialog">
            <p className="modal-title">Added to cart</p>
            <p>1 item has been added to your cart.</p>
            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setShowAddedModal(false)} type="button">
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
