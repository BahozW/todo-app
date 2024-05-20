import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type ToDoItem {
        id: ID!
        title: String!
        isCompleted: Boolean!
        createdAt: String!
    }

    type Query {
        getToDoItems: [ToDoItem]
        getToDoItem(id: ID!): ToDoItem
    }

    type Mutation {
        addToDoItem(title: String!): ToDoItem
        updateToDoItem(id: ID!, title: String, isCompleted: Boolean): ToDoItem
        deleteToDoItem(id: ID!): ToDoItem
    }
`;

export default typeDefs;
