import { UserInterface } from 'interfaces/user';
import { InventoryInterface } from 'interfaces/inventory';

export interface ProductRecommendationInterface {
  id?: string;
  customer_id: string;
  inventory_id: string;

  user?: UserInterface;
  inventory?: InventoryInterface;
  _count?: {};
}
