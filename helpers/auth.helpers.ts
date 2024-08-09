import bcrypt from 'bcrypt';
import { User } from '../mongoose/models';

const authHelpers = {
  // #only for customer
  signup: async (reqBody: { type: string; name: string; email: string; password: string }) => {
    try {
      reqBody.password = await bcrypt.hash(reqBody.password, 10);
      const user = new User(reqBody);
      await user.save();
      const insertedUser = await User.findById(user._id, 'type name email').exec();
      return Promise.resolve({ user: insertedUser });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  // #for both admin and customer
  signin: async (reqBody: { email: string; password: string }) => {
    try {
      const user = await User.findOne({ email: reqBody.email });
      if (!user) return Promise.reject({ message: 'Invalid email or password' });
      const authStatus = await bcrypt
        .compare(reqBody.password, user.password)
        .then((status) => status);
      if (authStatus) {
        const newUserObj = {
          _id: user._id,
          type: user.type,
          name: user.name,
          email: user.email,
        };
        return Promise.resolve({ user: newUserObj });
      } else {
        return Promise.reject({ message: 'Invalid email or password' });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default authHelpers;
