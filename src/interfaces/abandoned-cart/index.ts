import { AbandonedCartItemInterface } from 'interfaces/abandoned-cart-item';
import { UserInterface } from 'interfaces/user';
import { StoreInterface } from 'interfaces/store';

export interface AbandonedCartInterface {
  id?: string;
  customer_id: string;
  store_id: string;
  abandoned_cart_item?: AbandonedCartItemInterface[];
  user?: UserInterface;
  store?: StoreInterface;
  _count?: {
    abandoned_cart_item?: number;
  };
}
