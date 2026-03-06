import { Link } from 'react-router-dom';

export function OrderCompletePage() {
  return (
    <div className="success-state">
      <div className="success-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2>Order Complete!</h2>
      <p>Thank you for your purchase. Your order has been placed successfully.</p>
      <Link className="button-link" to="/catalog">
        Continue shopping
      </Link>
    </div>
  );
}
