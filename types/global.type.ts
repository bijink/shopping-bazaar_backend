export interface Base64Image {
  name: string;
  data: string;
  mimeType: string;
}

export interface Product {
  _id: string;
  name: string;
  suitableFor: string[];
  category: string;
  sizes: {
    xxs: boolean;
    xs: boolean;
    s: boolean;
    m: boolean;
    l: boolean;
    xl: boolean;
    '2xl': boolean;
    '3xl': boolean;
  };
  price: number;
  colors: { name: string; hex: string }[];
  description: string;
  details: string;
  highlights: string[];
  images: string[];
}

export type UserAddress = {
  fullname: string;
  building: string;
  street: string;
  town: string;
  state: string;
  pincode: string;
  landmark: string;
};
