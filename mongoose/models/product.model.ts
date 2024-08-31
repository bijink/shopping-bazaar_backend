import { model, Schema } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  images: { type: [String] },
});

const Product = model('Product', productSchema);

export default Product;
