import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { abandonedCartValidationSchema } from 'validationSchema/abandoned-carts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.abandoned_cart
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAbandonedCartById();
    case 'PUT':
      return updateAbandonedCartById();
    case 'DELETE':
      return deleteAbandonedCartById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAbandonedCartById() {
    const data = await prisma.abandoned_cart.findFirst(convertQueryToPrismaUtil(req.query, 'abandoned_cart'));
    return res.status(200).json(data);
  }

  async function updateAbandonedCartById() {
    await abandonedCartValidationSchema.validate(req.body);
    const data = await prisma.abandoned_cart.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteAbandonedCartById() {
    const data = await prisma.abandoned_cart.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
