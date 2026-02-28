import { NavLink, Outlet } from 'react-router-dom';

const activeStyle = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link active' : 'nav-link';

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Spring Store</h1>
        <nav className="main-nav">
          <NavLink className={activeStyle} to="/catalog">
            Catalog
          </NavLink>
          <NavLink className={activeStyle} to="/cart">
            Cart
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
