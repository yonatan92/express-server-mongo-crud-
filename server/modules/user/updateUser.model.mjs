import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userUpdateScheme = new Schema(
  {
    first_name: { type: String, required: [false, 'First name is required'] },
    last_name: { type: String, required: [false, 'Last name is required'] },
    email: { type: String, required: false, unique: true },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [false, 'User phone number required'],
    },
  },
  { timestamps: true }
);

export const updateUserModel = model('user', userUpdateScheme);
