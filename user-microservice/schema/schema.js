import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} from "graphql";
import { getAllUsers, getUser } from "../functions/functions.js";

const userType = new GraphQLObjectType({
  name: "User",
  description: "This represents a user",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
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
  }),
});

const schema = new GraphQLSchema({
  schema: userType,
  query: Query,
  //mutation: Mutation,
});

export default schema;
