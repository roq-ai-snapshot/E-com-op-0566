import * as yup from 'yup';
import { customerSegmentMemberValidationSchema } from 'validationSchema/customer-segment-members';

export const customerSegmentValidationSchema = yup.object().shape({
  name: yup.string().required(),
  store_id: yup.string().nullable().required(),
  customer_segment_member: yup.array().of(customerSegmentMemberValidationSchema),
});
