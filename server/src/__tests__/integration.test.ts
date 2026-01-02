import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/User';
import Node from '../models/Node';

beforeAll(async () => {
    process.env.JWT_SECRET = 'testsecret';
    // Use a separate test database
    const uri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/numbers-tree-test';

    // Check if already connected (e.g. by app.ts if it auto-connected, though ours does not)
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
    // Clean start
    await User.deleteMany({});
    await Node.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
    await Node.deleteMany({});
    await mongoose.disconnect();
    // server close is handled by jest forceExit
});

describe('User Story Business Scenarios', () => {
    let authToken = '';
    let userId = '';

    // Scenario 1: Unregistered user can see the tree of all user posts
    it('Scenario 1: Unregistered user can see trees', async () => {
        const res = await request(app).get('/api/trees');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Scenario 2: Unregistered user can create an account
    it('Scenario 2: Create an account', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            password: 'password123',
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('_id');
        userId = res.body._id;
    });

    // Scenario 3: Login (Auth process and change role implied)
    it('Scenario 3: Login to change role to registered user', async () => {
        // First ensure user exists (in case it was cleaned up, needing re-creation)
        await request(app).post('/api/auth/register').send({
            username: 'registeredUser',
            password: 'password123',
        });

        const res = await request(app).post('/api/auth/login').send({
            username: 'registeredUser',
            password: 'password123',
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        authToken = res.body.token; // Save token for next steps
    });

    // Scenario 4: Registered user can start a chain by publishing a starting number
    let treeId = '';
    let rootNodeId = '';
    it('Scenario 4: Registered user starts a chain (Create Tree)', async () => {
        const res = await request(app)
            .post('/api/trees')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                value: 42,
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.value).toBe(42);
        expect(res.body.kind).toBe('ROOT');
        treeId = res.body.treeId || res.body.id; // Depending on implementation
        rootNodeId = res.body._id || res.body.id;
    });

    // Scenario 5: Add an operation on the selected starting number
    it('Scenario 5: Add an operation node', async () => {
        const res = await request(app)
            .post('/api/nodes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                treeId: treeId, // If needed by API, though parentId might suffice depending on logic
                parentId: rootNodeId,
                right: 10,
                op: '+', // 42 + 10
            });

        expect(res.status).toBe(201);
        expect(res.body.op).toBe('+');
        expect(res.body.value).toBe(52); // 42 + 10 = 52
        expect(res.body.parentId).toBe(rootNodeId);
    });

    // Scenario 6: Respond to any other calculation
    it('Scenario 6: Respond to existing calculation (Branching)', async () => {
        // Find the node we just created or use root again
        const res = await request(app)
            .post('/api/nodes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                treeId: treeId,
                parentId: rootNodeId,
                right: 5,
                op: '-', // 42 - 5 (Creating a new branch from root)
            });

        expect(res.status).toBe(201);
        expect(res.body.op).toBe('-');
        expect(res.body.value).toBe(37); // 42 - 5 = 37
        expect(res.body.parentId).toBe(rootNodeId);
    });

    // Edge Case: Divide by zero
    it('Edge Case: Divide by zero should fail', async () => {
        const res = await request(app)
            .post('/api/nodes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                treeId: treeId,
                parentId: rootNodeId,
                right: 0,
                op: '/',
            });

        // Assuming validation usually returns 400
        expect(res.status).toBe(400);
        // Or check message if you want to be specific
    });
});
