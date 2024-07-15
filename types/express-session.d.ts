import 'express-session';
import mongoose from 'mongoose';

declare module 'express-session' {
  interface SessionData {
    user?: {
      _id: mongoose.Types.ObjectId;
      name: string;
      email: string;
    } | null;
    loggedIn: string | null;
    userLoginErr: string | boolean;
  }
}
