import { JobPostType, JobPostCategory, PaymentMethod, LadderType } from '@prisma/client';

export interface CreateJobPostRequest {
  type: JobPostType;
  category: JobPostCategory;
  communityId?: number | undefined;
  designatedUserId?: number | undefined;
  
  // Equipment Selection (Required for SKY, not needed for LADDER)
  equipmentType?: string | undefined;
  equipmentLengths?: number[] | undefined;
  
  // Ladder-specific fields (for LADDER category)
  ladderType?: LadderType | undefined;
  machineType?: string | undefined;
  luggageVolume?: string | undefined;
  workFloor?: string | undefined;
  overallHeight?: string | undefined;
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration?: string | undefined;
  ladderWorkHours?: number | undefined;
  
  // Ladder Options (Optional) - Will be saved in separate JobPostOptions table
  options?: {
    loadingUnloadingService?: string | undefined;
    travelDistance?: string | undefined;
    dumpService?: boolean | undefined;
  } | undefined;
  
  // Ladder-specific pricing
  movingFee?: number | undefined;
  onSiteFee?: number | undefined;
  
  // Work Details
  workDateType: string;
  arrivalTime: string;
  workSchedule?: string | undefined;
  customHours?: number | undefined;
  
  // Pricing
  workCost: number;
  isNightWork?: boolean | undefined;
  priceAdjustment?: number | undefined;
  
  // Payment
  paymentMethod: PaymentMethod;
  expectedPaymentDate: string;
  
  // Fee Structure
  withFee: boolean;
  totalWorkFee?: number | undefined;
  unitPriceFee?: number | undefined;
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee?: number | undefined;
  communitySupportFee?: number | undefined;
  
  // Location and Contact
  siteAddress: string;
  contactNumber: string;
  
  // Work Information
  workContents?: string | undefined;
  deliveryInfo: string;
}

export interface UpdateJobPostRequest {
  category?: JobPostCategory | undefined;
  
  // Equipment Selection (Required for SKY, not needed for LADDER)
  equipmentType?: string | undefined;
  equipmentLengths?: number[] | undefined;
  
  // Ladder-specific fields (for LADDER category)
  ladderType?: LadderType | undefined;
  machineType?: string | undefined;
  luggageVolume?: string | undefined;
  workFloor?: string | undefined;
  overallHeight?: string | undefined;
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration?: string | undefined;
  ladderWorkHours?: number | undefined;
  
  // Ladder Options (Optional) - Will be saved in separate JobPostOptions table
  options?: {
    loadingUnloadingService?: string | undefined;
    travelDistance?: string | undefined;
    dumpService?: boolean | undefined;
  } | undefined;
  
  // Ladder-specific pricing
  movingFee?: number | undefined;
  onSiteFee?: number | undefined;
  
  // Work Details
  workDateType: string;
  arrivalTime: string;
  workSchedule?: string | undefined;
  customHours?: number | undefined;
  
  // Pricing
  workCost: number;
  isNightWork?: boolean | undefined;
  priceAdjustment?: number | undefined;
  
  // Payment
  paymentMethod: PaymentMethod;
  expectedPaymentDate: string;
  
  // Fee Structure
  withFee: boolean;
  totalWorkFee?: number | undefined;
  unitPriceFee?: number | undefined;
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee?: number | undefined;
  communitySupportFee?: number | undefined;
  
  // Location and Contact
  siteAddress: string;
  contactNumber: string;
  
  // Work Information
  workContents: string;
  deliveryInfo: string;
}

export interface JobPostFilters {
  type?: JobPostType;
  category?: JobPostCategory;
  communityId?: number | undefined;
  authorId?: number | undefined;
}

export interface JobPostResponse {
  id: number;
  type: JobPostType;
  category: JobPostCategory;
  authorId: number;
  communityId?: number | undefined;
  designatedUserId?: number | undefined;
  
  // Equipment Selection (Required for SKY, not needed for LADDER)
  equipmentType?: string | undefined;
  equipmentLengths?: number[] | undefined;
  
  // Ladder-specific fields (for LADDER category)
  ladderType?: LadderType | undefined;
  machineType?: string | undefined;
  luggageVolume?: string | undefined;
  workFloor?: string | undefined;
  overallHeight?: string | undefined;
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration?: string | undefined;
  ladderWorkHours?: number | undefined;
  
  // Ladder Options (Optional) - Will be saved in separate JobPostOptions table
  options?: {
    loadingUnloadingService?: string | undefined;
    travelDistance?: string | undefined;
    dumpService?: boolean | undefined;
  } | undefined;
  
  // Ladder-specific pricing
  movingFee?: number | undefined;
  onSiteFee?: number | undefined;
  
  // Work Details
  workDateType: string;
  arrivalTime: string;
  workSchedule?: string | undefined;
  customHours?: number | undefined;
  
  // Pricing
  workCost: number;
  isNightWork?: boolean | undefined;
  priceAdjustment?: number | undefined;
  
  // Payment
  paymentMethod: PaymentMethod;
  expectedPaymentDate: string;
  
  // Fee Structure
  withFee: boolean;
  totalWorkFee?: number | undefined;
  unitPriceFee?: number | undefined;
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee?: number | undefined;
  communitySupportFee?: number | undefined;
  
  // Location and Contact
  siteAddress: string;
  contactNumber: string;
  
  // Work Information
  workContents: string;
  deliveryInfo: string;
  
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: number;
    name?: string | undefined;
    nickname?: string | undefined;
  } | undefined;
  community?: {
    id: number;
    title: string;
  } | undefined;
  designatedUser?: {
    id: number;
    name?: string | undefined;
    nickname?: string | undefined;
  } | undefined;
}

export interface UserCommunitiesResponse {
  id: number;
  title: string;
  description?: string | undefined;
  role: string;
  joinedAt: Date;
}

export interface CommunityUsersResponse {
  id: number;
  name?: string | undefined;
  nickname?: string | undefined;
  email?: string | undefined;
  role: string;
  joinedAt: Date;
}