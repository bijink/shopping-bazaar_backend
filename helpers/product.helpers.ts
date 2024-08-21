import { ParsedQs } from 'qs';
import { Product } from '../mongoose/models';

const productHelpers = {
  addProduct: async (reqData: {
    name: string;
    category: string;
    price: number;
    description: string;
  }) => {
    try {
      const product = new Product(reqData);
      await product.save();
      const insertedProduct = await Product.findById(product._id).exec();
      return Promise.resolve({ product: insertedProduct });
    } catch (error) {
      return Promise.reject();
    }
  },
  getAllProduct: async () => {
    try {
      const products = await Product.find({});
      return Promise.resolve(products);
    } catch (error) {
      return Promise.reject();
    }
  },
  getProduct: async (prodId: ParsedQs[string]) => {
    try {
      const product = await Product.findById(prodId).exec();
      if (!product) return Promise.reject({ status: 404, data: { message: 'product not found' } });
      return Promise.resolve({ status: 200, data: product });
    } catch (error) {
      return Promise.reject({ status: 400, data: error });
    }
  },
  deleteProduct: async (prodId: string) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(prodId);
      if (deletedProduct) {
        return Promise.resolve(deletedProduct);
      } else {
        throw 'Product not found';
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updateProduct: async (
    prodId: string,
    detailsToUpdate: {
      name?: string;
      category?: string;
      price?: number;
      description?: string;
    },
  ) => {
    try {
      await Product.updateOne({ _id: prodId }, detailsToUpdate);
      const updatedProduct = await Product.findById(prodId).exec();
      return Promise.resolve(updatedProduct);
    } catch (error) {
      return Promise.reject();
    }
  },
};

export default productHelpers;
