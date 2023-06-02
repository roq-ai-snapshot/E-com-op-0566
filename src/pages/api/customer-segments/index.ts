import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { customerSegmentValidationSchema } from 'validationSchema/customer-segments';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCustomerSegments();
    case 'POST':
      return createCustomerSegment();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCustomerSegments() {
    const data = await prisma.customer_segment
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'customer_segment'));
    return res.status(200).json(data);
  }

  async function createCustomerSegment() {
    await customerSegmentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.customer_segment_member?.length > 0) {
      const create_customer_segment_member = body.customer_segment_member;
      body.customer_segment_member = {
        create: create_customer_segment_member,
      };
    } else {
      delete body.customer_segment_member;
    }
    const data = await prisma.customer_segment.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
