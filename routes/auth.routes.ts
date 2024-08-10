import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authHelpers } from '../helpers';

const router = Router();

// *both admin/seller and customer are using the app, so both are 'user'
router.post('/signup', (req, res) => {
  try {
    const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
    if (!jwtTokenSecret) throw new Error('jwt secret key is missing in server');
    authHelpers
      .signup(req.body)
      .then((response) => {
        const token = jwt.sign(response.user, jwtTokenSecret, { expiresIn: '1d' });
        res.status(201).send({ user: response.user, token });
      })
      .catch((err) => {
        res.status(401).send(err);
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    } else {
      res.status(500).send({ message: 'unexpected error occurred' });
    }
  }
});
router.post('/signin', (req, res) => {
  try {
    const jwtTokenSecret = process.env.JWT_TOKEN_SECRET;
    if (!jwtTokenSecret) throw new Error('jwt secret key is missing in server');
    authHelpers
      .signin(req.body)
      .then((response) => {
        const token = jwt.sign(response.user, jwtTokenSecret, { expiresIn: 60 * 10 });
        // res.cookie('token', token, { maxAge: 1000 * 60 * 1 });
        res.status(200).send({ user: response.user, token });
      })
      .catch((err) => {
        res.status(401).send(err);
      });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: error.message });
    } else {
      res.status(500).send({ message: 'unexpected error occurred' });
    }
  }
});

export default router;
