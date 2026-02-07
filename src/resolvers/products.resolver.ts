import { ProductService } from "../services/products.service";
import { ProductImageServices } from "../services/product-image.service";
import { UploadServices } from "../services/upload.service";
import { validateDto } from "../utils/validations";
import { getAuthenticatedClient } from "../utils/auth";
import { GetProductDto } from "../dtos/products/get-product.dto";
import { GraphQLContext } from "../types/context";
import { CreateProductDto } from "../dtos/products/create-product.dto";
import { UpdateProductDto } from "../dtos/products/update-product.dto";
export { typeDefs } from "../schema/products.schema";

// Resolvers
export const resolvers = {
  Product: {
    async images(parent: { id: string }) {
      return ProductImageServices.findByProduct(parent.id);
    },
  },
  Query: {
    async getProducts(_: unknown, __: unknown, context: GraphQLContext) {
      const apiKey = getAuthenticatedClient(context);

      return ProductService.listByClient(apiKey.clientId);
    },
    async getProductById(
      _: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) {
      const apiKey = getAuthenticatedClient(context);
      const validatedData = await validateDto(GetProductDto, args);

      return ProductService.getByIdAndClient(validatedData.id, apiKey.clientId);
    },
  },
  Mutation: {
    async createProduct(_: unknown, args: any, context: GraphQLContext) {
      const apiKey = getAuthenticatedClient(context);
      const validatedData = await validateDto(CreateProductDto, args.input);

      return ProductService.createNewProduct(validatedData, apiKey.clientId);
    },
    async updateProduct(
      _: unknown,
      args: { id: string; input: any },
      context: GraphQLContext,
    ) {
      const apiKey = getAuthenticatedClient(context);
      const validatedData = await validateDto(UpdateProductDto, args.input);

      return ProductService.updateProduct(
        args.id,
        apiKey.clientId,
        validatedData,
      );
    },
    async deleteProduct(
      _: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) {
      const apiKey = getAuthenticatedClient(context);
      const validatedData = await validateDto(GetProductDto, args);

      return ProductService.deleteProduct(validatedData.id, apiKey.clientId);
    },
    async generateUploadUrl(
      _: unknown,
      args: { filename: string },
      context: GraphQLContext,
    ) {
      getAuthenticatedClient(context);

      return UploadServices.generateSignedUrl(args.filename);
    },
    async createProductImage(
      _: unknown,
      args: { productId: string; publicId: string },
      context: GraphQLContext,
    ) {
      const apiKey = getAuthenticatedClient(context);

      return ProductImageServices.create(
        args.productId,
        args.publicId,
        apiKey.clientId,
      );
    },
    async deleteProductImage(
      _: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) {
      const apiKey = getAuthenticatedClient(context);

      return ProductImageServices.delete(args.id, apiKey.clientId);
    },
  },
};
