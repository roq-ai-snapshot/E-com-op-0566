import * as yup from 'yup';
import { abandonedCartValidationSchema } from 'validationSchema/abandoned-carts';
import { customerSegmentValidationSchema } from 'validationSchema/customer-segments';
import { inventoryValidationSchema } from 'validationSchema/inventories';
import { orderValidationSchema } from 'validationSchema/orders';

export const storeValidationSchema = yup.object().shape({
  name: yup.string().required(),
  owner_id: yup.string().nullable().required(),
  abandoned_cart: yup.array().of(abandonedCartValidationSchema),
  customer_segment: yup.array().of(customerSegmentValidationSchema),
  inventory: yup.array().of(inventoryValidationSchema),
  order: yup.array().of(orderValidationSchema),
});
