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
