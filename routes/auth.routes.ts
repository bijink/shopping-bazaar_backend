// *both admin/seller and customer are using the app, so both are 'user'
import { Router } from 'express';
import { body, checkSchema, matchedData, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { authHelpers } from '../helpers';
import { validateRequest } from '../utils/middlewares';
import { sendOtpSchema, userSigninSchema, userSignupSchema } from '../utils/validationSchemas';

const router = Router();

const signToken = (
  user: { _id: Types.ObjectId; name: string; email: string; role: string },
  expiresIn: string | number | undefined,
) => {
  try {
    return jwt.sign(user, process.env.JWT_TOKEN_SECRET as string, {
      expiresIn,
    });
  } catch (error) {
    return null;
  }
};

router.post('/send-otp', validateRequest(checkSchema(sendOtpSchema)), (request, response) => {
  const { email } = request.body;
  authHelpers
    .sendOtp(email)
    .then((res) => {
      response.status(res.status).send(res.data);
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});
router.post(
  '/signup',
  validateRequest(checkSchema(userSignupSchema)),
  async (request, response, next) => {
    // #password confirmation
    const { password } = matchedData(request);
    if (password) {
      await body('passwordConfirmation')
        .notEmpty()
        .withMessage('passwordConfirmation is required')
        .equals(password)
        .withMessage('passwords do not match')
        .run(request);
    }
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response
        .status(400)
        .send({ message: 'request validation failed', errors: result.array() });
    }
    next();
  },
  (request, response) => {
    authHelpers
      .signup(request.body)
      .then((res) => {
        const tokenData = {
          _id: res.data.user._id,
          name: `${res.data.user.fname} ${res.data.user.lname}`,
          email: res.data.user.email,
          role: res.data.user.role,
        };
        const token = signToken(tokenData, '1d');
        if (!token) {
          return response
            .status(500)
            .send({ message: 'failed to allot token,  please try to signin' });
        }
        response.status(res.status).send({ user: res.data.user, token });
      })
      .catch((err) => {
        response.status(err.status).send(err.data);
      });
  },
);
router.post('/signin', validateRequest(checkSchema(userSigninSchema)), (request, response) => {
  authHelpers
    .signin(request.body)
    .then((res) => {
      const tokenData = {
        _id: res.data.user._id,
        name: `${res.data.user.fname} ${res.data.user.lname}`,
        email: res.data.user.email,
        role: res.data.user.role,
      };
      const token = signToken(tokenData, '7d');
      if (!token) {
        return response
          .status(500)
          .send({ message: 'failed to allot token,  please try again later' });
      }
      response.status(res.status).send({ user: res.data.user, token });
    })
    .catch((err) => {
      response.status(err.status).send(err.data);
    });
});

export default router;
