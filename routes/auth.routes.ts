import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { authHelpers } from '../helpers';

const router = Router();

router.use((req, res, next) => {
  if (!process.env.JWT_TOKEN_SECRET)
    res.status(500).send({ message: 'jwt secret key is missing in server' });
  else {
    next();
  }
});
// *both admin/seller and customer are using the app, so both are 'user'
router.post('/signup', (req, res) => {
  authHelpers
    .signup(req.body)
    .then((response) => {
      const token = jwt.sign(response.user, process.env.JWT_TOKEN_SECRET as string, {
        expiresIn: '1d',
      });
      res.status(response.status).send({ user: response.user, token });
    })
    .catch((error) => {
      res.status(error.status).send(error.response);
    });
});
router.post('/signin', (req, res) => {
  authHelpers
    .signin(req.body)
    .then((response) => {
      const token = jwt.sign(response.user, process.env.JWT_TOKEN_SECRET as string, {
        expiresIn: 60 * 10,
      });
      // res.cookie('token', token, { maxAge: 1000 * 60 * 1 });
      res.status(response.status).send({ user: response.user, token });
    })
    .catch((error) => {
      res.status(error.status).send(error.response);
    });
});

export default router;
