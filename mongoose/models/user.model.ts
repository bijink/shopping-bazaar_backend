import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  role: {
    type: String,
    enum: ['customer'], // Restricts the field to only this value
    default: 'customer', // Sets the default value
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  imgFilename: {
    type: String,
    required: true,
  },
});

const User = model('User', userSchema);

export default User;
