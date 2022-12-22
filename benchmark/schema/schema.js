import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
} from "graphql";
import { getUsersBenchmark } from "../functions/concurrentBenchmark.js";
import { b_getUsers, b_createProduct } from "../functions/parallelBenchmark.js";

const result = new GraphQLObjectType({
  name: "Result",
  description: "This represents the structure of the benchmark result",
  fields: () => ({
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    socketPath: { type: GraphQLString },
    connections: { type: GraphQLFloat },
    pipelining: { type: GraphQLFloat },
    duration: { type: GraphQLFloat },
    workers: { type: GraphQLFloat },
    sample: { type: GraphQLFloat },
    start: { type: GraphQLString },
    finish: { type: GraphQLString },
    errors: { type: GraphQLFloat },
    timeouts: { type: GraphQLFloat },
    non2xx: { type: GraphQLFloat },
    _1xx: { type: GraphQLFloat, resolve: (parent) => parent["1xx"] },
    _2xx: { type: GraphQLFloat, resolve: (parent) => parent["2xx"] },
    _3xx: { type: GraphQLFloat, resolve: (parent) => parent["3xx"] },
    _4xx: { type: GraphQLFloat, resolve: (parent) => parent["4xx"] },
    _5xx: { type: GraphQLFloat, resolve: (parent) => parent["5xx"] },
    latency: { type: latency },
    requests: { type: requests },
    throughput: { type: throughput },
    resets: { type: GraphQLFloat },
  }),
});

const latency = new GraphQLObjectType({
  name: "Latency",
  description: "This represents latency stats",
  fields: () => ({
    min: { type: GraphQLFloat },
    max: { type: GraphQLFloat },
    median: { type: GraphQLFloat },
    average: { type: GraphQLFloat },
    mean: { type: GraphQLFloat },
    stddev: { type: GraphQLFloat },
    min: { type: GraphQLFloat },
    max: { type: GraphQLFloat },
    p0_001: { type: GraphQLFloat },
    p0_01: { type: GraphQLFloat },
    p0_1: { type: GraphQLFloat },
    p1: { type: GraphQLFloat },
    p2_5: { type: GraphQLFloat },
    p10: { type: GraphQLFloat },
    p25: { type: GraphQLFloat },
    p50: { type: GraphQLFloat },
    p75: { type: GraphQLFloat },
    p90: { type: GraphQLFloat },
    p97_5: { type: GraphQLFloat },
    p99: { type: GraphQLFloat },
    p99_9: { type: GraphQLFloat },
    p99_99: { type: GraphQLFloat },
    p99_999: { type: GraphQLFloat },
    totalCount: { type: GraphQLFloat },
  }),
});

const requests = new GraphQLObjectType({
  name: "Requests",
  description: "This represents requests stats",
  fields: () => ({
    average: { type: GraphQLFloat },
    mean: { type: GraphQLFloat },
    stddev: { type: GraphQLFloat },
    min: { type: GraphQLFloat },
    max: { type: GraphQLFloat },
    p0_001: { type: GraphQLFloat },
    p0_01: { type: GraphQLFloat },
    p0_1: { type: GraphQLFloat },
    p1: { type: GraphQLFloat },
    p2_5: { type: GraphQLFloat },
    p10: { type: GraphQLFloat },
    p25: { type: GraphQLFloat },
    p50: { type: GraphQLFloat },
    p75: { type: GraphQLFloat },
    p90: { type: GraphQLFloat },
    p97_5: { type: GraphQLFloat },
    p99: { type: GraphQLFloat },
    p99_9: { type: GraphQLFloat },
    p99_99: { type: GraphQLFloat },
    p99_999: { type: GraphQLFloat },
    sent: { type: GraphQLFloat },
  }),
});

const throughput = new GraphQLObjectType({
  name: "Throughput",
  description: "This represents throughput stats",
  fields: () => ({
    average: { type: GraphQLFloat },
    mean: { type: GraphQLFloat },
    stddev: { type: GraphQLFloat },
    min: { type: GraphQLFloat },
    max: { type: GraphQLFloat },
    p0_001: { type: GraphQLFloat },
    p0_01: { type: GraphQLFloat },
    p0_1: { type: GraphQLFloat },
    p1: { type: GraphQLFloat },
    p2_5: { type: GraphQLFloat },
    p10: { type: GraphQLFloat },
    p25: { type: GraphQLFloat },
    p50: { type: GraphQLFloat },
    p75: { type: GraphQLFloat },
    p90: { type: GraphQLFloat },
    p97_5: { type: GraphQLFloat },
    p99: { type: GraphQLFloat },
    p99_9: { type: GraphQLFloat },
    p99_99: { type: GraphQLFloat },
    p99_999: { type: GraphQLFloat },
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
  description: "This is the root query",
  fields: () => ({
    concurrentB_getUsers: {
      type: result,
      args: {
        connections: { type: GraphQLInt },
        pipelining: { type: GraphQLInt },
        duration: { type: GraphQLInt },
        workers: { type: GraphQLInt },
      },
      resolve: (parent, args) => getUsersBenchmark(args),
    },
    parallelB_getUsers: {
      type: returnMessage,
      args: {},
      resolve: () => b_getUsers(),
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "This is the root mutation",
  fields: () => ({
    concurrentB_createOrders: {
      type: result,
      args: {
        connections: { type: GraphQLInt },
        pipelining: { type: GraphQLInt },
        duration: { type: GraphQLInt },
        workers: { type: GraphQLInt },
      },
      resolve: (parent, args) => getUsersBenchmark(args),
    },
    parallelB_createProduct: {
      type: returnMessage,
      args: {},
      resolve: () => b_createProduct(),
    },
  }),
});

const schema = new GraphQLSchema({
  schema: result,
  query: Query,
  mutation: Mutation,
});

export default schema;
