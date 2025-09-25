import { z } from "zod";

// Zod schemas for validation
export const createEquipmentSchema = z.object({
  type: z.string().min(1, "Type is required").max(100, "Type too long"),
  tonnage: z.string().min(1, "Tonnage is required").max(50, "Tonnage too long"),
  length: z.string().optional(),
  axleLength: z.string().optional(),
  height: z.string().min(1, "Height is required").max(50, "Height too long"),
  options: z.string().optional(),
  // Result Information
  resultCd: z.string().optional(),
  resultMg: z.string().optional(),
  // G-Section Basic Information
  carRegno: z.string().optional(),
  admRegno: z.string().optional(),
  eraseDate: z.string().optional(),
  carName: z.string().optional(),
  carType: z.string().optional(),
  carVinaryNo: z.string().optional(),
  moverType: z.string().optional(),
  use: z.string().optional(),
  modelYear: z.string().optional(),
  color: z.string().optional(),
  sourceGb: z.string().optional(),
  firstRegDate: z.string().optional(),
  detailType: z.string().optional(),
  productDate: z.string().optional(),
  lastOwner: z.string().optional(),
  regno: z.string().optional(),
  locateUse: z.string().optional(),
  checkExpDate: z.string().optional(),
  confirmDate: z.string().optional(),
  closeDate: z.string().optional(),
  printName: z.string().optional(),
  // G-Section Detail Count
  gdCount: z.string().optional(),
  respOwnerDataInfo: z.string().optional(),
  // G-Section Details
  mainNo: z.string().optional(),
  subNo: z.string().optional(),
  detailRegNo: z.string().optional(),
  detailRegdate: z.string().optional(),
  receiptNo: z.string().optional(),
  mainChk: z.string().optional(),
  gdetailText: z.string().optional(),
  // E-Section Information
  ebCount: z.string().optional(),
  respMortgageDataInfo: z.string().optional(),
  ebNo: z.string().optional(),
  mortgageNo: z.string().optional(),
  mortgageeName: z.string().optional(),
  mortgageeAddr: z.string().optional(),
  mortgagorName: z.string().optional(),
  mortgagorAddr: z.string().optional(),
  debtorName: z.string().optional(),
  debtorAddr: z.string().optional(),
  bondAmount: z.string().optional(),
  mortgageDate: z.string().optional(),
  mortgageErase: z.string().optional(),
  mortgageClose: z.string().optional(),
  // E-Section Detail 1
  ed1Count: z.string().optional(),
  respMortgageDt1Info: z.string().optional(),
  rangking: z.string().optional(),
  ebDetailGb: z.string().optional(),
  edetailRegdate: z.string().optional(),
  edetailText: z.string().optional(),
  // E-Section Detail 2
  ed2Count: z.string().optional(),
  respMortgageDt2Info: z.string().optional(),
  edetailType: z.string().optional(),
  edetailCarno: z.string().optional(),
  edetailSetdate: z.string().optional(),
  edetailEraseDate: z.string().optional(),
});

export const updateEquipmentSchema = z.object({
  type: z.string().min(1, "Type is required").max(100, "Type too long").optional(),
  tonnage: z.string().min(1, "Tonnage is required").max(50, "Tonnage too long").optional(),
  length: z.string().optional(),
  axleLength: z.string().optional(),
  height: z.string().min(1, "Height is required").max(50, "Height too long").optional(),
  options: z.string().optional(),
  // Result Information
  resultCd: z.string().optional(),
  resultMg: z.string().optional(),
  // G-Section Basic Information
  carRegno: z.string().optional(),
  admRegno: z.string().optional(),
  eraseDate: z.string().optional(),
  carName: z.string().optional(),
  carType: z.string().optional(),
  carVinaryNo: z.string().optional(),
  moverType: z.string().optional(),
  use: z.string().optional(),
  modelYear: z.string().optional(),
  color: z.string().optional(),
  sourceGb: z.string().optional(),
  firstRegDate: z.string().optional(),
  detailType: z.string().optional(),
  productDate: z.string().optional(),
  lastOwner: z.string().optional(),
  regno: z.string().optional(),
  locateUse: z.string().optional(),
  checkExpDate: z.string().optional(),
  confirmDate: z.string().optional(),
  closeDate: z.string().optional(),
  printName: z.string().optional(),
  // G-Section Detail Count
  gdCount: z.string().optional(),
  respOwnerDataInfo: z.string().optional(),
  // G-Section Details
  mainNo: z.string().optional(),
  subNo: z.string().optional(),
  detailRegNo: z.string().optional(),
  detailRegdate: z.string().optional(),
  receiptNo: z.string().optional(),
  mainChk: z.string().optional(),
  gdetailText: z.string().optional(),
  // E-Section Information
  ebCount: z.string().optional(),
  respMortgageDataInfo: z.string().optional(),
  ebNo: z.string().optional(),
  mortgageNo: z.string().optional(),
  mortgageeName: z.string().optional(),
  mortgageeAddr: z.string().optional(),
  mortgagorName: z.string().optional(),
  mortgagorAddr: z.string().optional(),
  debtorName: z.string().optional(),
  debtorAddr: z.string().optional(),
  bondAmount: z.string().optional(),
  mortgageDate: z.string().optional(),
  mortgageErase: z.string().optional(),
  mortgageClose: z.string().optional(),
  // E-Section Detail 1
  ed1Count: z.string().optional(),
  respMortgageDt1Info: z.string().optional(),
  rangking: z.string().optional(),
  ebDetailGb: z.string().optional(),
  edetailRegdate: z.string().optional(),
  edetailText: z.string().optional(),
  // E-Section Detail 2
  ed2Count: z.string().optional(),
  respMortgageDt2Info: z.string().optional(),
  edetailType: z.string().optional(),
  edetailCarno: z.string().optional(),
  edetailSetdate: z.string().optional(),
  edetailEraseDate: z.string().optional(),
});

