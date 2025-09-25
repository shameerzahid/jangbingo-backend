import { Router, Request, Response } from "express";

const router = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Get API health status
 *     description: Returns the current status of the API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: JangbiGO Backend is running!
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "JangbiGO Backend is running!",
    timestamp: new Date().toISOString(),
    environment: process.env["NODE_ENV"] || "development",
    version: "1.0.0",
  });
});

export default router;
