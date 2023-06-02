import axios from 'axios';
import queryString from 'query-string';
import { AbandonedCartInterface } from 'interfaces/abandoned-cart';
import { GetQueryInterface } from '../../interfaces';

export const getAbandonedCarts = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/abandoned-carts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAbandonedCart = async (abandonedCart: AbandonedCartInterface) => {
  const response = await axios.post('/api/abandoned-carts', abandonedCart);
  return response.data;
};

export const updateAbandonedCartById = async (id: string, abandonedCart: AbandonedCartInterface) => {
  const response = await axios.put(`/api/abandoned-carts/${id}`, abandonedCart);
  return response.data;
};

export const getAbandonedCartById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/abandoned-carts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAbandonedCartById = async (id: string) => {
  const response = await axios.delete(`/api/abandoned-carts/${id}`);
  return response.data;
};
