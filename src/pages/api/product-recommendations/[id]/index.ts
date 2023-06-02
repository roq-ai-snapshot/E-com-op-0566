import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { productRecommendationValidationSchema } from 'validationSchema/product-recommendations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  await prisma.product_recommendation
    .withAuthorization({ userId: roqUserId })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getProductRecommendationById();
    case 'PUT':
      return updateProductRecommendationById();
    case 'DELETE':
      return deleteProductRecommendationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getProductRecommendationById() {
    const data = await prisma.product_recommendation.findFirst(
      convertQueryToPrismaUtil(req.query, 'product_recommendation'),
    );
    return res.status(200).json(data);
  }

  async function updateProductRecommendationById() {
    await productRecommendationValidationSchema.validate(req.body);
    const data = await prisma.product_recommendation.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteProductRecommendationById() {
    const data = await prisma.product_recommendation.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
