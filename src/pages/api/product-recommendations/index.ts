import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { productRecommendationValidationSchema } from 'validationSchema/product-recommendations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getProductRecommendations();
    case 'POST':
      return createProductRecommendation();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProductRecommendations() {
    const data = await prisma.product_recommendation
      .withAuthorization({
        userId: roqUserId,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'product_recommendation'));
    return res.status(200).json(data);
  }

  async function createProductRecommendation() {
    await productRecommendationValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.product_recommendation.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
