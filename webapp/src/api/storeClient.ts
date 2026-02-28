import type { CartDetail, CartEvent, CartOverview, CatalogItem, OrderRequest } from '../types';

const baseUrl = import.meta.env.VITE_STORE_BASE_URL ?? 'http://localhost:9000';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  });

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, text || `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const storeClient = {
  getCatalog: () => request<CatalogItem[]>('/catalog'),
  createCart: () => request<CartOverview>('/cart', { method: 'POST' }),
  getCart: (cartId: number) => request<CartDetail>(`/cart/${cartId}`),
  addCartItem: (cartId: number, event: CartEvent) =>
    request<CartDetail>(`/cart/${cartId}`, {
      method: 'POST',
      body: JSON.stringify(event)
    }),
  removeCartItem: (cartId: number, itemId: number) =>
    request<CartDetail>(`/cart/${cartId}/${itemId}`, { method: 'DELETE' }),
  checkout: (orderRequest: OrderRequest) =>
    request<void>('/order', {
      method: 'POST',
      body: JSON.stringify(orderRequest)
    })
};
