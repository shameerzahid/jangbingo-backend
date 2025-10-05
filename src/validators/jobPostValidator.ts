import { z } from 'zod';
import { JobPostType, JobPostCategory, PaymentMethod, LadderType } from '@prisma/client';

export const createJobPostSchema = z.object({
  type: z.nativeEnum(JobPostType),
  category: z.nativeEnum(JobPostCategory),
  communityId: z.number().optional(),
  designatedUserId: z.number().optional(),
  
  // Equipment Selection (Required for SKY, not needed for LADDER)
  equipmentType: z.string().optional(),
  equipmentLengths: z.array(z.number()).min(1, 'At least one equipment length is required').optional(),
  
  // Ladder-specific fields (for LADDER category)
  ladderType: z.nativeEnum(LadderType).optional(),
  machineType: z.string().optional(),
  luggageVolume: z.string().optional(),
  workFloor: z.string().optional(),
  overallHeight: z.string().optional(),
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration: z.string().optional(),
  ladderWorkHours: z.number().int().min(1, 'Work hours must be at least 1').max(24, 'Work hours must be at most 24').optional(),
  
  // Ladder Options (Optional for LADDER category) - Will be saved in JobPostOptions table
  options: z.object({
    loadingUnloadingService: z.string().optional(),  // Accepts any string
    travelDistance: z.string().optional(),             // Accepts any string  
    dumpService: z.boolean().optional(),              // Boolean option
  }).optional(),
  
  // Ladder-specific pricing
  movingFee: z.number().min(0, 'Moving fee must be at least 0').optional(),
  onSiteFee: z.number().min(0, 'On-site fee must be at least 0').optional(),
  
  // Work Details
  workDateType: z.string(),
  arrivalTime: z.string(),
  workSchedule: z.string().optional(),
  customHours: z.number().optional(),
  
  // Work Schedule Details
  
  // Pricing
  workCost: z.number().min(0, 'Work cost must be at least 0'),
  isNightWork: z.boolean().optional(),
  priceAdjustment: z.number().optional(),
  
  // Payment
  paymentMethod: z.nativeEnum(PaymentMethod),
  expectedPaymentDate: z.string(),
  
  // Fee Structure
  withFee: z.boolean(),
  totalWorkFee: z.number().optional(),
  unitPriceFee: z.number().optional(),
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee: z.number().min(0).max(100).optional(),
  communitySupportFee: z.number().min(0).max(100).optional(),
  
  // Location and Contact
  siteAddress: z.string(),
  contactNumber: z.string(),
  
  // Work Information
  workContents: z.string().optional(),
  deliveryInfo: z.string(),
}).strict().refine((data) => {
  // workContents is required for all flows EXCEPT Global/Designated -> Ladder -> Moving Goods
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED') && data.category === 'LADDER' && data.ladderType === 'MOVING_GOODS') {
    return true; // workContents is optional for these flows
  }
  return data.workContents !== undefined && data.workContents !== '';
}, {
  message: "Work contents is required for this job post type",
  path: ["workContents"]
}).refine((data) => {
  // luggageVolume is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.luggageVolume !== undefined && data.luggageVolume !== '';
  }
  return true; // luggageVolume is optional for other flows
}, {
  message: "Luggage volume is required for ladder job posts",
  path: ["luggageVolume"]
}).refine((data) => {
  // workFloor is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.workFloor !== undefined && data.workFloor !== '';
  }
  return true; // workFloor is optional for other flows
}, {
  message: "Work floor is required for ladder job posts",
  path: ["workFloor"]
}).refine((data) => {
  // machineType is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.machineType !== undefined && data.machineType !== '';
  }
  return true; // machineType is optional for other flows
}, {
  message: "Machine type is required for ladder job posts",
  path: ["machineType"]
}).refine((data) => {
  // overallHeight is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.overallHeight !== undefined && data.overallHeight !== '';
  }
  return true; // overallHeight is optional for other flows
}, {
  message: "Overall height is required for ladder job posts",
  path: ["overallHeight"]
}).refine((data) => {
  // options are required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.options !== undefined;
  }
  return true; // options are optional for other flows
}, {
  message: "Options are required for ladder job posts",
  path: ["options"]
}).refine((data) => {
  // workDateType is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.workDateType !== undefined && data.workDateType !== '';
  }
  return true; // workDateType is optional for other flows
}, {
  message: "Work date type is required for ladder job posts",
  path: ["workDateType"]
}).refine((data) => {
  // arrivalTime is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.arrivalTime !== undefined && data.arrivalTime !== '';
  }
  return true; // arrivalTime is optional for other flows
}, {
  message: "Arrival time is required for ladder job posts",
  path: ["arrivalTime"]
}).refine((data) => {
  // workSchedule is required for Global/Designated/Community -> Ladder -> ON_SITE flows only
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER' && data.ladderType === 'ON_SITE') {
    return data.workSchedule !== undefined && data.workSchedule !== '';
  }
  return true; // workSchedule is optional for other flows
}, {
  message: "Work schedule is required for ladder ON_SITE job posts",
  path: ["workSchedule"]
}).refine((data) => {
  // workCost is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.workCost !== undefined && data.workCost >= 0;
  }
  return true; // workCost is optional for other flows
}, {
  message: "Work cost is required for ladder job posts",
  path: ["workCost"]
}).refine((data) => {
  // paymentMethod is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.paymentMethod !== undefined;
  }
  return true; // paymentMethod is optional for other flows
}, {
  message: "Payment method is required for ladder job posts",
  path: ["paymentMethod"]
}).refine((data) => {
  // expectedPaymentDate is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.expectedPaymentDate !== undefined && data.expectedPaymentDate !== '';
  }
  return true; // expectedPaymentDate is optional for other flows
}, {
  message: "Expected payment date is required for ladder job posts",
  path: ["expectedPaymentDate"]
}).refine((data) => {
  // withFee is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.withFee !== undefined;
  }
  return true; // withFee is optional for other flows
}, {
  message: "With fee is required for ladder job posts",
  path: ["withFee"]
}).refine((data) => {
  // siteAddress is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.siteAddress !== undefined && data.siteAddress !== '';
  }
  return true; // siteAddress is optional for other flows
}, {
  message: "Site address is required for ladder job posts",
  path: ["siteAddress"]
}).refine((data) => {
  // contactNumber is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.contactNumber !== undefined && data.contactNumber !== '';
  }
  return true; // contactNumber is optional for other flows
}, {
  message: "Contact number is required for ladder job posts",
  path: ["contactNumber"]
}).refine((data) => {
  // deliveryInfo is required for Global/Designated/Community -> Ladder flows
  if ((data.type === 'GLOBAL' || data.type === 'DESIGNATED' || data.type === 'COMMUNITY') && data.category === 'LADDER') {
    return data.deliveryInfo !== undefined && data.deliveryInfo !== '';
  }
  return true; // deliveryInfo is optional for other flows
}, {
  message: "Delivery info is required for ladder job posts",
  path: ["deliveryInfo"]
});

