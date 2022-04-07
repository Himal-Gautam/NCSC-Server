import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Notice from "./notice.js";
import Subject from "./subject.js";
import "dotenv/config";
import chalk from 'chalk'


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a postive number");
        }
      },
    },
    phone: {
      type: Number,
      default: 0,
      unique: true,
      // validate(value) {
      //   if (!validator.isMobilePhone(value)) {
      //       throw new Error("Phone number is invalid");
      //     }
      //   }
    },
    image: {
      type: String,
      default: "https://i.pravatar.cc/300"
    },
    uid: {
      type: Number,
      default: 0,
      unique: true,
      // validate(value) {
      //   if (value < 0) {
      //     throw new Error("Age must be a postive number");
      //   }
      // },
    },
    otp: {
      type: Number,
      default: 0,
      // validate(value) {
      //   if (value < 0) {
      //     throw new Error("Age must be a postive number");
      //   }
      // },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
// userSchema.virtual("notices", {
//   ref: "Notice",
//   localField: "_id",
//   foreignField: "owner",
// });
userSchema.virtual("notices", {
  ref: "Notice",
  localField: "name",
  foreignField: "owner",
});

userSchema.virtual("attendances", {
  ref: "Attendance",
  localField: "_id",
  foreignField: "student",
});

userSchema.virtual("subjects", {
  ref: "Subject",
  localField: "uid",
  foreignField: "teacherId",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (uid, password) => {
  const user = await User.findOne({ uid: uid });
  if (!user) {
    throw new Error("User not found");
  }
  console.log(chalk.green("Uid has been found"));
  // const isMatch = password.localeCompare(user.password);
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password Mismatch");
  }
  console.log(chalk.green("Password match succesfful retruning user"));
  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user tasks when user is removed
// userSchema.pre("remove", async function (next) {
//   const user = this;
//   await Task.deleteMany({ owner: user._id });

//   next();
// });

const User = mongoose.model("User", userSchema);

export default User;
