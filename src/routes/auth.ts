import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { kakaoLoginSchema, KakaoLoginRequest } from "../types/auth";
import { decodeKakaoJwt, generateToken } from "../utils/jwt";
import { requireUser, AuthenticatedRequest } from "../middleware/auth";
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/kakao-login:
 *   post:
 *     summary: Kakao login
 *     description: Authenticate user with Kakao ID. If user exists, return user info and JWT. If not, create new user and return JWT.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KakaoLoginRequest'
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KakaoLoginResponse'
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KakaoLoginResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.post("/kakao-login", async (req: Request, res: Response) => {
  try {
    const result = kakaoLoginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        status: 400,
        data: {
          errors: result.error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
      });
    }

    const { idToken }: KakaoLoginRequest = result.data;

    logger.info(`Kakao login request: ${idToken}`);

    const decoded = decodeKakaoJwt(idToken);
    if (!decoded) {
      return res.status(400).json({
        message: "Invalid token",
        status: 400,
        data: null,
      });
    }

    const { sub: kakaoId, email, nickname } = decoded.payload as {
      sub: string;
      email: string;
      nickname: string;
    };

    logger.info(`Kakao login decoded: ${kakaoId} ${email} ${nickname}`);

    // Convert kakaoId to BigInt
    const kakaoIdBigInt = BigInt(kakaoId);

    // Check if user exists by kakaoId
    let user = await prisma.user.findUnique({
      where: { kakaoId: kakaoIdBigInt },
    });

    
    if (user) {
      const safeUser = {
        ...user,
        kakaoId: user.kakaoId!.toString(),
      };
      // User exists, return user info and JWT
      const token = generateToken({
        userId: user.id,
        role: user.role,
        kakaoId: user.kakaoId!.toString(),
      });

      return res.json({
        message: "User authenticated successfully",
        status: 200,
        data: {
          user: safeUser,
          token,
        },
      });
    }

    // User doesn't exist, create new user
    // Check if email is provided and if it already exists
    if (email) {
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUserWithEmail) {
        return res.status(400).json({
          message: "Email already exists",
          status: 400,
          data: {
            errors: [
              {
                field: "email",
                message: "A user with this email already exists",
              },
            ],
          },
        });
      }
    }

    // Create new user
    user = await prisma.user.create({
      data: {
        kakaoId: kakaoIdBigInt,
        email: email || null,
        nickname: nickname || null,
        role: "USER",
      },
    });

    const safeUser = {
      ...user,
      kakaoId: user.kakaoId!.toString(),
    };

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      role: user.role,
      kakaoId: user.kakaoId!.toString(),
    });

    return res.status(201).json({
      message: "User created successfully",
      status: 201,
      data: {
        user: safeUser,
        token,
      },
    });
  } catch (error) {
    logger.error("Error during Kakao login:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Get current user information using JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.get("/me", requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
        data: null,
      });
    }

    const safeUser = {
      ...user,
      kakaoId: user.kakaoId!.toString(),
    };

    return res.json({
      message: "User retrieved successfully",
      status: 200,
      data: safeUser,
    });
  } catch (error) {
    logger.error("Error getting current user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

export default router; 