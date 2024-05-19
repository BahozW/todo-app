import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../todo.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition).todo as any;

const client = new todoProto.ToDoService('localhost:50051', grpc.credentials.createInsecure());

console.log('Client created, making request to getToDoItems...');

const call = client.getToDoItems({}, (error: any, response: any) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Stream ended');
    }
});

call.on('data', (item: any) => {
    console.log('Received item:', item);
});

call.on('end', () => {
    console.log('All items received');
});
