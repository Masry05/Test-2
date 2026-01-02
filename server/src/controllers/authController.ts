import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { registerSchema, loginSchema } from '../utils/validation';

export const register = async (req: Request, res: Response) => {
    try {
        const validation = registerSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }


        const { username, password } = validation.data;

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            passwordHash,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id.toString()),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        console.log('Login attempt - Full request details:');
        console.log('Body:', req.body);
        console.log('Headers:', req.headers);
        console.log('Content-Type:', req.headers['content-type']);
        
        // Debug response to see what we're receiving
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: 'No body received',
                debug: {
                    body: req.body,
                    contentType: req.headers['content-type'],
                    headers: req.headers
                }
            });
        }
        
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            console.log('Validation failed:', validation.error.issues);
            return res.status(400).json({ 
                errors: validation.error.issues,
                debug: {
                    receivedBody: req.body,
                    contentType: req.headers['content-type']
                }
            });
        }

        const { username, password } = validation.data;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        res.json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id.toString()),
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};
