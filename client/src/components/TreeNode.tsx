import { useState, useContext } from 'react';
import type { Node } from '../types';

import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Alert from './ui/Alert';
import NumberInput from './ui/NumberInput';

interface TreeNodeProps {
    node: Node;
    childrenNodes: Node[];
    allNodes: Node[]; // To pass down for recursion
    onNodeCreated: () => void;
    level?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, childrenNodes, allNodes, onNodeCreated, level = 0 }) => {
    const [showReply, setShowReply] = useState(false);
    const [op, setOp] = useState<'+' | '-' | '*' | '/'>('+');
    const [right, setRight] = useState('');
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);

    const getDirectChildren = (parentId: string) => {
        return allNodes.filter(n => n.parentId === parentId);
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (op === '/' && Number(right) === 0) {
            setError('Division by zero is not allowed');
            return;
        }

        if (!right) return;

        try {
            await api.post('/nodes', {
                parentId: node._id,
                op,
                right: Number(right),
            });
            setShowReply(false);
            setRight('');
            onNodeCreated();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error creating reply');
        }
    };

    return (
        <div className={`relative ${level > 0 ? 'ml-8 pl-8 border-l-2 border-gray-100 dark:border-gray-700' : ''}`}>
            <div className="relative group">
                {/* Connector Line Dot */}
                {level > 0 && (
                    <div className="absolute -left-[34px] top-5 w-4 h-0.5 bg-gray-100 dark:bg-gray-700" />
                )}

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 inline-block min-w-[200px] transition-all hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">
                            {node.kind === 'ROOT' ? (
                                <span className="text-blue-600 dark:text-blue-400">{node.value}</span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">{node.op} {node.right}</span>
                                    <span className="text-gray-300">=</span>
                                    <span className={node.op === '/' ? 'text-orange-500' : 'text-emerald-600 dark:text-emerald-400'}>
                                        {node.value}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            by <span className="font-medium text-gray-700 dark:text-gray-300">{(node.authorId as any).username || 'Unknown'}</span>
                        </span>

                        {user && (
                            <button
                                onClick={() => setShowReply(!showReply)}
                                className={`hover:text-blue-600 font-medium transition-colors ${showReply ? 'text-blue-600' : ''}`}
                            >
                                {showReply ? 'Cancel' : 'Reply'}
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {showReply && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 relative">
                            {error && <Alert message={error} onClose={() => setError('')} />}

                            <form onSubmit={handleReply} className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <select
                                        value={op}
                                        onChange={(e) => setOp(e.target.value as any)}
                                        className="w-16 px-2 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md font-mono text-center focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="+">+</option>
                                        <option value="-">-</option>
                                        <option value="*">*</option>
                                        <option value="/">/</option>
                                    </select>
                                    <NumberInput
                                        value={right}
                                        onChange={(val) => setRight(val)}
                                        placeholder="Num"
                                        className="w-24 border-none"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={!right}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-md transition-colors"
                                    >
                                        =
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {childrenNodes.length > 0 && (
                <div className="children">
                    {childrenNodes.map(child => (
                        <div key={child._id} className="mt-4">
                            <TreeNode
                                node={child}
                                childrenNodes={getDirectChildren(child._id)}
                                allNodes={allNodes}
                                onNodeCreated={onNodeCreated}
                                level={level + 1}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TreeNode;
