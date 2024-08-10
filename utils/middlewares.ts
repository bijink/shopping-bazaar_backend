import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJwtToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // console.log('token: ', token);
  if (token == null) return res.status(401).send({ message: 'authorization required' });
  jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err, decoded) => {
    // console.log('err: ', err);
    if (err) return res.status(400).send(err);
    // console.log('decoded: ', decoded);
    const decodedPayload = JSON.parse(JSON.stringify(decoded));
    delete decodedPayload.iat;
    delete decodedPayload.exp;
    res.locals.user = decodedPayload;
    next();
  });
};
