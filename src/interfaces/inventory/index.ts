import { AbandonedCartItemInterface } from 'interfaces/abandoned-cart-item';
import { OrderItemInterface } from 'interfaces/order-item';
import { ProductRecommendationInterface } from 'interfaces/product-recommendation';
import { StoreInterface } from 'interfaces/store';

export interface InventoryInterface {
  id?: string;
  product_name: string;
  quantity: number;
  store_id: string;
  abandoned_cart_item?: AbandonedCartItemInterface[];
  order_item?: OrderItemInterface[];
  product_recommendation?: ProductRecommendationInterface[];
  store?: StoreInterface;
  _count?: {
    abandoned_cart_item?: number;
    order_item?: number;
    product_recommendation?: number;
  };
}
