import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { storeValidationSchema } from 'validationSchema/stores';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getStores();
    case 'POST':
      return createStore();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStores() {
    const data = await prisma.store
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'store'));
    return res.status(200).json(data);
  }

  async function createStore() {
    await storeValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.abandoned_cart?.length > 0) {
      const create_abandoned_cart = body.abandoned_cart;
      body.abandoned_cart = {
        create: create_abandoned_cart,
      };
    } else {
      delete body.abandoned_cart;
    }
    if (body?.customer_segment?.length > 0) {
      const create_customer_segment = body.customer_segment;
      body.customer_segment = {
        create: create_customer_segment,
      };
    } else {
      delete body.customer_segment;
    }
    if (body?.inventory?.length > 0) {
      const create_inventory = body.inventory;
      body.inventory = {
        create: create_inventory,
      };
    } else {
      delete body.inventory;
    }
    if (body?.order?.length > 0) {
      const create_order = body.order;
      body.order = {
        create: create_order,
      };
    } else {
      delete body.order;
    }
    const data = await prisma.store.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
