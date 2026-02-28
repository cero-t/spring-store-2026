import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section>
      <h2>Page not found</h2>
      <Link className="button-link" to="/catalog">
        Back to catalog
      </Link>
    </section>
  );
}
