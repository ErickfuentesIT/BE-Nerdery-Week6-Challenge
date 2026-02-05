import prisma from '../prisma';

export class ProductService {
  static async getById(id: string) {
    try {
      return await prisma.product.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to fetch product ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getByIdAndClient(id: string, clientId: string) {
    try {
      return await prisma.product.findFirst({
        where: { id, clientId },
      });
    } catch (error) {
      throw new Error(`Failed to fetch product ${id} for client ${clientId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
