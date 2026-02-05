import { gql } from 'apollo-server-express';
import { ProductService } from '../services/products.service';
import { validateDto } from '../utils/validations';
import { GetProductDto } from '../dtos/products/get-product.dto';
import { GraphQLContext } from '../types/context';

// GraphQL typeDefs
export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    stock: Int!
    price: Float!
    clientId: ID!
    createdAt: String
    updatedAt: String
  }

  type Query {
    getProductById(id: ID!): Product
  }
`;

// Resolvers
export const resolvers = {
  Query: {
    async getProductById(_: unknown, args: { id: string }, context: GraphQLContext) {
      const { apiKey } = context;

      if (!apiKey) {
        throw new Error('Missing or invalid API key');
      }

      await validateDto(GetProductDto, args);

      const product = await ProductService.getByIdAndClient(args.id, apiKey.clientId);

      if (!product) {
        throw new Error('Product not found for this client or does not exist');
      }

      return product;
    },
  },
};
