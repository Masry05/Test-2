import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Node } from '../types';
import { AuthContext } from '../context/AuthContext';
import NumberInput from '../components/ui/NumberInput';


const TreeListPage = () => {
    const [trees, setTrees] = useState<Node[]>([]);
    const { user } = useContext(AuthContext);
    const [newValue, setNewValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrees();
    }, []);

    const fetchTrees = async () => {
        try {
            const res = await api.get('/trees');
            setTrees(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createTree = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newValue) return;
        try {
            const res = await api.post('/trees', { value: Number(newValue) });
            navigate(`/tree/${res.data._id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to create tree');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white font-mono tracking-tight">Calculation Trees</h1>

            {user && (
                <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Start a New Calculation</h3>
                    <form onSubmit={createTree} className="flex gap-4">
                        <NumberInput
                            placeholder="Enter starting number..."
                            value={newValue}
                            onChange={val => setNewValue(val)}
                            required
                            className="flex-1 font-mono text-lg h-[50px] !text-left"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 whitespace-nowrap h-[50px]"
                        >
                            Start Tree
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {trees.map(tree => (
                    <Link
                        key={tree._id}
                        to={`/tree/${tree.treeId || tree._id}`}
                        className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:-translate-y-0.5"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-bold text-lg">
                                    #
                                </span>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                                        {tree.value}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium mt-1">
                                        Base Number
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {tree.authorUsername || 'Unknown'}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {tree.replyCount} replies
                                </div>
                            </div>
                        </div>

                        {tree.recentReplies && tree.recentReplies.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {tree.recentReplies.map((reply) => (
                                    <div key={reply._id} className="flex-shrink-0 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-mono text-gray-700 dark:text-gray-300">
                                        <span className="text-blue-500 font-bold mr-2">{reply.op} {reply.right}</span>
                                        <span className="text-gray-400 mx-1">=</span>
                                        <span className="font-bold">{reply.value}</span>
                                    </div>
                                ))}
                                {tree.replyCount && tree.replyCount > 3 && (
                                    <div className="flex-shrink-0 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 italic">
                                        + {tree.replyCount - 3} more...
                                    </div>
                                )}
                            </div>
                        )}
                    </Link>
                ))}
                {trees.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <div className="text-6xl mb-4">🌱</div>
                        <p className="text-lg">No calculation trees yet.</p>
                        <p>Start the first one above!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TreeListPage;
