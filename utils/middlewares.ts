import { NextFunction, Request, Response } from 'express';
import { ContextRunner, ValidationError } from 'express-validator';
import jwt from 'jsonwebtoken';

// #authenticate jwt-token for each request
export const authenticateJwtToken = (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return response.status(401).send({ message: 'authorization required' });
  jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err, decoded) => {
    if (err) return response.status(400).send(err);
    const decodedPayload = JSON.parse(JSON.stringify(decoded));
    delete decodedPayload.iat;
    delete decodedPayload.exp;
    response.locals.user = decodedPayload;
    next();
  });
};

// #validate request data (req.body, req.cookies, req.headers, req.query, req.params)
export const validateRequest = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const results: ValidationError[] = [];
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) results.push(result.array()[0]);
    }
    if (results.length) {
      return res.status(400).json({ message: 'request validation failed', errors: results });
    }
    next();
  };
};
