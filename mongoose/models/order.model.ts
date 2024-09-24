import mongoose, { model, Schema } from 'mongoose';

const OrderedItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color: {
    type: {
      name: {
        type: String,
        required: true,
      },
      hex: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

const orderSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  deliveryDetails: {
    type: {
      address: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      landmark: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  orderedItems: [OrderedItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  deliveryStatus: {
    type: String,
    required: true,
  },
});

const Order = model('Order', orderSchema);

export default Order;
