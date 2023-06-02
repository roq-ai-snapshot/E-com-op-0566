import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { inventoryValidationSchema } from 'validationSchema/inventories';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getInventories();
    case 'POST':
      return createInventory();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInventories() {
    const data = await prisma.inventory
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'inventory'));
    return res.status(200).json(data);
  }

  async function createInventory() {
    await inventoryValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.abandoned_cart_item?.length > 0) {
      const create_abandoned_cart_item = body.abandoned_cart_item;
      body.abandoned_cart_item = {
        create: create_abandoned_cart_item,
      };
    } else {
      delete body.abandoned_cart_item;
    }
    if (body?.order_item?.length > 0) {
      const create_order_item = body.order_item;
      body.order_item = {
        create: create_order_item,
      };
    } else {
      delete body.order_item;
    }
    if (body?.product_recommendation?.length > 0) {
      const create_product_recommendation = body.product_recommendation;
      body.product_recommendation = {
        create: create_product_recommendation,
      };
    } else {
      delete body.product_recommendation;
    }
    const data = await prisma.inventory.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
