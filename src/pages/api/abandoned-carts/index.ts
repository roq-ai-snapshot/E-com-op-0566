import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { abandonedCartValidationSchema } from 'validationSchema/abandoned-carts';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getAbandonedCarts();
    case 'POST':
      return createAbandonedCart();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getAbandonedCarts() {
    const data = await prisma.abandoned_cart
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'abandoned_cart'));
    return res.status(200).json(data);
  }

  async function createAbandonedCart() {
    await abandonedCartValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.abandoned_cart_item?.length > 0) {
      const create_abandoned_cart_item = body.abandoned_cart_item;
      body.abandoned_cart_item = {
        create: create_abandoned_cart_item,
      };
    } else {
      delete body.abandoned_cart_item;
    }
    const data = await prisma.abandoned_cart.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
