// *both admin/seller and customer are using the app, so both are 'user'
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { authHelpers } from '../helpers';

type UserTypes = {
  _id: Types.ObjectId;
  type: string;
  name: string;
  email: string;
};

const router = Router();

const signToken = (user: UserTypes) => {
  return jwt.sign(user, process.env.JWT_TOKEN_SECRET as string, {
    // expiresIn: '7d',
    expiresIn: '1d',
  });
};

router.use((request, response, next) => {
  if (!process.env.JWT_TOKEN_SECRET)
    response.status(500).send({ message: 'jwt secret key is missing in server' });
  else {
    next();
  }
});
router.post('/signup', (request, response) => {
  authHelpers
    .signup(request.body)
    .then((res) => {
      const token = signToken(res.data.user);
      response.status(res.status).send({ user: res.data.user, token });
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.post('/signin', (request, response) => {
  authHelpers
    .signin(request.body)
    .then((res) => {
      const token = signToken(res.data.user);
      response.status(res.status).send({ user: res.data.user, token });
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});

export default router;
