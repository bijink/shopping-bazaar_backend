declare namespace Express {
  interface Locals {
    user: {
      _id: string;
      type: string;
      name: string;
      email: string;
    };
  }
}
