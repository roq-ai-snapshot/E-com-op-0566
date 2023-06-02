import { AbandonedCartInterface } from 'interfaces/abandoned-cart';
import { CustomerSegmentInterface } from 'interfaces/customer-segment';
import { InventoryInterface } from 'interfaces/inventory';
import { OrderInterface } from 'interfaces/order';
import { UserInterface } from 'interfaces/user';

export interface StoreInterface {
  id?: string;
  name: string;
  owner_id: string;
  abandoned_cart?: AbandonedCartInterface[];
  customer_segment?: CustomerSegmentInterface[];
  inventory?: InventoryInterface[];
  order?: OrderInterface[];
  user?: UserInterface;
  _count?: {
    abandoned_cart?: number;
    customer_segment?: number;
    inventory?: number;
    order?: number;
  };
}
