// const express = require('express');
// const path = require('path');
// const db = require('./config/connection');
import signToken  from './utils/auth.js';
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// import { User } from "./models";

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }
// The GraphQL schema

// A map of functions which return data for the schema.

const typeDefs = `#graphql
type User { 
  id : ID!
  username: String!
  email: String!
  bookCount: Int
  savedBooks: [Book]
}

type Book {
  bookId: ID!
  authors: [String]
  description: String
  image: String
  link: String
  title: String!
}

type Auth {
  token:ID!
  user: User
}

input BookInput {
  authors: [String],
  description: String!
  bookId: String!
  image: String,
  link: String,
  title: String!
}

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!) : Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if(context.user) {
        let userData = await User.findOne({_id: context.user._id});
        return userData;
      };

      console.error('Not logged in!!!');
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user)
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
