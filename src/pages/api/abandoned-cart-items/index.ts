import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { abandonedCartItemValidationSchema } from 'validationSchema/abandoned-cart-items';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAbandonedCartItems();
    case 'POST':
      return createAbandonedCartItem();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAbandonedCartItems() {
    const data = await prisma.abandoned_cart_item
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'abandoned_cart_item'));
    return res.status(200).json(data);
  }

  async function createAbandonedCartItem() {
    await abandonedCartItemValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.abandoned_cart_item.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
