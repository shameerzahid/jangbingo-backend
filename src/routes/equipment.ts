import { Router, Response } from "express";
import prisma from "../lib/prisma";
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  equipmentIdSchema,
  CreateEquipmentRequest,
  UpdateEquipmentRequest,
  convertUndefinedToNull,
} from "../types/equipment";
import { requireUser, AuthenticatedRequest } from "../middleware/auth";
import logger from "../utils/logger";

const router = Router();

/**
 * @swagger
 * /api/v1/equipment:
 *   get:
 *     summary: Get all equipment
 *     description: Retrieve a list of all equipment with optional pagination and filtering
 *     tags: [Equipment]
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
 *         description: Number of equipment per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter equipment by type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter equipment by user ID
 *     responses:
 *       200:
 *         description: List of equipment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EquipmentListResponse'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.get("/", requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query["page"] as string) || 1;
    const limit = parseInt(req.query["limit"] as string) || 10;
    const type = req.query["type"] as string;
    const userId = req.query["userId"] ? parseInt(req.query["userId"] as string) : null;

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
    if (type) {
      where.type = type;
    }
    if (userId) {
      where.userId = userId;
    }

    // If user is not admin, they can only see their own equipment
    if (req.user!.role !== "ADMIN") {
      where.userId = req.user!.userId;
    }

    // Get equipment with pagination
    const [equipment, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              nickname: true,
            },
          },
        },
      }),
      prisma.equipment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      message: "Equipment retrieved successfully",
      status: 200,
      data: {
        equipment,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    logger.error("Error fetching equipment:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

/**
 * @swagger
 * /api/v1/equipment/{id}:
 *   get:
 *     summary: Get equipment by ID
 *     description: Retrieve a specific equipment by their ID (Users can only access their own equipment, admins can access any)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Equipment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EquipmentResponse'
 *       400:
 *         description: Invalid equipment ID
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
 *         description: Forbidden - Can only access own equipment unless admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       404:
 *         description: Equipment not found
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
    const result = equipmentIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid equipment ID",
        status: 400,
        data: {
          errors: [
            {
              field: "id",
              message: "Equipment ID must be a valid integer",
            },
          ],
        },
      });
    }

    const { id } = result.data;

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            nickname: true,
          },
        },
      },
    });

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found",
        status: 404,
        data: null,
      });
    }

    // Check if user is trying to access their own equipment or is admin
    if (req.user!.role !== "ADMIN" && req.user!.userId !== equipment.userId) {
      return res.status(403).json({
        message: "You can only access your own equipment",
        status: 403,
        data: null,
      });
    }

    return res.json({
      message: "Equipment retrieved successfully",
      status: 200,
      data: equipment,
    });
  } catch (error) {
    logger.error("Error fetching equipment:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

/**
 * @swagger
 * /api/v1/equipment:
 *   post:
 *     summary: Create a new equipment
 *     description: Create a new equipment with the provided information
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEquipmentRequest'
 *     responses:
 *       201:
 *         description: Equipment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EquipmentResponse'
 *       400:
 *         description: Validation error
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 */
router.post("/", requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = createEquipmentSchema.safeParse(req.body);
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

    const equipmentData: CreateEquipmentRequest = result.data;

    // Convert undefined values to null for Prisma compatibility
    const prismaData = convertUndefinedToNull(equipmentData) as any;

    const equipment = await prisma.equipment.create({
      data: {
        ...prismaData,
        userId: req.user!.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            nickname: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Equipment created successfully",
      status: 201,
      data: equipment,
    });
  } catch (error) {
    logger.error("Error creating equipment:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

/**
 * @swagger
 * /api/v1/equipment/{id}:
 *   put:
 *     summary: Update equipment by ID
 *     description: Update a specific equipment's information by their ID (Users can only update their own equipment, admins can update any)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEquipmentRequest'
 *     responses:
 *       200:
 *         description: Equipment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EquipmentResponse'
 *       400:
 *         description: Validation error
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
 *         description: Forbidden - Can only update own equipment unless admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       404:
 *         description: Equipment not found
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
    // Validate equipment ID
    const idResult = equipmentIdSchema.safeParse(req.params);
    if (!idResult.success) {
      return res.status(400).json({
        message: "Invalid equipment ID",
        status: 400,
        data: {
          errors: [
            {
              field: "id",
              message: "Equipment ID must be a valid integer",
            },
          ],
        },
      });
    }

    const { id } = idResult.data;

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return res.status(404).json({
        message: "Equipment not found",
        status: 404,
        data: null,
      });
    }

    // Check if user is trying to update their own equipment or is admin
    if (req.user!.role !== "ADMIN" && req.user!.userId !== existingEquipment.userId) {
      return res.status(403).json({
        message: "You can only update your own equipment",
        status: 403,
        data: null,
      });
    }

    // Validate request body
    const result = updateEquipmentSchema.safeParse(req.body);
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

    const updateData: UpdateEquipmentRequest = result.data;

    // Convert undefined values to null for Prisma compatibility
    const filteredData = convertUndefinedToNull(updateData) as any;

    const equipment = await prisma.equipment.update({
      where: { id },
      data: filteredData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            nickname: true,
          },
        },
      },
    });

    return res.json({
      message: "Equipment updated successfully",
      status: 200,
      data: equipment,
    });
  } catch (error) {
    logger.error("Error updating equipment:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

/**
 * @swagger
 * /api/v1/equipment/{id}:
 *   delete:
 *     summary: Delete equipment by ID
 *     description: Delete a specific equipment by their ID (Users can only delete their own equipment, admins can delete any)
 *     tags: [Equipment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Equipment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Equipment'
 *       400:
 *         description: Invalid equipment ID
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
 *         description: Forbidden - Can only delete own equipment unless admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       404:
 *         description: Equipment not found
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
router.delete("/:id", requireUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = equipmentIdSchema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid equipment ID",
        status: 400,
        data: {
          errors: [
            {
              field: "id",
              message: "Equipment ID must be a valid integer",
            },
          ],
        },
      });
    }

    const { id } = result.data;

    // Check if equipment exists
    const existingEquipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!existingEquipment) {
      return res.status(404).json({
        message: "Equipment not found",
        status: 404,
        data: null,
      });
    }

    // Check if user is trying to delete their own equipment or is admin
    if (req.user!.role !== "ADMIN" && req.user!.userId !== existingEquipment.userId) {
      return res.status(403).json({
        message: "You can only delete your own equipment",
        status: 403,
        data: null,
      });
    }

    const deletedEquipment = await prisma.equipment.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            nickname: true,
          },
        },
      },
    });

    return res.json({
      message: "Equipment deleted successfully",
      status: 200,
      data: deletedEquipment,
    });
  } catch (error) {
    logger.error("Error deleting equipment:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null,
    });
  }
});

export default router; 