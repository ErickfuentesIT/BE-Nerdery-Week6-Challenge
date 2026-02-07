import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    stock: Int!
    price: Int!
    clientId: ID!
    isActive: Boolean
    images: [ProductImage!]!
    createdAt: String
    updatedAt: String
  }

  type ProductImage {
    id: ID!
    productId: ID!
    url: String!
    publicId: String!
    createdAt: String
  }

  type SignedUrlResponse {
    signedUrl: String!
    publicId: String!
    contentType: String!
  }

  input CreateProductInput {
    name: String!
    description: String
    stock: Int
    price: Int!
  }

  input UpdateProductInput {
    name: String
    description: String
    stock: Int
    price: Int
    isActive: Boolean
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Product!
    generateUploadUrl(filename: String!): SignedUrlResponse!
    createProductImage(productId: ID!, publicId: String!): ProductImage!
    deleteProductImage(id: ID!): ProductImage!
  }

  type Query {
    getProducts: [Product!]!
    getProductById(id: ID!): Product
  }
`;
