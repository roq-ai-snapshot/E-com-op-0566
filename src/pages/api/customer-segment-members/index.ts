import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { customerSegmentMemberValidationSchema } from 'validationSchema/customer-segment-members';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCustomerSegmentMembers();
    case 'POST':
      return createCustomerSegmentMember();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCustomerSegmentMembers() {
    const data = await prisma.customer_segment_member
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'customer_segment_member'));
    return res.status(200).json(data);
  }

  async function createCustomerSegmentMember() {
    await customerSegmentMemberValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.customer_segment_member.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
