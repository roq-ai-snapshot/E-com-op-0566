import * as yup from 'yup';
import { abandonedCartItemValidationSchema } from 'validationSchema/abandoned-cart-items';

export const abandonedCartValidationSchema = yup.object().shape({
  customer_id: yup.string().nullable().required(),
  store_id: yup.string().nullable().required(),
  abandoned_cart_item: yup.array().of(abandonedCartItemValidationSchema),
});
