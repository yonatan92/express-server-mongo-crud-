// import mongoose from 'mongoose';
// const { Schema, model } = mongoose;

// const UserSchema = new Schema({
//     first_name  : String,
//     last_name   : String,
//     email       : String,
//     phone       : String
// });

// export default model('user',UserSchema);

import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const userCreateScheme = new Schema(
  {
    first_name: { type: String, required: [true, 'First name is required'] },
    last_name: { type: String, required: [true, 'Last name is required'] },
    email: { type: String, required: true, unique: true },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, 'User phone number required'],
    },
  },
  { timestamps: true }
);

export const createUserModel = model('user', userCreateScheme);
