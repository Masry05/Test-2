import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Node } from '../types';

import TreeNode from '../components/TreeNode';

const TreeViewPage = () => {
    const { treeId } = useParams<{ treeId: string }>();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTree = async () => {
        try {
            const res = await api.get(`/trees/${treeId}`);
            setNodes(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (treeId) fetchTree();
    }, [treeId]);

    if (loading) return <div>Loading tree...</div>;
    if (nodes.length === 0) return <div>Tree not found</div>;

    const rootNode = nodes.find(n => n.kind === 'ROOT');
    if (!rootNode) return <div>Invalid tree data</div>;

    const getDirectChildren = (parentId: string) => {
        return nodes.filter(n => n.parentId === parentId);
    };

    return (
        <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md">
                &larr; Back to Trees
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Discussion Tree</h2>
            <TreeNode
                node={rootNode}
                childrenNodes={getDirectChildren(rootNode._id)}
                allNodes={nodes}
                onNodeCreated={fetchTree}
            />
        </div>
    );
};

export default TreeViewPage;
