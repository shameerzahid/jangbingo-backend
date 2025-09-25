import { z } from "zod";
import { UserRole } from "@prisma/client";

// Kakao login request schema
export const kakaoLoginSchema = z.object({
  idToken: z.string(),
});


// JWT payload type
export interface JWTPayload {
  userId: number;
  role: UserRole;
  kakaoId: string;
}

// Kakao login response type
export interface KakaoLoginResponse {
  user: {
    id: number;
    kakaoId: bigint;
    name: string | null;
    email: string | null;
    nickname: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
}

// TypeScript types
export type KakaoLoginRequest = z.infer<typeof kakaoLoginSchema>;

// Swagger schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     KakaoLoginRequest:
 *       type: object
 *       properties:
 *         idToken:
 *           type: string
 *           description: Kakao ID token (JWT)
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       required:
 *         - idToken
 *     KakaoLoginResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               required:
 *                 - user
 *                 - token
 */
