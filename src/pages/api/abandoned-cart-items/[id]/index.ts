import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { abandonedCartItemValidationSchema } from 'validationSchema/abandoned-cart-items';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.abandoned_cart_item
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getAbandonedCartItemById();
    case 'PUT':
      return updateAbandonedCartItemById();
    case 'DELETE':
      return deleteAbandonedCartItemById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAbandonedCartItemById() {
    const data = await prisma.abandoned_cart_item.findFirst(convertQueryToPrismaUtil(req.query, 'abandoned_cart_item'));
    return res.status(200).json(data);
  }

  async function updateAbandonedCartItemById() {
    await abandonedCartItemValidationSchema.validate(req.body);
    const data = await prisma.abandoned_cart_item.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteAbandonedCartItemById() {
    const data = await prisma.abandoned_cart_item.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
