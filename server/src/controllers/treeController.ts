import { Request, Response } from 'express';
import Node from '../models/Node';
import { createTreeSchema, createNodeSchema } from '../utils/validation';
import { computeValue } from '../utils/math';

interface AuthRequest extends Request {
    user?: { id: string };
}

// @desc    Get all trees (Root nodes)
// @route   GET /api/trees
// @access  Public
export const getTrees = async (req: Request, res: Response) => {
    try {
        const trees = await Node.aggregate([
            { $match: { kind: 'ROOT' } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'nodes',
                    let: { treeId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$treeId', '$$treeId'] }, kind: 'OP' } },
                        { $sort: { createdAt: -1 } }, // Newest first
                        { $limit: 3 }
                    ],
                    as: 'recentReplies'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } }, // Get author details
            // Nested lookup for recentReplies authors?
            // It's getting complex. Let's just return the counts and partial data.
            // We also want total count.
            {
                $lookup: {
                    from: 'nodes',
                    let: { treeId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$treeId', '$$treeId'] }, kind: 'OP' } },
                        { $count: 'count' }
                    ],
                    as: 'replyCountInfo'
                }
            },
            {
                $addFields: {
                    replyCount: { $ifNull: [{ $arrayElemAt: ['$replyCountInfo.count', 0] }, 0] },
                    authorUsername: '$author.username'
                }
            },
            {
                $project: {
                    author: 0,
                    replyCountInfo: 0
                }
            }
        ]);

        // Populate authors for recentReplies manually or via complex pipeline. 
        // For MVP 1.5, let's keep it simple and just show the OP/Value for replies, maybe not author.

        res.json(trees);
    } catch (error: any) {
        console.error('❌ Error fetching trees:', error);
        console.error('Error details:', error.message, error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// @desc    Get single tree (all nodes)
// @route   GET /api/trees/:treeId
// @access  Public
export const getTree = async (req: Request, res: Response) => {
    try {
        const nodes = await Node.find({ treeId: req.params.treeId }).populate('authorId', 'username').sort({ createdAt: 1 });
        if (!nodes || nodes.length === 0) {
            return res.status(404).json({ message: 'Tree not found' });
        }
        res.json(nodes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new tree (Root node)
// @route   POST /api/trees
// @access  Private
export const createTree = async (req: AuthRequest, res: Response) => {
    try {
        const validation = createTreeSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const { value } = validation.data;

        const node = new Node({
            authorId: req.user!.id,
            kind: 'ROOT',
            value,
            // For a root node, treeId is its own ID. We grant it a temp ID first or update after save? 
            // Mongoose IDs are generated on instantiation.
        });

        // We need the ID for treeId.
        node.treeId = node._id as any;

        await node.save();
        res.status(201).json(node);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reply to a node
// @route   POST /api/nodes
// @access  Private
export const createNode = async (req: AuthRequest, res: Response) => {
    try {
        const validation = createNodeSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const { parentId, op, right } = validation.data;

        const parent = await Node.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent node not found' });
        }

        let value: number;
        try {
            value = computeValue(parent.value, op as any, right);
        } catch (err: any) {
            return res.status(400).json({ message: err.message });
        }

        const node = await Node.create({
            treeId: parent.treeId,
            parentId: parent._id,
            authorId: req.user!.id,
            kind: 'OP',
            value,
            op,
            right,
        });

        res.status(201).json(node);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
