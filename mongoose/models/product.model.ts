import { model, Schema } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  suitableFor: {
    type: [String],
    enum: ['children', 'men', 'women'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  size: {
    type: [String],
    enum: ['xxs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: [String],
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  details: {
    type: String,
    require: true,
  },
  highlights: {
    type: [String],
  },
  images: {
    type: [String],
  },
});

const Product = model('Product', productSchema);

export default Product;
