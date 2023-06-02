import { OrderInterface } from 'interfaces/order';
import { InventoryInterface } from 'interfaces/inventory';

export interface OrderItemInterface {
  id?: string;
  order_id: string;
  inventory_id: string;
  quantity: number;

  order?: OrderInterface;
  inventory?: InventoryInterface;
  _count?: {};
}
