declare namespace Express {
  interface Locals {
    user: {
      _id: string;
      role: string;
      name: string;
      email: string;
    };
  }
}
