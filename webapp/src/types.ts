export type CatalogItem = {
  id: number;
  name: string;
  media: string;
  author: string;
  unitPrice: number;
  release: string;
  image: string;
  inStock: boolean;
};

export type CartOverview = {
  cartId: number;
  items: Record<number, number>;
};

export type CartEvent = {
  itemId: number;
  quantity: number;
};

export type CartItem = {
  itemId: number;
  name: string;
  author: string;
  unitPrice: number;
  release: string;
  image: string;
  quantity: number;
};

export type CartDetail = {
  cartId: number;
  items: CartItem[];
  total: number;
};

export type OrderRequest = {
  name: string;
  address: string;
  telephone: string;
  mailAddress: string;
  cardNumber: string;
  cardExpire: string;
  cardName: string;
  cartId: number;
};
