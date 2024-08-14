declare namespace Express {
  interface Locals {
    user: {
      _id: string;
      role: string;
      fname: string;
      lname: string;
      email: string;
    };
  }
}
