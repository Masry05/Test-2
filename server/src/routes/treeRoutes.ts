import express from 'express';
import { getTrees, getTree, createTree, createNode } from '../controllers/treeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/trees').get(getTrees).post(protect, createTree);
router.route('/trees/:treeId').get(getTree);
router.route('/nodes').post(protect, createNode);

export default router;
