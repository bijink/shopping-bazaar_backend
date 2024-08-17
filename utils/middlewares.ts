import { NextFunction, Request, Response } from 'express';
import { ContextRunner, ValidationError } from 'express-validator';
import jwt from 'jsonwebtoken';

/**
 * Authenticate the user based on verifying jwt-token.
 */
export const authenticateJwtToken = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return response.status(401).send({ message: 'authorization required. missing api auth token' });
  }
  jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err, decoded) => {
    if (err) return response.status(400).send(err);
    const decodedPayload = JSON.parse(JSON.stringify(decoded));
    delete decodedPayload.iat;
    delete decodedPayload.exp;
    response.locals.user = decodedPayload;
    next();
  });
};
/**
 * Authenticate the user based on the user role (admin, customer)
 *
 * *must call this middleware function with parentheses. Otherwise will throw error.
 */
export const authenticateUserRole = (userRole?: 'admin' | 'customer' | undefined) => {
  if (!['string', 'undefined'].includes(typeof userRole)) {
    throw new Error('must call this middleware function with parentheses');
  }
  return (request: Request, response: Response, next: NextFunction) => {
    const user = response.locals.user;
    if (user.role === userRole || typeof userRole === 'undefined') next();
    else {
      response
        .status(403)
        .send({ message: `only ${userRole} have permission to this api endpoint` });
    }
  };
};
/**
 * Validate request data (req.body, req.cookies, req.headers, req.query, req.params)
 */
export const validateRequest = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const results: ValidationError[] = [];
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) results.push(result.array()[0]);
    }
    if (results.length) {
      return res.status(400).json({ message: 'request validation failed', errors: results });
    } else next();
  };
};
