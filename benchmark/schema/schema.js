import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} from "graphql";
import {
  getUsersBenchmark,
  createProductBenchmark,
  getProductBoughtByUserBenchmark,
  getProductBoughtByUser,
} from "../functions/loadBenchmark.js";
import {
  b_getUsers_GraphQL,
  b_createProduct_GraphQL,
  b_getProductBoughtByUser_GraphQL,
} from "../functions/sequentialBenchmark.js";

const returnMessage = new GraphQLObjectType({
  name: "returnMessage",
  description: "this represents a return message",
  fields: () => ({
    message: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  description: "This is the root query",
  fields: () => ({
    loadB_getUsers_GraphQL: {
      type: returnMessage,
      args: {},
      resolve: () => getUsersBenchmark(),
    },
    sequentialB_getUsers_GraphQL: {
      type: returnMessage,
      args: {},
      resolve: () => b_getUsers_GraphQL(),
    },
    sequentialB_getProductBoughtByUser_GraphQL: {
      type: returnMessage,
      args: {},
      resolve: () => b_getProductBoughtByUser_GraphQL(),
    },
    loadB_getProductBoughtByUser_GraphQL: {
      type: returnMessage,
      args: {},
      resolve: () => getProductBoughtByUserBenchmark(),
    },
    getProductBoughtByUser: {
      type: returnMessage,
      args: {},
      resolve: () => getProductBoughtByUser(),
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "This is the root mutation",
  fields: () => ({
    sequentialB_createProduct_GraphQL: {
      type: returnMessage,
      args: {},
      resolve: () => b_createProduct_GraphQL(),
    },
    loadB_createProduct_GraphQL: {
      type: returnMessage,
      args: {},
      resolve: () => createProductBenchmark(),
    },
  }),
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

export default schema;
