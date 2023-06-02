import axios from 'axios';
import queryString from 'query-string';
import { CustomerSegmentMemberInterface } from 'interfaces/customer-segment-member';
import { GetQueryInterface } from '../../interfaces';

export const getCustomerSegmentMembers = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/customer-segment-members${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCustomerSegmentMember = async (customerSegmentMember: CustomerSegmentMemberInterface) => {
  const response = await axios.post('/api/customer-segment-members', customerSegmentMember);
  return response.data;
};

export const updateCustomerSegmentMemberById = async (
  id: string,
  customerSegmentMember: CustomerSegmentMemberInterface,
) => {
  const response = await axios.put(`/api/customer-segment-members/${id}`, customerSegmentMember);
  return response.data;
};

export const getCustomerSegmentMemberById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/customer-segment-members/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteCustomerSegmentMemberById = async (id: string) => {
  const response = await axios.delete(`/api/customer-segment-members/${id}`);
  return response.data;
};
