import { storeClient } from '../../api/storeClient';
import type { CartDetail } from '../../types';
import { clearStoredCartId, getStoredCartId, setStoredCartId } from './cartStorage';

export async function ensureCartId(): Promise<number> {
  const existing = getStoredCartId();
  if (existing !== null) {
    try {
      await storeClient.getCart(existing);
      return existing;
    } catch {
      clearStoredCartId();
    }
  }

  const created = await storeClient.createCart();
  setStoredCartId(created.cartId);
  return created.cartId;
}

export async function loadCart(): Promise<CartDetail> {
  const cartId = await ensureCartId();
  return storeClient.getCart(cartId);
}
