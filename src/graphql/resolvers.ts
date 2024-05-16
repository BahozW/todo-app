import ToDoItem from '../models/ToDoItem';

const resolvers = {
    Query: {
        getToDoItems: async () => {
            return await ToDoItem.find();
        },
        getToDoItem: async (_: any, { id }: { id: string }) => {
            return await ToDoItem.findById(id);
        },
    },
    Mutation: {
        addToDoItem: async (_: any, { title }: { title: string }) => {
            const newToDoItem = new ToDoItem({ title });
            return await newToDoItem.save();
        },
        updateToDoItem: async (_: any, { id, title, isCompleted }: { id: string, title?: string, isCompleted?: boolean }) => {
            const updatedToDoItem = await ToDoItem.findByIdAndUpdate(
                id,
                { title, isCompleted },
                { new: true }
            );
            return updatedToDoItem;
        },
        deleteToDoItem: async (_: any, { id }: { id: string }) => {
            const deletedToDoItem = await ToDoItem.findByIdAndDelete(id);
            return deletedToDoItem;
        },
    },
};

export default resolvers;
