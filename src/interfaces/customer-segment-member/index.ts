import { UserInterface } from 'interfaces/user';
import { CustomerSegmentInterface } from 'interfaces/customer-segment';

export interface CustomerSegmentMemberInterface {
  id?: string;
  customer_id: string;
  segment_id: string;

  user?: UserInterface;
  customer_segment?: CustomerSegmentInterface;
  _count?: {};
}
