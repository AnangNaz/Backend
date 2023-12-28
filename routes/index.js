import express from 'express'
import { Login, getUsers, register } from '../controller/users.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/users',verifyToken, getUsers)
router.post('/users', register)
router.post('/login', Login)

export default router;