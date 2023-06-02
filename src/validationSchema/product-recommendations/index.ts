import * as yup from 'yup';

export const productRecommendationValidationSchema = yup.object().shape({
  customer_id: yup.string().nullable().required(),
  inventory_id: yup.string().nullable().required(),
});
