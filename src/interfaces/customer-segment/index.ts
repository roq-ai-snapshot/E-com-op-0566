import { CustomerSegmentMemberInterface } from 'interfaces/customer-segment-member';
import { StoreInterface } from 'interfaces/store';

export interface CustomerSegmentInterface {
  id?: string;
  name: string;
  store_id: string;
  customer_segment_member?: CustomerSegmentMemberInterface[];
  store?: StoreInterface;
  _count?: {
    customer_segment_member?: number;
  };
}
