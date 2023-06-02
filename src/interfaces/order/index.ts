import { OrderItemInterface } from 'interfaces/order-item';
import { UserInterface } from 'interfaces/user';
import { StoreInterface } from 'interfaces/store';

export interface OrderInterface {
  id?: string;
  customer_id: string;
  store_id: string;
  status: string;
  order_item?: OrderItemInterface[];
  user?: UserInterface;
  store?: StoreInterface;
  _count?: {
    order_item?: number;
  };
}
