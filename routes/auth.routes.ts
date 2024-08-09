import { Router } from 'express';
// import jwt from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { authHelpers } from '../helpers';

const router = Router();

// *both admin/seller and customer are using the app, so both are 'user'
router.post('/signup', (req, res) => {
  authHelpers
    .signup(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
router.post('/signin', (req, res) => {
  authHelpers
    .signin(req.body)
    .then((response) => {
      // !:testing
      const token = jwt.sign(response.user, 'secret', { expiresIn: 60 });
      // res.cookie('token', token, { maxAge: 1000 * 60 * 1 });
      // !:testing
      res.status(200).send({ user: response.user, token });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

export default router;
