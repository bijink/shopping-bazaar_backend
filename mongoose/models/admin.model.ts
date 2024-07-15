import { model, Schema } from 'mongoose';

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = model('Admin', adminSchema);

export default Admin;
