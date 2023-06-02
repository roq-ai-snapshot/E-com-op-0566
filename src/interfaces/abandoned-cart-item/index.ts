import { AbandonedCartInterface } from 'interfaces/abandoned-cart';
import { InventoryInterface } from 'interfaces/inventory';

export interface AbandonedCartItemInterface {
  id?: string;
  cart_id: string;
  inventory_id: string;
  quantity: number;

  abandoned_cart?: AbandonedCartInterface;
  inventory?: InventoryInterface;
  _count?: {};
}
