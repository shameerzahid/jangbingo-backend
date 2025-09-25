import jwt, { SignOptions } from "jsonwebtoken";
import { JWTPayload } from "../types/auth";

const JWT_SECRET = process.env["JWT_SECRET"] || "your-secret-key";
const JWT_EXPIRES_IN = process.env["JWT_EXPIRES_IN"] || "7d";

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}; 


export const decodeKakaoJwt = (token: string) => {
    try {
        const decoded = jwt.decode(token, { complete: true }); // complete: true gives header and payload
        return decoded;
    } catch (err) {
        console.error('Failed to decode token:', err);
        return null;
    }
}