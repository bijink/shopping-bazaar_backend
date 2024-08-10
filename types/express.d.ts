declare namespace Express {
  export interface Request {
    user: {
      _id: string;
      type: string;
      name: string;
      email: string;
    };
  }
}
