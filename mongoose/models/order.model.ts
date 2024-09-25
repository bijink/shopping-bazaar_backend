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
      name: {
        type: String,
        required: true,
      },
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
    enum: ['pending', 'success', 'returned'],
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'on-packing', 'on-shipping', 'on-delivering', 'delivered', 'cancelled'],
    required: true,
  },
});

const Order = model('Order', orderSchema);

export default Order;
