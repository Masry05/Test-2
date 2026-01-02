import mongoose, { Document, Schema } from 'mongoose';

export interface INode extends Document {
    treeId: mongoose.Types.ObjectId;
    parentId: mongoose.Types.ObjectId | null;
    authorId: mongoose.Types.ObjectId;
    kind: 'ROOT' | 'OP';
    value: number;
    op?: '+' | '-' | '*' | '/';
    right?: number;
    createdAt: Date;
}

const NodeSchema: Schema = new Schema({
    treeId: { type: Schema.Types.ObjectId, ref: 'Node', required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Node', default: null },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    kind: { type: String, enum: ['ROOT', 'OP'], required: true },
    value: { type: Number, required: true },
    op: { type: String, enum: ['+', '-', '*', '/'] },
    right: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INode>('Node', NodeSchema);
