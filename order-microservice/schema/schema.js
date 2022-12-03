import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLFloat,
} from "graphql";
import { startInstance } from "../functions/camunda.js";
import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  getUserOrders,
  getProductOrders,
} from "../functions/functions.js";

const productOrderType = new GraphQLObjectType({
  name: "productOrder",
  description: "This represents a product saved in order",
  fields: () => ({
    productid: { type: GraphQLString },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLInt },
  }),
});

const productOrderInput = new GraphQLInputObjectType({
  name: "productOrderInput",
  description: "This represents a product input",
  fields: () => ({
    productid: { type: GraphQLString },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLInt },
  }),
});

const orderType = new GraphQLObjectType({
  name: "Order",
  description: "This represents an order",
  fields: () => ({
    userid: { type: GraphQLString },
    products: { type: new GraphQLList(productOrderType) },
    total: { type: GraphQLFloat },
    status: { type: GraphQLString },
    _id: { type: GraphQLString },
  }),
});

const orderTypeInput = new GraphQLInputObjectType({
  name: "OrderInput",
  description: "This represents an order input for camunda",
  fields: () => ({
    userid: { type: GraphQLString },
    products: { type: new GraphQLList(productOrderInput) },
  }),
});

const returnMessage = new GraphQLObjectType({
  name: "returnMessage",
  description: "this represents a return message",
  fields: () => ({
    message: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  description: "All queries",
  fields: () => ({
    orders: {
      type: new GraphQLList(orderType),
      description: "List all orders",
      resolve: () => getAllOrders(),
    },
    order: {
      type: orderType,
      description: "A single order",
      args: {
        _id: { type: GraphQLString },
      },
      resolve: (parent, args) => getOrder(args._id),
    },
    orderByUser: {
      type: new GraphQLList(orderType),
      description: "Get orders by user",
      args: {
        userid: { type: GraphQLString },
      },
      resolve: (parent, args) => getUserOrders(args.userid),
    },
    orderByProduct: {
      type: new GraphQLList(orderType),
      description: "Get orders by product",
      args: {
        productid: { type: GraphQLString },
      },
      resolve: (parent, args) => getProductOrders(args.productid),
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "All mutations",
  fields: () => ({
    createOrder: {
      type: orderType,
      description: "create order",
      args: {
        userid: { type: GraphQLNonNull(GraphQLString) },
        products: {
          type: new GraphQLList(GraphQLNonNull(productOrderInput)),
        },
        total: { type: GraphQLNonNull(GraphQLInt) },
        status: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parents, args) => createOrder(args),
    },
    updateOrderStatus: {
      type: orderType,
      description: "update order status",
      args: {
        _id: { type: GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => updateOrderStatus(args._id, args.status),
    },
    startOrder: {
      type: returnMessage,
      description: "Start order with camunda",
      args: {
        userid: { type: GraphQLString },
        order: { type: orderTypeInput },
        ptype: { type: GraphQLString },
      },
      resolve: (parent, args) => startInstance(args),
    },
  }),
});

const schema = new GraphQLSchema({
  schema: orderType,
  query: Query,
  mutation: Mutation,
});

export default schema;
