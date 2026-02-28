import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { CartPage } from './pages/CartPage';
import { CatalogPage } from './pages/CatalogPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OrderCompletePage } from './pages/OrderCompletePage';
import { OrderPage } from './pages/OrderPage';
import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate replace to="/catalog" /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'order', element: <OrderPage /> },
      { path: 'order/complete', element: <OrderCompletePage /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
