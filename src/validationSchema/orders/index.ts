import * as yup from 'yup';
import { orderItemValidationSchema } from 'validationSchema/order-items';

export const orderValidationSchema = yup.object().shape({
  status: yup.string().required(),
  customer_id: yup.string().nullable().required(),
  store_id: yup.string().nullable().required(),
  order_item: yup.array().of(orderItemValidationSchema),
});
