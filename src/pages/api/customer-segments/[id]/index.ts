import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { customerSegmentValidationSchema } from 'validationSchema/customer-segments';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.customer_segment
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCustomerSegmentById();
    case 'PUT':
      return updateCustomerSegmentById();
    case 'DELETE':
      return deleteCustomerSegmentById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCustomerSegmentById() {
    const data = await prisma.customer_segment.findFirst(convertQueryToPrismaUtil(req.query, 'customer_segment'));
    return res.status(200).json(data);
  }

  async function updateCustomerSegmentById() {
    await customerSegmentValidationSchema.validate(req.body);
    const data = await prisma.customer_segment.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteCustomerSegmentById() {
    const data = await prisma.customer_segment.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
