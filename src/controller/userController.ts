import express from 'express';
import { users } from '../globals';
import { IUser } from '../types';
import socketHandler from '../config/socket';
import { server } from '../index';
import { errorMessages, successMessages } from '../constants/messages';
import { socketEvents } from '../constants/constant';

const io = socketHandler(server);

export const registerUser = (
  req: express.Request,
  res: express.Response,
): any => {
  const { username, gender, country } = req.body;

  if (!username || !gender || !country) {
    return res.status(400).json({ message: errorMessages.allFieldsRequired });
  }

  // Check if username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res
      .status(400)
      .json({ statusCode: 400, message: errorMessages.usernameExists });
  }

  // Create user and store in the users array
  const user: IUser = {
    id: Date.now(),
    username,
    gender,
    country,
  };
  users.push(user);

  // Emit a updated users to all connected clients
  // WILL USE IT LATE
  io.emit(socketEvents.updatedUsersList, users);

  return res
    .status(201)
    .json({ message: successMessages.userRegistered, user });
};

export const getUserList = (
  req: express.Request,
  res: express.Response,
): any => {
  return res.json(users);
};

export const logout = (req: express.Request, res: express.Response): any => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: errorMessages.userIdRequired });
  }

  const userIndex = users.findIndex((user) => user.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).json({ message: errorMessages.userNotFound });
  }

  users.splice(userIndex, 1)[0];
  // Emit a updated users to all connected clients
  io.emit(socketEvents.updatedUsersList, users);

  return res.status(200).json({ message: successMessages.userLoggedOut });
};
