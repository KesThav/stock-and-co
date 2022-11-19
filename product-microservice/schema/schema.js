import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} from "../functions/functions.js";

const imagesType = new GraphQLObjectType({
  name: "images",
  description: "This represents a product image",
  fields: () => ({
    url: { type: GraphQLString },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "Product",
  description: "This represents a product",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(GraphQLString) },
    averageRating: { type: GraphQLFloat },
    quantity: { type: GraphQLNonNull(GraphQLInt) },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    images: {
      type: new GraphQLList(imagesType),
    },
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  description: "All queries",
  fields: () => ({
    product: {
      type: ProductType,
      description: "A single product",
      args: {
        id: { type: GraphQLString },
      },
      resolve: (parent, args) => getProduct(args.id),
    },
    products: {
      type: new GraphQLList(ProductType),
      description: "List all products",
      resolve: () => getAllProducts(),
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "All mutations",
  fields: () => ({
    addProduct: {
      type: ProductType,
      description: "add product",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        type: { type: GraphQLNonNull(GraphQLString) },
        averageRating: { type: GraphQLInt },
        quantity: { type: GraphQLNonNull(GraphQLInt) },
        price: { type: GraphQLNonNull(GraphQLFloat) },
        images: {
          type: new GraphQLList(GraphQLString),
        },
      },
      resolve: (parent, args) => addProduct(args), //function to add a product
    },
    updateProduct: {
      type: ProductType,
      description: "update product",
      args: {
        _id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        type: { type: GraphQLString },
        averageRating: { type: GraphQLInt },
        quantity: { type: GraphQLInt },
        price: { type: GraphQLFloat },
        images: {
          type: new GraphQLList(GraphQLString),
        },
      },
      resolve: (parent, args) => updateProduct(args), //function to patch a product
    },
    deleteProduct: {
      type: ProductType,
      description: "delete product",
      args: {
        _id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => deleteProduct(args._id), //function to delete a product
    },
  }),
});

const schema = new GraphQLSchema({
  schema: ProductType,
  query: Query,
  mutation: Mutation,
});

export default schema;
