import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { customerSegmentMemberValidationSchema } from 'validationSchema/customer-segment-members';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.customer_segment_member
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCustomerSegmentMemberById();
    case 'PUT':
      return updateCustomerSegmentMemberById();
    case 'DELETE':
      return deleteCustomerSegmentMemberById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCustomerSegmentMemberById() {
    const data = await prisma.customer_segment_member.findFirst(
      convertQueryToPrismaUtil(req.query, 'customer_segment_member'),
    );
    return res.status(200).json(data);
  }

  async function updateCustomerSegmentMemberById() {
    await customerSegmentMemberValidationSchema.validate(req.body);
    const data = await prisma.customer_segment_member.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteCustomerSegmentMemberById() {
    const data = await prisma.customer_segment_member.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
