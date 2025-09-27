import { z } from 'zod';
import { JobPostType, JobPostCategory, PaymentMethod, WorkDateType, LadderType, LoadingUnloadingService, TravelDistance } from '@prisma/client';

export const createJobPostSchema = z.object({
  type: z.nativeEnum(JobPostType),
  category: z.nativeEnum(JobPostCategory),
  communityId: z.number().optional(),
  designatedUserId: z.number().optional(),
  
  // Equipment Selection (for SKY category)
  equipmentType: z.string().optional(),
  equipmentLength: z.number().optional(),
  
  // Ladder-specific fields (for LADDER category)
  ladderType: z.nativeEnum(LadderType).optional(),
  luggageVolume: z.string().refine((val) => {
    if (!val) return true; // Allow empty/undefined
    const validValues = [
      "1톤짐", "2.5톤짐", "5톤짐", "6톤짐", "7.5톤짐", 
      "10톤짐", "12.5톤짐", "15톤짐", "17.5톤짐", "20톤짐",
      "1 ton", "2.5 ton", "5 ton", "6 ton", "7.5 ton",
      "10 ton", "12.5 ton", "15 ton", "17.5 ton", "20 ton"
    ];
    return validValues.includes(val);
  }, {
    message: "Invalid luggage volume. Please select from valid options: 1톤짐, 2.5톤짐, 5톤짐, 6톤짐, 7.5톤짐, 10톤짐, 12.5톤짐, 15톤짐, 17.5톤짐, 20톤짐 or English equivalents."
  }).optional(),
  workFloor: z.number().int().min(2, 'Work floor must be at least 2').max(25, 'Work floor must be at most 25').optional(),
  overallHeight: z.number().int().min(1, 'Overall height must be at least 1 meter').max(100, 'Overall height must be at most 100 meters').optional(),
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration: z.string().optional(),
  ladderWorkHours: z.number().int().min(1, 'Work hours must be at least 1').max(24, 'Work hours must be at most 24').optional(),
  
  // Ladder Options
  loadingUnloadingService: z.nativeEnum(LoadingUnloadingService).optional(),
  travelDistance: z.nativeEnum(TravelDistance).optional(),
  dumpService: z.boolean().optional(),
  
  // Ladder-specific pricing
  movingFee: z.number().min(0, 'Moving fee must be at least 0').optional(),
  onSiteFee: z.number().min(0, 'On-site fee must be at least 0').optional(),
  
  // Work Details
  workDateType: z.nativeEnum(WorkDateType).optional(),
  workDate: z.date().optional(),
  arrivalTime: z.string().optional(),
  workSchedule: z.string().optional(),
  customHours: z.number().optional(),
  
  // Pricing
  basePrice: z.number().optional(),
  finalPrice: z.number().optional(),
  isNightWork: z.boolean().optional(),
  priceAdjustment: z.number().optional(),
  
  // Payment
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  expectedPaymentDate: z.string().optional(),
  
  // Fee Structure
  withFee: z.boolean().optional(),
  totalWorkFee: z.number().optional(),
  unitPriceFee: z.number().optional(),
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee: z.number().min(0).max(100).optional(),
  communitySupportFee: z.number().min(0).max(100).optional(),
  
  // Location and Contact
  siteAddress: z.string().optional(),
  contactNumber: z.string().optional(),
  
  // Work Information
  workContents: z.string().optional(),
  deliveryInfo: z.string().optional(),
});

export const updateJobPostSchema = z.object({
  category: z.nativeEnum(JobPostCategory).optional(),
  
  // Equipment Selection (for SKY category)
  equipmentType: z.string().optional(),
  equipmentLength: z.number().optional(),
  
  // Ladder-specific fields (for LADDER category)
  ladderType: z.nativeEnum(LadderType).optional(),
  luggageVolume: z.string().refine((val) => {
    if (!val) return true; // Allow empty/undefined
    const validValues = [
      "1톤짐", "2.5톤짐", "5톤짐", "6톤짐", "7.5톤짐", 
      "10톤짐", "12.5톤짐", "15톤짐", "17.5톤짐", "20톤짐",
      "1 ton", "2.5 ton", "5 ton", "6 ton", "7.5 ton",
      "10 ton", "12.5 ton", "15 ton", "17.5 ton", "20 ton"
    ];
    return validValues.includes(val);
  }, {
    message: "Invalid luggage volume. Please select from valid options: 1톤짐, 2.5톤짐, 5톤짐, 6톤짐, 7.5톤짐, 10톤짐, 12.5톤짐, 15톤짐, 17.5톤짐, 20톤짐 or English equivalents."
  }).optional(),
  workFloor: z.number().int().min(2, 'Work floor must be at least 2').max(25, 'Work floor must be at most 25').optional(),
  overallHeight: z.number().int().min(1, 'Overall height must be at least 1 meter').max(100, 'Overall height must be at most 100 meters').optional(),
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration: z.string().optional(),
  ladderWorkHours: z.number().int().min(1, 'Work hours must be at least 1').max(24, 'Work hours must be at most 24').optional(),
  
  // Ladder Options
  loadingUnloadingService: z.nativeEnum(LoadingUnloadingService).optional(),
  travelDistance: z.nativeEnum(TravelDistance).optional(),
  dumpService: z.boolean().optional(),
  
  // Ladder-specific pricing
  movingFee: z.number().min(0, 'Moving fee must be at least 0').optional(),
  onSiteFee: z.number().min(0, 'On-site fee must be at least 0').optional(),
  
  // Work Details
  workDateType: z.nativeEnum(WorkDateType).optional(),
  workDate: z.date().optional(),
  arrivalTime: z.string().optional(),
  workSchedule: z.string().optional(),
  customHours: z.number().optional(),
  
  // Pricing
  basePrice: z.number().optional(),
  finalPrice: z.number().optional(),
  isNightWork: z.boolean().optional(),
  priceAdjustment: z.number().optional(),
  
  // Payment
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  expectedPaymentDate: z.string().optional(),
  
  // Fee Structure
  withFee: z.boolean().optional(),
  totalWorkFee: z.number().optional(),
  unitPriceFee: z.number().optional(),
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee: z.number().min(0).max(100).optional(),
  communitySupportFee: z.number().min(0).max(100).optional(),
  
  // Location and Contact
  siteAddress: z.string().optional(),
  contactNumber: z.string().optional(),
  
  // Work Information
  workContents: z.string().optional(),
  deliveryInfo: z.string().optional(),
});

export const jobPostFiltersSchema = z.object({
  type: z.nativeEnum(JobPostType).optional(),
  category: z.nativeEnum(JobPostCategory).optional(),
  communityId: z.number().optional(),
  authorId: z.number().optional(),
});