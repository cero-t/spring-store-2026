import { Link } from 'react-router-dom';

export function OrderCompletePage() {
  return (
    <section>
      <h2>Order Complete</h2>
      <p>Thank you for your purchase.</p>
      <Link className="button-link" to="/catalog">
        Back to catalog
      </Link>
    </section>
  );
}
