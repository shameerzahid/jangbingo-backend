import { PrismaClient, JobPostType, JobPostCategory } from '@prisma/client';
import { CreateJobPostRequest, UpdateJobPostRequest, JobPostFilters, JobPostResponse, UserCommunitiesResponse, CommunityUsersResponse } from '../types/jobPost';

const prisma = new PrismaClient();

export class JobPostService {
  // Equipment type and length mappings
  private readonly equipmentLengths = {
    '1 ton': [16, 18, 20, 21],
    '2.5 ton': [22, 24, 25],
    '3.5 ton': [28, 30, 32, 35],
    '5 ton': [38, 40, 45, 50, 54],
    '18 ton': [58, 60, 65, 70],
    '19 ton': [75],
    '3.5 tons of bending': [28],
    'Refraction 5 tons': [40],
    'Refraction 60M': [60],
    'Refraction 70M': [70]
  };

  async createJobPost(userId: number, data: CreateJobPostRequest): Promise<JobPostResponse> {
    // Validate job post type and required fields
    this.validateJobPostData(data);

    // Validate SKY category specific fields
    if (data.category === JobPostCategory.SKY) {
      this.validateSkyJobPostData(data);
    }

    // Check if user has permission to post in community (if community type)
    if (data.type === JobPostType.COMMUNITY && data.communityId) {
      await this.validateCommunityAccess(userId, data.communityId);
    }

    // Check if designated user exists and is accessible (if designated type)
    if (data.type === JobPostType.DESIGNATED && data.designatedUserId) {
      await this.validateDesignatedUserAccess(userId, data.designatedUserId);
    }


    // For COMMUNITY type, get default fees from community settings
    let communityWorkFee = data.communityWorkFee;
    let communitySupportFee = data.communitySupportFee;
    
    if (data.type === JobPostType.COMMUNITY && data.communityId) {
      const community = await prisma.community.findUnique({
        where: { id: data.communityId },
        select: { defaultWorkFee: true, defaultSupportFee: true },
      });
      
      if (community) {
        communityWorkFee = communityWorkFee || (community.defaultWorkFee ? Number(community.defaultWorkFee) : 5);
        communitySupportFee = communitySupportFee || (community.defaultSupportFee ? Number(community.defaultSupportFee) : 2);
      }
    }

    const jobPost = await prisma.jobPost.create({
      data: {
        type: data.type,
        category: data.category,
        authorId: userId,
        communityId: data.communityId ?? null,
        designatedUserId: data.designatedUserId ?? null,
        
        // Equipment Selection
        equipmentType: data.equipmentType,
        equipmentLengths: data.equipmentLengths,
      
      // Ladder-specific fields
      ladderType: data.ladderType ?? null,
      luggageVolume: data.luggageVolume ?? null,
      workFloor: data.workFloor ?? null,
      overallHeight: data.overallHeight ?? null,
      
      // Ladder Work Schedule (for ON_SITE type)
      ladderWorkDuration: data.ladderWorkDuration ?? null,
      ladderWorkHours: data.ladderWorkHours ?? null,
      
      // Ladder Options
      loadingUnloadingService: data.loadingUnloadingService ?? null,
      travelDistance: data.travelDistance ?? null,
      dumpService: data.dumpService || false,
      
      // Ladder-specific pricing
      movingFee: data.movingFee ?? null,
      onSiteFee: data.onSiteFee ?? null,
        
        // Work Details
        workDateType: data.workDateType,
        workDate: data.workDate ?? null,
        arrivalTime: data.arrivalTime,
        workSchedule: data.workSchedule,
        customHours: data.customHours ?? null,
        
        // Pricing
        workCost: data.workCost,
        isNightWork: data.isNightWork || false,
        priceAdjustment: data.priceAdjustment ?? null,
        
        // Payment
        paymentMethod: data.paymentMethod,
        expectedPaymentDate: data.expectedPaymentDate,
        
        // Fee Structure
        withFee: data.withFee,
        totalWorkFee: data.totalWorkFee ?? null,
        unitPriceFee: data.unitPriceFee ?? null,
        
        // Community Fee Structure (for COMMUNITY type)
        communityWorkFee: communityWorkFee ?? null,
        communitySupportFee: communitySupportFee ?? null,
        
        // Location and Contact
        siteAddress: data.siteAddress,
        contactNumber: data.contactNumber,
        
        // Work Information
        workContents: data.workContents,
        deliveryInfo: data.deliveryInfo,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
        community: {
          select: {
            id: true,
            title: true,
          },
        },
        designatedUser: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    return this.formatJobPostResponse(jobPost);
  }

  async getJobPosts(filters: JobPostFilters = {}, userId?: number): Promise<JobPostResponse[]> {
    const where: any = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }


    // For community posts, only show posts from communities user is member of
    if (filters.communityId) {
      where.communityId = filters.communityId;
    } else if (userId) {
      // Get user's communities for filtering
      const userCommunities = await this.getUserCommunities(userId);
      const communityIds = userCommunities.map(c => c.id);

      where.OR = [
        { type: JobPostType.GLOBAL },
        { type: JobPostType.COMMUNITY, communityId: { in: communityIds } },
        { type: JobPostType.DESIGNATED, designatedUserId: userId },
      ];
    } else {
      // If no user, only show global posts
      where.type = JobPostType.GLOBAL;
    }

    const jobPosts = await prisma.jobPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
        community: {
          select: {
            id: true,
            title: true,
          },
        },
        designatedUser: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jobPosts.map(post => this.formatJobPostResponse(post));
  }

  async getJobPostById(id: number, userId?: number): Promise<JobPostResponse | null> {
    const jobPost = await prisma.jobPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
        community: {
          select: {
            id: true,
            title: true,
          },
        },
        designatedUser: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    if (!jobPost) {
      return null;
    }

    // Check if user has access to this job post
    if (userId && !this.hasAccessToJobPost(jobPost, userId)) {
      return null;
    }

    return this.formatJobPostResponse(jobPost);
  }

  async updateJobPost(id: number, userId: number, data: UpdateJobPostRequest): Promise<JobPostResponse | null> {
    const existingJobPost = await prisma.jobPost.findUnique({
      where: { id },
    });

    if (!existingJobPost || existingJobPost.authorId !== userId) {
      return null;
    }

    const updateData: any = {};
    if (data.category !== undefined) {
      updateData.category = data.category;
    }

    const updatedJobPost = await prisma.jobPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
        community: {
          select: {
            id: true,
            title: true,
          },
        },
        designatedUser: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    return this.formatJobPostResponse(updatedJobPost);
  }

  async deleteJobPost(id: number, userId: number): Promise<boolean> {
    const jobPost = await prisma.jobPost.findUnique({
      where: { id },
    });

    if (!jobPost || jobPost.authorId !== userId) {
      return false;
    }

    await prisma.jobPost.delete({
      where: { id },
    });

    return true;
  }

  async getUserCommunities(userId: number): Promise<UserCommunitiesResponse[]> {
    const memberships = await prisma.communityMember.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        community: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    return memberships.map(membership => ({
      id: membership.community.id,
      title: membership.community.title,
      description: membership.community.description || undefined,
      role: membership.role,
      joinedAt: membership.joinedAt,
    }));
  }

  async getCommunityUsers(userId: number, communityId: number): Promise<CommunityUsersResponse[]> {
    // Check if user is member of the community
    const userMembership = await prisma.communityMember.findFirst({
      where: {
        userId,
        communityId,
        isActive: true,
      },
    });

    if (!userMembership) {
      throw new Error('User is not a member of this community');
    }

    const members = await prisma.communityMember.findMany({
      where: {
        communityId,
        isActive: true,
        userId: { not: userId }, // Exclude current user
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            nickname: true,
            email: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    return members.map(member => ({
      id: member.user.id,
      name: member.user.name || undefined,
      nickname: member.user.nickname || undefined,
      email: member.user.email || undefined,
      role: member.role,
      joinedAt: member.joinedAt,
    }));
  }

  private validateJobPostData(data: CreateJobPostRequest): void {
    if (data.type === JobPostType.COMMUNITY && !data.communityId) {
      throw new Error('Community ID is required for community job posts');
    }

    if (data.type === JobPostType.DESIGNATED && !data.designatedUserId) {
      throw new Error('Designated user ID is required for designated job posts');
    }
  }

  private validateSkyJobPostData(data: CreateJobPostRequest): void {
    // Validate equipment type and lengths
    if (data.equipmentType && data.equipmentLengths) {
      const validLengths = this.equipmentLengths[data.equipmentType as keyof typeof this.equipmentLengths];
      if (!validLengths) {
        throw new Error(`Invalid equipment type ${data.equipmentType}`);
      }
      
      for (const length of data.equipmentLengths) {
        if (!validLengths.includes(length)) {
          throw new Error(`Invalid equipment length ${length} for equipment type ${data.equipmentType}. Valid lengths: ${validLengths.join(', ')}`);
        }
      }
    }

    // Validate work date
    if (data.workDateType === 'CUSTOM_DATE' && !data.workDate) {
      throw new Error('Work date is required when work date type is CUSTOM_DATE');
    }

    // Validate arrival time format
    if (data.arrivalTime && !this.isValidTimeFormat(data.arrivalTime)) {
      throw new Error('Invalid arrival time format. Use format like "6:30" or "14:30"');
    }

    // workSchedule validation removed - now accepts any string

    // Validate custom hours
    if (data.workSchedule && data.workSchedule.includes('hour') && !data.customHours) {
      throw new Error('Custom hours required when work schedule includes hours');
    }
  }

  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }



  private async validateCommunityAccess(userId: number, communityId: number): Promise<void> {
    const membership = await prisma.communityMember.findFirst({
      where: {
        userId,
        communityId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new Error('User is not a member of this community');
    }
  }

  private async validateDesignatedUserAccess(userId: number, designatedUserId: number): Promise<void> {
    // Get all communities where the current user is a member
    const userCommunities = await prisma.communityMember.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        communityId: true,
      },
    });

    const communityIds = userCommunities.map(c => c.communityId);

    // Check if the designated user is also a member of any of these communities
    const designatedUserMembership = await prisma.communityMember.findFirst({
      where: {
        userId: designatedUserId,
        communityId: { in: communityIds },
        isActive: true,
      },
    });

    if (!designatedUserMembership) {
      throw new Error('Designated user is not accessible (not in any shared communities)');
    }
  }

  private hasAccessToJobPost(jobPost: any, userId: number): boolean {
    if (jobPost.type === JobPostType.GLOBAL) {
      return true;
    }

    if (jobPost.type === JobPostType.DESIGNATED && jobPost.designatedUserId === userId) {
      return true;
    }

    if (jobPost.type === JobPostType.COMMUNITY) {
      // This will be checked at the query level
      return true;
    }

    return false;
  }

  private formatJobPostResponse(jobPost: any): JobPostResponse {
    return {
      id: jobPost.id,
      type: jobPost.type,
      category: jobPost.category,
      authorId: jobPost.authorId,
      communityId: jobPost.communityId || undefined,
      designatedUserId: jobPost.designatedUserId || undefined,
      
      // Equipment Selection
      equipmentType: jobPost.equipmentType,
      equipmentLengths: jobPost.equipmentLengths,
      
      // Ladder-specific fields
      ladderType: jobPost.ladderType || undefined,
      luggageVolume: jobPost.luggageVolume || undefined,
      workFloor: jobPost.workFloor || undefined,
      overallHeight: jobPost.overallHeight || undefined,
      
      // Ladder Work Schedule (for ON_SITE type)
      ladderWorkDuration: jobPost.ladderWorkDuration || undefined,
      ladderWorkHours: jobPost.ladderWorkHours || undefined,
      
      // Ladder Options
      loadingUnloadingService: jobPost.loadingUnloadingService || undefined,
      travelDistance: jobPost.travelDistance || undefined,
      dumpService: jobPost.dumpService || false,
      
      // Ladder-specific pricing
      movingFee: jobPost.movingFee ? Number(jobPost.movingFee) : undefined,
      onSiteFee: jobPost.onSiteFee ? Number(jobPost.onSiteFee) : undefined,
      
      // Work Details
      workDateType: jobPost.workDateType,
      workDate: jobPost.workDate || undefined,
      arrivalTime: jobPost.arrivalTime,
      workSchedule: jobPost.workSchedule,
      customHours: jobPost.customHours || undefined,
      
      // Pricing
      workCost: Number(jobPost.workCost),
      isNightWork: jobPost.isNightWork || false,
      priceAdjustment: jobPost.priceAdjustment || undefined,
      
      // Payment
      paymentMethod: jobPost.paymentMethod,
      expectedPaymentDate: jobPost.expectedPaymentDate,
      
      // Fee Structure
      withFee: jobPost.withFee,
      totalWorkFee: jobPost.totalWorkFee ? Number(jobPost.totalWorkFee) : undefined,
      unitPriceFee: jobPost.unitPriceFee ? Number(jobPost.unitPriceFee) : undefined,
      
      // Community Fee Structure
      communityWorkFee: jobPost.communityWorkFee ? Number(jobPost.communityWorkFee) : undefined,
      communitySupportFee: jobPost.communitySupportFee ? Number(jobPost.communitySupportFee) : undefined,
      
      // Location and Contact
      siteAddress: jobPost.siteAddress,
      contactNumber: jobPost.contactNumber,
      
      // Work Information
      workContents: jobPost.workContents,
      deliveryInfo: jobPost.deliveryInfo,
      
      createdAt: jobPost.createdAt,
      updatedAt: jobPost.updatedAt,
      author: jobPost.author || undefined,
      community: jobPost.community || undefined,
      designatedUser: jobPost.designatedUser || undefined,
    };
  }
}
