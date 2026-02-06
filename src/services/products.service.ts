import prisma from "../prisma";
import { CreateProductDto } from "../dtos/products/create-product.dto";
import { UpdateProductDto } from "../dtos/products/update-product.dto";
import { formatError } from "../utils/errors";

export class ProductService {
  static async getByIdAndClient(id: string, clientId: string) {
    try {
      const product = await prisma.product.findFirst({
        where: { id, clientId },
      });

      if (!product) {
        throw new Error("Product not found for this client or does not exist");
      }

      return product;
    } catch (error) {
      throw new Error(formatError(`Failed to fetch product ${id}`, error));
    }
  }

  static async createNewProduct(data: CreateProductDto, clientId: string) {
    try {
      return await prisma.product.create({ data: { ...data, clientId } });
    } catch (error) {
      throw new Error(formatError(`Failed to create product for client ${clientId}`, error));
    }
  }

  static async updateProduct(id: string, clientId: string, data: UpdateProductDto) {
    try {
      await this.getByIdAndClient(id, clientId);

      return await prisma.product.update({ where: { id }, data });
    } catch (error) {
      throw new Error(formatError(`Failed to update product ${id}`, error));
    }
  }

  static async deleteProduct(id: string, clientId: string) {
    try {
      await this.getByIdAndClient(id, clientId);

      return await prisma.product.delete({ where: { id } });
    } catch (error) {
      throw new Error(formatError(`Failed to delete product ${id}`, error));
    }
  }

  static async listByClient(clientId: string) {
    try {
      return await prisma.product.findMany({ where: { clientId } });
    } catch (error) {
      throw new Error(formatError(`Failed to list products for client ${clientId}`, error));
    }
  }
}
