import prisma from "../prisma";
import { UploadServices } from "./upload.service";
import { ProductService } from "./products.service";
import { formatError } from "../utils/errors";

export class ProductImageServices {
  static async create(productId: string, publicId: string, clientId: string) {
    try {
      await ProductService.getByIdAndClient(productId, clientId);

      const url = UploadServices.getPublicUrl(publicId);

      return await prisma.productImage.create({
        data: { productId, publicId, url },
      });
    } catch (error) {
      throw new Error(formatError(`Failed to insert image for product ${productId}`, error));
    }
  }

  static async findByProduct(productId: string) {
    try {
      return await prisma.productImage.findMany({ where: { productId } });
    } catch (error) {
      throw new Error(formatError(`Failed to find images for product ${productId}`, error));
    }
  }

  static async delete(id: string, clientId: string) {
    try {
      const image = await prisma.productImage.findUnique({ where: { id } });

      if (!image) throw new Error(`Image with ID ${id} not found`);

      await ProductService.getByIdAndClient(image.productId, clientId);

      await UploadServices.delete(image.publicId);

      return await prisma.productImage.delete({ where: { id } });
    } catch (error) {
      throw new Error(formatError(`Failed to delete image with ID ${id}`, error));
    }
  }
}
