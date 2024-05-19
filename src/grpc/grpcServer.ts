import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import mongoose from 'mongoose';
import ToDoItem from '../models/ToDoItem';
import dotenv from 'dotenv';

dotenv.config();

const PROTO_PATH = './src/todo.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todo as any;

const getToDoItems = async (call: any) => {
    console.log('Received request for getToDoItems');
    const items = await ToDoItem.find();
    items.forEach(item => call.write(item.toObject())); 
    call.end();
};


const getToDoItem = async (call: any, callback: any) => {
    console.log('Received request for getToDoItem with id:', call.request.id);
    const item = await ToDoItem.findById(call.request.id);
    callback(null, item);
};

const addToDoItem = async (call: any, callback: any) => {
    console.log('Received request for addToDoItem with title:', call.request.title);
    const newItem = new ToDoItem({ title: call.request.title });
    const savedItem = await newItem.save();
    callback(null, savedItem);
};

const updateToDoItem = async (call: any, callback: any) => {
    console.log('Received request for updateToDoItem with id:', call.request.id);
    const updatedItem = await ToDoItem.findByIdAndUpdate(
        call.request.id,
        { title: call.request.title, isCompleted: call.request.isCompleted },
        { new: true }
    );
    callback(null, updatedItem);
};

const deleteToDoItem = async (call: any, callback: any) => {
    console.log('Received request for deleteToDoItem with id:', call.request.id);
    const deletedItem = await ToDoItem.findByIdAndDelete(call.request.id);
    callback(null, deletedItem);
};

const startGrpcServer = () => {
    const server = new grpc.Server();
    server.addService(todoProto.ToDoService.service, {
        getToDoItems,
        getToDoItem,
        addToDoItem,
        updateToDoItem,
        deleteToDoItem,
    });

    server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('gRPC server running at http://127.0.0.1:50051');
        server.start();
    });
};

const startServer = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todos');
    mongoose.connection.once('open', () => {
        console.log('Connected to MongoDB');
    });
    startGrpcServer();
};

startServer().catch(error => {
    console.error('Error starting server:', error);
});
