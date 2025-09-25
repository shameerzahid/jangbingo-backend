import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/user";
import { requireUser, requireAdmin, AuthenticatedRequest } from "../middleware/auth";
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users with optional pagination (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: role
 *         schema:
 *           $ref: '#/components/schemas/UserRole'
 *         description: Filter users by role
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       403:
 *         description: Forbidden - Admin access required
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
router.get("/", requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 10;
    const role = req.query["role"] as string;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        message: "Invalid pagination parameters",
        status: 400,
        data: {
          errors: [
            {
              field: "page",
              message: "Page must be greater than 0",
            },
            {
              field: "limit",
              message: "Limit must be between 1 and 100",
            },
          ],
        },
      });
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (role) {
      where.role = role;
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      message: "Users retrieved successfully",
      status: 200,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID (Users can only access their own profile, admins can access any)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       403:
 *         description: Forbidden - Can only access own profile unless admin
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
router.get("/:id", requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = userIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid user ID",
        errors: [
          {
            field: "id",
            message: "User ID must be a valid integer",
          },
        ],
        status: 400,
      });
    }

    const { id } = result.data;

    // Check if user is trying to access their own profile or is admin
    if (req.user!.role !== "ADMIN" && req.user!.userId !== id) {
      return res.status(403).json({
        message: "You can only access your own profile",
        status: 403,
        data: null,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: id as number },
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
      kakaoId: user.kakaoId?.toString(),
    };

    return res.json({
      message: "User retrieved successfully",
      status: 200,
      data: safeUser,
    });
  } catch (error) {
    logger.error("Error fetching user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided information (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       403:
 *         description: Forbidden - Admin access required
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
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = createUserSchema.safeParse(req.body);
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

    const userData: CreateUserRequest = result.data;

    // Check if email already exists
    if (userData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
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

    const user = await prisma.user.create({
      data: {
        name: userData.name || null,
        email: userData.email || null,
        nickname: userData.nickname || null,
        role: userData.role,
      },
    });

    const safeUser = {
      ...user,
      kakaoId: user.kakaoId?.toString(),
    };

    return res.status(201).json({
      message: "User created successfully",
      status: 201,
      data: safeUser,
    });
  } catch (error) {
    logger.error("Error creating user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     description: Update a specific user's information by their ID (Users can only update their own profile, admins can update any)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       403:
 *         description: Forbidden - Can only update own profile unless admin
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
router.put("/:id", requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Validate user ID
    const idResult = userIdSchema.safeParse(req.params);
    if (!idResult.success) {
      return res.status(400).json({
        message: "Invalid user ID",
        errors: [
          {
            field: "id",
            message: "User ID must be a valid integer",
          },
        ],
        status: 400,
      });
    }

    const { id } = idResult.data;

    // Check if user is trying to update their own profile or is admin
    if (req.user!.role !== "ADMIN" && req.user!.userId !== id) {
      return res.status(403).json({
        message: "You can only update your own profile",
        status: 403,
        data: null,
      });
    }

    // Validate request body
    const result = updateUserSchema.safeParse(req.body);
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

    const updateData: UpdateUserRequest = result.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
        data: null,
      });
    }

    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email },
      });

      if (emailExists) {
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

    // Filter out undefined values for Prisma
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const user = await prisma.user.update({
      where: { id: id as number },
      data: filteredData,
    });

    const safeUser = {
      ...user,
      kakaoId: user.kakaoId?.toString(),
    };

    return res.json({
      message: "User updated successfully",
      status: 200,
      data: safeUser,
    });
  } catch (error) {
    logger.error("Error updating user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete a specific user by their ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *         example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       403:
 *         description: Forbidden - Admin access required
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
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const result = userIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid user ID",
        status: 400,
        data: {
          errors: [
            {
              field: "id",
              message: "User ID must be a valid integer",
            },
          ],
        },
      });
    }

    const { id } = result.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
        data: null,
      });
    }

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    const safeUser = {
      ...deletedUser,
      kakaoId: deletedUser.kakaoId?.toString(),
    };

    return res.json({
      message: "User deleted successfully",
      status: 200,
      data: safeUser,
    });
  } catch (error) {
    logger.error("Error deleting user:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

export default router; 