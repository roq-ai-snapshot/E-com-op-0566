import axios from 'axios';
import queryString from 'query-string';
import { AbandonedCartItemInterface } from 'interfaces/abandoned-cart-item';
import { GetQueryInterface } from '../../interfaces';

export const getAbandonedCartItems = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/abandoned-cart-items${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createAbandonedCartItem = async (abandonedCartItem: AbandonedCartItemInterface) => {
  const response = await axios.post('/api/abandoned-cart-items', abandonedCartItem);
  return response.data;
};

export const updateAbandonedCartItemById = async (id: string, abandonedCartItem: AbandonedCartItemInterface) => {
  const response = await axios.put(`/api/abandoned-cart-items/${id}`, abandonedCartItem);
  return response.data;
};

export const getAbandonedCartItemById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/abandoned-cart-items/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAbandonedCartItemById = async (id: string) => {
  const response = await axios.delete(`/api/abandoned-cart-items/${id}`);
  return response.data;
};
