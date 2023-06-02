import axios from 'axios';
import queryString from 'query-string';
import { ProductRecommendationInterface } from 'interfaces/product-recommendation';
import { GetQueryInterface } from '../../interfaces';

export const getProductRecommendations = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/product-recommendations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createProductRecommendation = async (productRecommendation: ProductRecommendationInterface) => {
  const response = await axios.post('/api/product-recommendations', productRecommendation);
  return response.data;
};

export const updateProductRecommendationById = async (
  id: string,
  productRecommendation: ProductRecommendationInterface,
) => {
  const response = await axios.put(`/api/product-recommendations/${id}`, productRecommendation);
  return response.data;
};

export const getProductRecommendationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/product-recommendations/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteProductRecommendationById = async (id: string) => {
  const response = await axios.delete(`/api/product-recommendations/${id}`);
  return response.data;
};
