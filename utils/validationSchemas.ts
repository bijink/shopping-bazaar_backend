import { Schema } from 'express-validator';
import { Product } from '../types/global.type';

export const sendOtpSchema = {
  email: {
    notEmpty: {
      errorMessage: 'email is required',
    },
    isEmail: {
      errorMessage: 'invalid email',
    },
  },
};

export const userSignupSchema = {
  fname: {
    notEmpty: true,
    errorMessage: 'first name is required',
  },
  email: {
    notEmpty: {
      errorMessage: 'email is required',
    },
    isEmail: {
      errorMessage: 'invalid email',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'pasword is required',
    },
    isLength: {
      options: { min: 6, max: 12 },
      errorMessage: 'password should be in-between 6 and 12 chars',
    },
  },
  otp: {
    notEmpty: {
      errorMessage: 'otp is required',
    },
    isLength: {
      options: { min: 4, max: 4 },
      errorMessage: 'otp must be 4 digits',
    },
  },
};

export const userSigninSchema = {
  email: {
    notEmpty: {
      errorMessage: 'email is required',
    },
    isEmail: {
      errorMessage: 'invalid email',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'password is required',
    },
  },
};
export const fileUploadSchema: Schema[] = [
  {
    for: {
      in: ['query'],
      notEmpty: {
        errorMessage: 'FOR is required',
      },
    },
    id: {
      in: ['query'],
      notEmpty: {
        errorMessage: 'ID is required',
      },
      isMongoId: {
        errorMessage: 'ID must be a valid MongoDB ObjectId',
      },
    },
  },
];

export const productAddSchema = {
  name: {
    notEmpty: true,
    errorMessage: 'name is required',
  },
  suitableFor: {
    notEmpty: {
      errorMessage: 'suitableFor is required',
    },
    isArray: {
      options: { min: 1 },
      errorMessage: 'suitableFor must be an array with at least one value',
    },
    custom: {
      options: (value: string[]) => {
        // Ensure each item in the array is one of the allowed values
        const allowedValues = ['children', 'men', 'women'];
        return value.every((item) => allowedValues.includes(item));
      },
      errorMessage: 'invalid value in suitableFor array. allowed values are (children, men, women)',
    },
  },
  category: {
    notEmpty: true,
    errorMessage: 'category is required',
  },
  sizes: {
    custom: {
      options: (size: Product['sizes']) => {
        // Ensure `size` is an object
        if (typeof size !== 'object' || Array.isArray(size)) {
          throw new Error('Size must be an object');
        }
        const validFields = ['xxs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];
        // Ensure all required fields are present and are booleans
        for (const field of validFields) {
          if (!(field in size)) {
            throw new Error(`Missing required field: ${field}`);
          }
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          if (typeof (size as any)[field] !== 'boolean') {
            throw new Error(`Field ${field} must be a boolean`);
          }
        }
        // Ensure no extra fields are present
        const extraFields = Object.keys(size).filter((field) => !validFields.includes(field));
        if (extraFields.length > 0) {
          throw new Error(`Invalid extra fields: ${extraFields.join(', ')}`);
        }
        // Check if at least one field is true
        const atLeastOneTrue = Object.values(size).includes(true);
        if (!atLeastOneTrue) {
          throw new Error('At least one field must be true');
        }
        return true;
      },
    },
  },
  price: {
    notEmpty: {
      errorMessage: 'price is required',
    },
    isNumeric: {
      errorMessage: 'price must be a valid number',
    },
    toFloat: true,
  },
  colors: {
    notEmpty: {
      errorMessage: 'colors is required',
    },
    isArray: {
      options: { min: 1 },
      errorMessage: 'colors must be an array of object with at least one value',
    },
    custom: {
      options: (colors: Product['colors']) => {
        const hexValues = new Set(); // To track unique hex values
        for (const color of colors) {
          // Check that each item is an object
          if (typeof color !== 'object' || Array.isArray(color)) {
            throw new Error('Each item in colors must be an object with fields of name, hex');
          }
          // Check that 'name' exists and is a non-empty string
          if (!color.name || typeof color.name !== 'string' || color.name.trim() === '') {
            throw new Error('Each color object must have a valid "name" property');
          }
          // Check that 'hex' exists and is a non-empty string
          if (!color.hex || typeof color.hex !== 'string' || color.hex.trim() === '') {
            throw new Error('Each color object must have a valid "hex" property');
          }
          // Check if the hex value is a valid hex color
          const hexPattern = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
          if (!hexPattern.test(color.hex)) {
            throw new Error(`"${color.hex}" is not a valid hex color code`);
          }
          // Ensure no duplicate hex codes
          if (hexValues.has(color.hex)) {
            throw new Error(`Duplicate hex color found: "${color.hex}"`);
          }
          hexValues.add(color.hex); // Add hex value to the set
        }
        return true;
      },
    },
  },
  description: {
    notEmpty: {
      errorMessage: 'description is required',
    },
  },
  details: {
    notEmpty: {
      errorMessage: 'details is required',
    },
  },
  highlights: {
    optional: true, // Makes the field optional
    isArray: {
      options: { min: 0 },
      errorMessage: 'highlights must be an array',
    },
  },
};

export const cartAddSchema = {
  color: {
    notEmpty: {
      errorMessage: 'Color is required',
    },
    custom: {
      options: (color: { name: string; hex: string }) => {
        if (!color.name || !color.hex) {
          throw new Error('Color must have "name" and "hex" fields');
        }
        // Check if the hex value is a valid hex color
        const hexPattern = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
        if (!hexPattern.test(color.hex)) {
          throw new Error(`"${color.hex}" is not a valid hex color code`);
        }
        return true;
      },
    },
  },
  size: {
    notEmpty: {
      errorMessage: 'Size is required',
    },
    isIn: {
      options: [['xxs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl']],
      errorMessage: 'Size must be one of (xxs, xs, s, m, l, xl, 2xl, 3xl)',
    },
  },
};
