import { JobPostType, JobPostCategory, PaymentMethod, WorkDateType, LadderType, LoadingUnloadingService, TravelDistance } from '@prisma/client';

export interface CreateJobPostRequest {
  type: JobPostType;
  category: JobPostCategory;
  communityId?: number | undefined;
  designatedUserId?: number | undefined;
  
  // Equipment Selection (for SKY category)
  equipmentType?: string | undefined;
  equipmentLength?: number | undefined;
  
  // Ladder-specific fields (for LADDER category)
  ladderType?: LadderType | undefined;
  luggageVolume?: string | undefined;
  workFloor?: number | undefined;
  overallHeight?: number | undefined;
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration?: string | undefined;
  ladderWorkHours?: number | undefined;
  
  // Ladder Options
  loadingUnloadingService?: LoadingUnloadingService | undefined;
  travelDistance?: TravelDistance | undefined;
  dumpService?: boolean | undefined;
  
  // Ladder-specific pricing
  movingFee?: number | undefined;
  onSiteFee?: number | undefined;
  
  // Work Details
  workDateType?: WorkDateType | undefined;
  workDate?: Date | undefined;
  arrivalTime?: string | undefined;
  workSchedule?: string | undefined;
  customHours?: number | undefined;
  
  // Pricing
  basePrice?: number | undefined;
  finalPrice?: number | undefined;
  isNightWork?: boolean | undefined;
  priceAdjustment?: number | undefined;
  
  // Payment
  paymentMethod?: PaymentMethod | undefined;
  expectedPaymentDate?: string | undefined;
  
  // Fee Structure
  withFee?: boolean | undefined;
  totalWorkFee?: number | undefined;
  unitPriceFee?: number | undefined;
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee?: number | undefined;
  communitySupportFee?: number | undefined;
  
  // Location and Contact
  siteAddress?: string | undefined;
  contactNumber?: string | undefined;
  
  // Work Information
  workContents?: string | undefined;
  deliveryInfo?: string | undefined;
}

export interface UpdateJobPostRequest {
  category?: JobPostCategory | undefined;
  
  // Equipment Selection (for SKY category)
  equipmentType?: string | undefined;
  equipmentLength?: number | undefined;
  
  // Ladder-specific fields (for LADDER category)
  ladderType?: LadderType | undefined;
  luggageVolume?: string | undefined;
  workFloor?: number | undefined;
  overallHeight?: number | undefined;
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration?: string | undefined;
  ladderWorkHours?: number | undefined;
  
  // Ladder Options
  loadingUnloadingService?: LoadingUnloadingService | undefined;
  travelDistance?: TravelDistance | undefined;
  dumpService?: boolean | undefined;
  
  // Ladder-specific pricing
  movingFee?: number | undefined;
  onSiteFee?: number | undefined;
  
  // Work Details
  workDateType?: WorkDateType | undefined;
  workDate?: Date | undefined;
  arrivalTime?: string | undefined;
  workSchedule?: string | undefined;
  customHours?: number | undefined;
  
  // Pricing
  basePrice?: number | undefined;
  finalPrice?: number | undefined;
  isNightWork?: boolean | undefined;
  priceAdjustment?: number | undefined;
  
  // Payment
  paymentMethod?: PaymentMethod | undefined;
  expectedPaymentDate?: string | undefined;
  
  // Fee Structure
  withFee?: boolean | undefined;
  totalWorkFee?: number | undefined;
  unitPriceFee?: number | undefined;
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee?: number | undefined;
  communitySupportFee?: number | undefined;
  
  // Location and Contact
  siteAddress?: string | undefined;
  contactNumber?: string | undefined;
  
  // Work Information
  workContents?: string | undefined;
  deliveryInfo?: string | undefined;
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
  
  // Equipment Selection (for SKY category)
  equipmentType?: string | undefined;
  equipmentLength?: number | undefined;
  
  // Ladder-specific fields (for LADDER category)
  ladderType?: LadderType | undefined;
  luggageVolume?: string | undefined;
  workFloor?: number | undefined;
  overallHeight?: number | undefined;
  
  // Ladder Work Schedule (for ON_SITE type)
  ladderWorkDuration?: string | undefined;
  ladderWorkHours?: number | undefined;
  
  // Ladder Options
  loadingUnloadingService?: LoadingUnloadingService | undefined;
  travelDistance?: TravelDistance | undefined;
  dumpService?: boolean | undefined;
  
  // Ladder-specific pricing
  movingFee?: number | undefined;
  onSiteFee?: number | undefined;
  
  // Work Details
  workDateType?: WorkDateType | undefined;
  workDate?: Date | undefined;
  arrivalTime?: string | undefined;
  workSchedule?: string | undefined;
  customHours?: number | undefined;
  
  // Pricing
  basePrice?: number | undefined;
  finalPrice?: number | undefined;
  isNightWork?: boolean | undefined;
  priceAdjustment?: number | undefined;
  
  // Payment
  paymentMethod?: PaymentMethod | undefined;
  expectedPaymentDate?: string | undefined;
  
  // Fee Structure
  withFee?: boolean | undefined;
  totalWorkFee?: number | undefined;
  unitPriceFee?: number | undefined;
  
  // Community Fee Structure (for COMMUNITY type)
  communityWorkFee?: number | undefined;
  communitySupportFee?: number | undefined;
  
  // Location and Contact
  siteAddress?: string | undefined;
  contactNumber?: string | undefined;
  
  // Work Information
  workContents?: string | undefined;
  deliveryInfo?: string | undefined;
  
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