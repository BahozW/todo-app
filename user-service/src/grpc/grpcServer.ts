import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const PROTO_PATH = './src/user.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;

const getUserById = async (call: any, callback: any) => {
    console.log('Received request for getUserById with id:', call.request.id);
    try {
        const user = await User.findById(call.request.id);
        if (!user) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: `User with id ${call.request.id} not found`
            });
        }
        callback(null, user);
    } catch (error: any) {  // Cast 'error' to 'any'
        callback({
            code: grpc.status.INTERNAL,
            message: `Internal error: ${error.message}`
        });
    }
};

const getUserByEmail = async (call: any, callback: any) => {
    console.log('Received request for getUserByEmail with email:', call.request.email);
    try {
        const user = await User.findOne({ email: call.request.email });
        if (!user) {
            return callback({
                code: grpc.status.NOT_FOUND,
                message: `User with email ${call.request.email} not found`
            });
        }
        callback(null, user);
    } catch (error: any) {  // Cast 'error' to 'any'
        callback({
            code: grpc.status.INTERNAL,
            message: `Internal error: ${error.message}`
        });
    }
};

const startGrpcServer = () => {
    const server = new grpc.Server();
    server.addService(userProto.UserService.service, {
        getUserById,
        getUserByEmail,
    });

    server.bindAsync('127.0.0.1:50052', grpc.ServerCredentials.createInsecure(), () => {
        console.log('gRPC server running at http://127.0.0.1:50052');
    });
};

const startServer = async () => {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/users');
    mongoose.connection.once('open', () => {
        console.log('Connected to MongoDB');
    });
    startGrpcServer();
};

startServer().catch(error => {
    console.error('Error starting server:', error);
});
