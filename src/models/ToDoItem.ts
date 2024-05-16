import { Schema, model, Document } from 'mongoose';

interface IToDoItem extends Document {
    title: string;
    isCompleted: boolean;
    createdAt: Date;
}

const ToDoItemSchema = new Schema<IToDoItem>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ToDoItem = model<IToDoItem>('ToDoItem', ToDoItemSchema);

export default ToDoItem;
