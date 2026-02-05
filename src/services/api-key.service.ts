import prisma from '../prisma';

export class ApiKeyService {
  static async findByKey(key: string) {
    try {
      return await prisma.apiKey.findUnique({
        where: { key },
        include: { client: true },
      });
    } catch (error) {
      throw new Error(`Failed to look up API key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async findByClientId(clientId: string) {
    try {
      return await prisma.apiKey.findFirst({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new Error(`Failed to find API key for client ${clientId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
