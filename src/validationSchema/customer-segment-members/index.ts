import * as yup from 'yup';

export const customerSegmentMemberValidationSchema = yup.object().shape({
  customer_id: yup.string().nullable().required(),
  segment_id: yup.string().nullable().required(),
});
