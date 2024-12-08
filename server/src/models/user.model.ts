import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface UserType extends Document {
  fullName: string;
  email: string;
  password: string;
  profilePic: string;
  generateToken: (payload: any) => Promise<string>;
  isPasswordValid: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema<UserType>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.generateToken = async function (payload: any): Promise<string> {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
  });
  return token;
};

UserSchema.methods.isPasswordValid = async function (password: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

export const User: Model<UserType> = mongoose.model<UserType>("User", UserSchema);
