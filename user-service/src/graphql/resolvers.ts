import User from '../models/User';

const resolvers = {
    Query: {
        getUserById: async (_: any, { id }: { id: string }) => {
            return await User.findById(id);
        },
        getUserByEmail: async (_: any, { email }: { email: string }) => {
            return await User.findOne({ email });
        },
        getUsers: async () => {
            return await User.find();
        },
    },
    Mutation: {
        addUser: async (_: any, { name, email, password }: { name: string, email: string, password: string }) => {
            const newUser = new User({ name, email, password });
            return await newUser.save();
        },
        deleteUser: async (_: any, { id }: { id: string }) => {
            const deletedUser = await User.findByIdAndDelete(id);
            return deletedUser;
        },
    },
};

export default resolvers;
