import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.resolve(__dirname, '../user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user as any;

const client = new userProto.UserService('localhost:50052', grpc.credentials.createInsecure());

console.log('Client created, making request to getUserByEmail...');

client.getUserByEmail({ email: 'test@example.com' }, (error: any, response: any) => {
    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('User:', response);
    }
});
