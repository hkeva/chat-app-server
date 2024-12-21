import express, { Router } from 'express';
import {
  getUserList,
  registerUser,
  logout,
} from '../controller/userController';

const router: Router = express.Router();

router.post('/register', registerUser);

router.delete('/logout/:id', logout);

router.get('/users', getUserList);

export default router;
