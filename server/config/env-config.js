import { config } from "dotenv";

config();

const {
  DB_URL,
  PORT = 3000,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  CLOUDINARY_URL,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  JUDGE0_API_URL,
  JUDGE0_API_KEY,
} = process.env;

export const ENV = {
  DB_URL,
  PORT,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  CLOUDINARY_URL,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  JUDGE0_API_URL,
  JUDGE0_API_KEY,
};
