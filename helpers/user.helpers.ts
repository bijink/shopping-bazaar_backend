import { User } from '../mongoose/models';

const userHelpers = {
  updateUserDetails: async (
    userId: string,
    detailsToUpdate: {
      fname?: string;
      lname?: string;
      email?: string;
      password?: string;
      image?: string;
    },
  ) => {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) return Promise.reject({ status: 404, data: { message: 'could not find user' } });
      await User.updateOne({ _id: userId }, detailsToUpdate);
      const updatedUserDetails = await User.findById(userId).select('-password').lean().exec();
      if (!updatedUserDetails)
        return Promise.reject({
          status: 500,
          data: {
            message: 'something went wrong, please try again later',
          },
        });
      return Promise.resolve({ status: 200, data: { user: updatedUserDetails } });
    } catch (error) {
      return Promise.reject({ status: 400, data: error });
    }
  },
};

export default userHelpers;
