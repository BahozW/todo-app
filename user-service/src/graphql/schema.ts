import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        createdAt: String!
    }

    type Query {
        getUserById(id: ID!): User
        getUserByEmail(email: String!): User
        getUsers: [User]
    }

    type Mutation {
        addUser(name: String!, email: String!, password: String!): User
        deleteUser(id: ID!): User
    }
`;

export default typeDefs;
