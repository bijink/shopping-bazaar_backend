import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

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
