export interface User {
    _id: string;
    username: string;
    token?: string;
}

export interface Node {
    _id: string;
    treeId: string;
    parentId: string | null;
    authorId: { _id: string; username: string } | string;
    kind: 'ROOT' | 'OP';
    value: number;
    op?: '+' | '-' | '*' | '/';
    right?: number;
    createdAt: string;
    // For Tree List (Aggregation result)
    recentReplies?: Node[];
    replyCount?: number;
    authorUsername?: string;
}
