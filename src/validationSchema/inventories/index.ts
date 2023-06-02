import * as yup from 'yup';
import { abandonedCartItemValidationSchema } from 'validationSchema/abandoned-cart-items';
import { orderItemValidationSchema } from 'validationSchema/order-items';
import { productRecommendationValidationSchema } from 'validationSchema/product-recommendations';

export const inventoryValidationSchema = yup.object().shape({
  product_name: yup.string().required(),
  quantity: yup.number().integer().required(),
  store_id: yup.string().nullable().required(),
  abandoned_cart_item: yup.array().of(abandonedCartItemValidationSchema),
  order_item: yup.array().of(orderItemValidationSchema),
  product_recommendation: yup.array().of(productRecommendationValidationSchema),
});
