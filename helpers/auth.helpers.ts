import bcrypt from 'bcrypt';
import { User } from '../mongoose/models';

const authHelpers = {
  // #only for customer
  signup: async (userData: { type: string; name: string; email: string; password: string }) => {
    try {
      // todo:: use validator instead
      if (!userData.name || !userData.email || !userData.password)
        return Promise.reject({
          status: 400,
          data: {
            message: 'name, email and password are required',
          },
        });
      // todo:: use validator instead
      userData.password = await bcrypt.hash(userData.password, 10);
      const user = new User(userData);
      await user.save();
      const insertedUser = await User.findById(user._id, '_id type name email').exec();
      if (!insertedUser)
        return Promise.reject({
          status: 500,
          data: {
            message: 'something went wrong, please try again later',
          },
        });
      const newUserObj = {
        _id: insertedUser._id,
        type: insertedUser.type,
        name: insertedUser.name,
        email: insertedUser.email,
      };
      return Promise.resolve({ status: 201, data: { user: newUserObj } });
    } catch (error) {
      return Promise.reject({ status: 409, data: error });
    }
  },
  // #for both admin and customer
  signin: async (credentials: { email: string; password: string }) => {
    try {
      if (!credentials.email || !credentials.password)
        return Promise.reject({
          status: 400,
          data: {
            message: 'email and password are required',
          },
        });
      const user = await User.findOne({ email: credentials.email });
      if (!user)
        return Promise.reject({ status: 401, data: { message: 'invalid email or password' } });
      const authStatus = await bcrypt
        .compare(credentials.password, user.password)
        .then((status) => status);
      if (!authStatus)
        return Promise.reject({ status: 401, data: { message: 'invalid password' } });
      const newUserObj = {
        _id: user._id,
        type: user.type,
        name: user.name,
        email: user.email,
      };
      return Promise.resolve({ status: 200, data: { user: newUserObj } });
    } catch (error) {
      return Promise.reject({ status: 400, data: error });
    }
  },
};

export default authHelpers;