export const updateJobPostSchema = z.object({
  category: z.nativeEnum(JobPostCategory).optional(),
  
  // Equipment Selection (Required for SKY, not needed for LADDER)
  equipmentType: z.string().optional(),
  equipmentLengths: z.array(z.number()).min(1, 'At least one equipment length is required').optional(),
  
  // Ladder-specific fields (for LADDER category)
  ladderType: z.nativeEnum(LadderType).optional(),
  machineType: z.string().optional(),
  luggageVolume: z.string().optional(),
  workFloor: z.string().optional(),
  overallHeight: z.string().optional(),
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration: z.string().optional(),
  ladderWorkHours: z.number().int().min(1, 'Work hours must be at least 1').max(24, 'Work hours must be at most 24').optional(),
  
  // Ladder Options (Optional for LADDER category) - Will be saved in JobPostOptions table
  options: z.object({
    loadingUnloadingService: z.string().optional(),  // Accepts any string
    travelDistance: z.string().optional(),             // Accepts any string  
    dumpService: z.boolean().optional(),              // Boolean option
  }).optional(),
  
  // Ladder-specific pricing
  movingFee: z.number().min(0, 'Moving fee must be at least 0').optional(),
  onSiteFee: z.number().min(0, 'On-site fee must be at least 0').optional(),
  
  // Work Details
  workDateType: z.string(),
  arrivalTime: z.string(),
  workSchedule: z.string().optional(),
  customHours: z.number().optional(),
  
  // Work Schedule Details
  
  // Pricing
  workCost: z.number().min(0, 'Work cost must be at least 0'),
  isNightWork: z.boolean().optional(),
  priceAdjustment: z.number().optional(),
  
  // Payment
  paymentMethod: z.nativeEnum(PaymentMethod),
  expectedPaymentDate: z.string(),
  
  // Fee Structure
  withFee: z.boolean(),
  totalWorkFee: z.number().optional(),
  unitPriceFee: z.number().optional(),
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee: z.number().min(0).max(100).optional(),
  communitySupportFee: z.number().min(0).max(100).optional(),
  
  // Location and Contact
  siteAddress: z.string(),
  contactNumber: z.string(),
  
  // Work Information
  workContents: z.string(),
  deliveryInfo: z.string(),
}).strict();

export const jobPostFiltersSchema = z.object({
  type: z.nativeEnum(JobPostType).optional(),
  category: z.nativeEnum(JobPostCategory).optional(),
  communityId: z.number().optional(),
  authorId: z.number().optional(),
}).strict();