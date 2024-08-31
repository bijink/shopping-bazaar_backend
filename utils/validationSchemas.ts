import { Schema } from 'express-validator';

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
  // lname: {
  //   notEmpty: true,
  //   errorMessage: 'last name is required',
  // },
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
  {
    file: {
      custom: {
        options: (value, { req }) => {
          if (!req.files || req.files.length === 2) {
            throw new Error('File is required');
          }
          return true;
        },
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
  size: {
    notEmpty: {
      errorMessage: 'size is required',
    },
    isArray: {
      options: { min: 1 },
      errorMessage: 'size must be an array with at least one value',
    },
    custom: {
      options: (value: string[]) => {
        const allowedValues = ['xxs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];
        return value.every((item) => allowedValues.includes(item));
      },
      errorMessage:
        'invalid size in size array, allowed values are (xxs, xs, s, m, l, xl, 2xl, 3xl)',
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
  color: {
    notEmpty: {
      errorMessage: 'color is required',
    },
    isArray: {
      options: { min: 1 },
      errorMessage: 'color must be an array with at least one value',
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
