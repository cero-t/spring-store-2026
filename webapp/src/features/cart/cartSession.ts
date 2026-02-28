import { bffClient } from '../../api/bffClient';
import type { CartDetail } from '../../types';
import { clearStoredCartId, getStoredCartId, setStoredCartId } from './cartStorage';

export async function ensureCartId(): Promise<number> {
  const existing = getStoredCartId();
  if (existing !== null) {
    try {
      await bffClient.getCart(existing);
      return existing;
    } catch {
      clearStoredCartId();
    }
  }

  const created = await bffClient.createCart();
  setStoredCartId(created.cartId);
  return created.cartId;
}

export async function loadCart(): Promise<CartDetail> {
  const cartId = await ensureCartId();
  return bffClient.getCart(cartId);
}
