import express from 'express';
import { registerController, loginController,currentUserController } from './user.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register' , registerController);
router.post('/login' , loginController);
router.get('/me', authenticateUser, currentUserController);

export default  router ;