export const equipmentIdSchema = z.object({
  id: z.string().transform((val: string) => parseInt(val, 10)),
});

// TypeScript types
export type CreateEquipmentRequest = z.infer<typeof createEquipmentSchema>;
export type UpdateEquipmentRequest = z.infer<typeof updateEquipmentSchema>;
export type EquipmentIdParams = z.infer<typeof equipmentIdSchema>;

// Utility function to convert undefined values to null for Prisma compatibility
export const convertUndefinedToNull = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === undefined ? null : value
    ])
  );
};

// Swagger schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the equipment
 *           example: 1
 *         userId:
 *           type: integer
 *           description: ID of the user who owns this equipment
 *           example: 1
 *         type:
 *           type: string
 *           description: Vehicle type
 *           example: "Truck"
 *         tonnage:
 *           type: string
 *           description: Vehicle tonnage
 *           example: "5 tons"
 *         length:
 *           type: string
 *           nullable: true
 *           description: Vehicle length
 *           example: "6.5m"
 *         axleLength:
 *           type: string
 *           nullable: true
 *           description: Axle length
 *           example: "4.2m"
 *         height:
 *           type: string
 *           description: Vehicle height
 *           example: "3.5m"
 *         options:
 *           type: string
 *           nullable: true
 *           description: Equipment options/features
 *           example: "GPS, Air Conditioning, Backup Camera"
 *         resultCd:
 *           type: string
 *           nullable: true
 *           description: Result code
 *         resultMg:
 *           type: string
 *           nullable: true
 *           description: Result message
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Equipment creation timestamp
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Equipment last update timestamp
 *           example: "2024-01-01T00:00:00.000Z"
 *       required:
 *         - id
 *         - userId
 *         - type
 *         - tonnage
 *         - height
 *         - createdAt
 *         - updatedAt
 *     CreateEquipmentRequest:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Vehicle type
 *           example: "Truck"
 *         tonnage:
 *           type: string
 *           description: Vehicle tonnage
 *           example: "5 tons"
 *         length:
 *           type: string
 *           description: Vehicle length
 *           example: "6.5m"
 *         axleLength:
 *           type: string
 *           description: Axle length
 *           example: "4.2m"
 *         height:
 *           type: string
 *           description: Vehicle height
 *           example: "3.5m"
 *         options:
 *           type: string
 *           description: Equipment options/features
 *           example: "GPS, Air Conditioning"
 *       required:
 *         - type
 *         - tonnage
 *         - height
 *     UpdateEquipmentRequest:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: Vehicle type
 *           example: "Truck"
 *         tonnage:
 *           type: string
 *           description: Vehicle tonnage
 *           example: "5 tons"
 *         length:
 *           type: string
 *           description: Vehicle length
 *           example: "6.5m"
 *         axleLength:
 *           type: string
 *           description: Axle length
 *           example: "4.2m"
 *         height:
 *           type: string
 *           description: Vehicle height
 *           example: "3.5m"
 *         options:
 *           type: string
 *           description: Equipment options/features
 *           example: "GPS, Air Conditioning"
 *     EquipmentListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 equipment:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Equipment'
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
 *                       description: Total number of equipment
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
 *                 - equipment
 *                 - pagination
 *     EquipmentResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/BaseResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Equipment'
 */ 