import { z } from "zod";
import { UserRole } from "@prisma/client";

// Zod schemas for validation
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  email: z.string().email("Invalid email format").optional(),
  nickname: z.string().optional(),
  role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  email: z.string().email("Invalid email format").optional(),
  nickname: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export const userIdSchema = z.object({
  id: z.string().transform((val: string) => parseInt(val, 10)),
});

// TypeScript types
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;

// Swagger schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [USER, ADMIN]
 *       description: User role enumeration
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the user
 *           example: 1
 *         kakaoId:
 *           type: string
 *           description: Kakao user ID
 *           example: "123456789"
 *         name:
 *           type: string
 *           nullable: true
 *           description: User's full name (optional)
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           nullable: true
 *           description: User's email address (optional)
 *           example: "john.doe@example.com"
 *         nickname:
 *           type: string
 *           nullable: true
 *           description: User's nickname (optional)
 *           example: "JohnDoe"
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *           description: User's role
 *           example: "USER"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *           example: "2024-01-01T00:00:00.000Z"
 *       required:
 *         - id
 *         - role
 *         - createdAt
 *         - updatedAt
 *     CreateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name (optional)
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (optional)
 *           example: "john.doe@example.com"
 *         nickname:
 *           type: string
 *           description: User's nickname (optional)
 *           example: "JohnDoe"
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *           description: User's role (defaults to USER)
 *           example: "USER"
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name (optional)
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (optional)
 *           example: "john.doe@example.com"
 *         nickname:
 *           type: string
 *           description: User's nickname (optional)
 *           example: "JohnDoe"
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *           description: User's role
 *           example: "USER"
 *     UsersListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       description: Number of items per page
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       description: Total number of users
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                       example: 5
 *                   required:
 *                     - page
 *                     - limit
 *                     - total
 *                     - totalPages
 *               required:
 *                 - users
 *                 - pagination
 *     UserResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/User'
 */ 