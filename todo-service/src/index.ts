import express, { Application } from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
    const app: Application = express();

    const server = new ApolloServer({ typeDefs, resolvers });

    await server.start();
    server.applyMiddleware({ app });

    try {
        mongoose.set('strictQuery', true);  
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todos');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        return;
    }

    mongoose.connection.once('open', () => {
        console.log('MongoDB connection is open');
    });

    const PORT = process.env.PORT || 4001;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
    });
};

startServer().catch(error => {
    console.error('Error starting server:', error);
});
