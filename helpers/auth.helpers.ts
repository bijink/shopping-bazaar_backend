import bcrypt from 'bcrypt';
import { User } from '../mongoose/models';

const authHelpers = {
  // #only for customer
  signup: async (reqBody: { type: string; name: string; email: string; password: string }) => {
    try {
      reqBody.password = await bcrypt.hash(reqBody.password, 10);
      const user = new User(reqBody);
      await user.save();
      const insertedUser = await User.findById(user._id, '_id type name email').exec();
      if (!insertedUser) return Promise.reject({ message: 'failed to sign up' });
      const newUserObj = {
        _id: insertedUser._id,
        type: insertedUser.type,
        name: insertedUser.name,
        email: insertedUser.email,
      };
      return Promise.resolve({ user: newUserObj });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // #for both admin and customer
  signin: async (reqBody: { email: string; password: string }) => {
    try {
      const user = await User.findOne({ email: reqBody.email });
      if (!user) return Promise.reject({ message: 'invalid email or password' });
      const authStatus = await bcrypt
        .compare(reqBody.password, user.password)
        .then((status) => status);
      if (!authStatus) return Promise.reject({ message: 'invalid password' });
      const newUserObj = {
        _id: user._id,
        type: user.type,
        name: user.name,
        email: user.email,
      };
      return Promise.resolve({ user: newUserObj });
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default authHelpers;
