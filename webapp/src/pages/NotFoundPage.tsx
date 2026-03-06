import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <p className="not-found-code">404</p>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link className="button-link" to="/catalog">
        Back to catalog
      </Link>
    </div>
  );
}
