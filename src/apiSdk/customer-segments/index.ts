import axios from 'axios';
import queryString from 'query-string';
import { CustomerSegmentInterface } from 'interfaces/customer-segment';
import { GetQueryInterface } from '../../interfaces';

export const getCustomerSegments = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/customer-segments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCustomerSegment = async (customerSegment: CustomerSegmentInterface) => {
  const response = await axios.post('/api/customer-segments', customerSegment);
  return response.data;
};

export const updateCustomerSegmentById = async (id: string, customerSegment: CustomerSegmentInterface) => {
  const response = await axios.put(`/api/customer-segments/${id}`, customerSegment);
  return response.data;
};

export const getCustomerSegmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/customer-segments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCustomerSegmentById = async (id: string) => {
  const response = await axios.delete(`/api/customer-segments/${id}`);
  return response.data;
};
