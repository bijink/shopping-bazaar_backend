import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      _id: string;
      name: string;
      email: string;
    } | null;
    loggedIn: string | null;
    userLoginErr: string | boolean;
  }
}
