import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} from "graphql";
import {
  getAllUsers,
  getUser,
  login,
  getLogs,
  register,
} from "../functions/functions.js";

const userType = new GraphQLObjectType({
  name: "User",
  description: "This represents a user",
  fields: () => ({
    _id: { type: GraphQLString },
    name: {
      type: GraphQLString,
    },
    email: { type: GraphQLString },
    points: { type: GraphQLInt },
  }),
});

const tokenType = new GraphQLObjectType({
  name: "jwttoken",
  description: "This represents a jwt token",
  fields: () => ({
    token: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const logsType = new GraphQLObjectType({
  name: "logs",
  description: "This represents a log",
  fields: () => ({
    message: { type: GraphQLString },
    level: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  description: "All queries",
  fields: () => ({
    user: {
      type: userType,
      description: "A single user",
      args: {
        _id: { type: GraphQLString },
      },
      resolve: (parent, args) => getUser(args._id),
    },
    users: {
      type: new GraphQLList(userType),
      description: "List all users",
      resolve: () => getAllUsers(),
    },
    queryLogs: {
      type: new GraphQLList(logsType),
      description: "Query logs",
      resolve: () => {
        return getLogs();
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "All mutations",
  fields: () => ({
    register: {
      type: tokenType,
      description: "register user",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const data = {
          name: args.name,
          email: args.email,
          password: args.password,
          role: "user",
        };
        return register(data);
      },
    },
    login: {
      type: tokenType,
      description: "login user",
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const data = {
          email: args.email,
          password: args.password,
        };
        return login(data);
      },
    },
  }),
});

const schema = new GraphQLSchema({
  schema: [userType, tokenType],
  query: Query,
  mutation: Mutation,
});

export default schema;
