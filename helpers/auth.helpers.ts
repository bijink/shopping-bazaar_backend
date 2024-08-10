import bcrypt from 'bcrypt';
import { User } from '../mongoose/models';

const authHelpers = {
  // #only for customer
  signup: async (reqBody: { type: string; name: string; email: string; password: string }) => {
    try {
      // todo:: use validator instead
      if (!reqBody.name || !reqBody.email || !reqBody.password)
        return Promise.reject({
          status: 400,
          response: {
            message: 'name, email and password are required',
          },
        });
      // todo:: use validator instead
      reqBody.password = await bcrypt.hash(reqBody.password, 10);
      const user = new User(reqBody);
      await user.save();
      const insertedUser = await User.findById(user._id, '_id type name email').exec();
      if (!insertedUser)
        return Promise.reject({
          status: 500,
          response: {
            message: 'something went wrong, please try again later',
          },
        });
      const newUserObj = {
        _id: insertedUser._id,
        type: insertedUser.type,
        name: insertedUser.name,
        email: insertedUser.email,
      };
      return Promise.resolve({ status: 201, user: newUserObj });
    } catch (error) {
      return Promise.reject({ status: 409, response: error });
    }
  },
  // #for both admin and customer
  signin: async (reqBody: { email: string; password: string }) => {
    try {
      if (!reqBody.email || !reqBody.password)
        return Promise.reject({
          status: 400,
          response: {
            message: 'email and password are required',
          },
        });
      const user = await User.findOne({ email: reqBody.email });
      if (!user)
        return Promise.reject({ status: 401, response: { message: 'invalid email or password' } });
      const authStatus = await bcrypt
        .compare(reqBody.password, user.password)
        .then((status) => status);
      if (!authStatus)
        return Promise.reject({ status: 401, response: { message: 'invalid password' } });
      const newUserObj = {
        _id: user._id,
        type: user.type,
        name: user.name,
        email: user.email,
      };
      return Promise.resolve({ status: 200, user: newUserObj });
    } catch (error) {
      return Promise.reject({ status: 400, respose: error });
    }
  },
};

export default authHelpers;
