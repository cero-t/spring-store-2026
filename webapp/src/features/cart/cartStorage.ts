const CART_KEY = 'spring-store.cartId';

export function getStoredCartId(): number | null {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function setStoredCartId(cartId: number): void {
  localStorage.setItem(CART_KEY, String(cartId));
}

export function clearStoredCartId(): void {
  localStorage.removeItem(CART_KEY);
}
