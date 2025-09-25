import { PrismaClient, CommunityStatus, CommunityRole } from '@prisma/client';
import { CreateCommunityRequest, UpdateCommunityRequest, JoinCommunityRequest, InviteUserRequest, UpdateMemberRoleRequest, CommunityResponse, CommunityMemberResponse, CommunityFilters } from '../types/community';

const prisma = new PrismaClient();

export class CommunityService {
  async createCommunity(userId: number, data: CreateCommunityRequest): Promise<CommunityResponse> {
    // Generate slug if not provided
    const slug = data.slug || this.generateSlug(data.title);

    // Check if slug is unique
    const existingCommunity = await prisma.community.findUnique({
      where: { slug },
    });

    if (existingCommunity) {
      throw new Error('Community slug already exists');
    }

    const community = await prisma.community.create({
      data: {
        title: data.title,
        description: data.description || null,
        slug,
        status: data.status || CommunityStatus.ACTIVE,
        isPrivate: data.isPrivate || false,
        maxMembers: data.maxMembers || null,
        defaultWorkFee: data.defaultWorkFee || 5,
        defaultSupportFee: data.defaultSupportFee || 2,
      },
    });

    // Add creator as owner
    await prisma.communityMember.create({
      data: {
        userId,
        communityId: community.id,
        role: CommunityRole.OWNER,
        isActive: true,
      },
    });

    return this.formatCommunityResponse(community);
  }

  async getCommunities(filters: CommunityFilters = {}): Promise<CommunityResponse[]> {
    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.isPrivate !== undefined) {
      where.isPrivate = filters.isPrivate;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const communities = await prisma.community.findMany({
      where,
      include: {
        members: {
          where: { isActive: true },
          select: { id: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return communities.map(community => ({
      ...this.formatCommunityResponse(community),
      memberCount: community.members.length,
    }));
  }

  async getCommunityById(id: number): Promise<CommunityResponse | null> {
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        members: {
          where: { isActive: true },
          select: { id: true },
        },
      },
    });

    if (!community) {
      return null;
    }

    return {
      ...this.formatCommunityResponse(community),
      memberCount: community.members.length,
    };
  }

  async updateCommunity(id: number, userId: number, data: UpdateCommunityRequest): Promise<CommunityResponse | null> {
    // Check if user is owner or admin
    const membership = await prisma.communityMember.findFirst({
      where: {
        communityId: id,
        userId,
        role: { in: [CommunityRole.OWNER, CommunityRole.ADMIN] },
        isActive: true,
      },
    });

    if (!membership) {
      throw new Error('Insufficient permissions to update community');
    }

    // Check if slug is unique (if provided)
    if (data.slug) {
      const existingCommunity = await prisma.community.findFirst({
        where: {
          slug: data.slug,
          id: { not: id },
        },
      });

      if (existingCommunity) {
        throw new Error('Community slug already exists');
      }
    }

    const community = await prisma.community.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.slug && { slug: data.slug }),
        ...(data.status && { status: data.status }),
        ...(data.isPrivate !== undefined && { isPrivate: data.isPrivate }),
        ...(data.maxMembers !== undefined && { maxMembers: data.maxMembers }),
        ...(data.defaultWorkFee !== undefined && { defaultWorkFee: data.defaultWorkFee }),
        ...(data.defaultSupportFee !== undefined && { defaultSupportFee: data.defaultSupportFee }),
      },
    });

    return this.formatCommunityResponse(community);
  }

  async deleteCommunity(id: number, userId: number): Promise<boolean> {
    // Check if user is owner
    const membership = await prisma.communityMember.findFirst({
      where: {
        communityId: id,
        userId,
        role: CommunityRole.OWNER,
        isActive: true,
      },
    });

    if (!membership) {
      throw new Error('Only community owner can delete the community');
    }

    await prisma.community.delete({
      where: { id },
    });

    return true;
  }

  async joinCommunity(userId: number, data: JoinCommunityRequest): Promise<CommunityMemberResponse> {
    const community = await prisma.community.findUnique({
      where: { id: data.communityId },
    });

    if (!community) {
      throw new Error('Community not found');
    }

    // Check if user is already a member
    const existingMembership = await prisma.communityMember.findFirst({
      where: {
        communityId: data.communityId,
        userId,
      },
    });

    if (existingMembership) {
      if (existingMembership.isActive) {
        throw new Error('User is already a member of this community');
      } else {
        // Reactivate membership
        const membership = await prisma.communityMember.update({
          where: { id: existingMembership.id },
          data: { isActive: true },
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
        });

        return this.formatCommunityMemberResponse(membership);
      }
    }

    // Check if community has reached max members
    if (community.maxMembers) {
      const memberCount = await prisma.communityMember.count({
        where: {
          communityId: data.communityId,
          isActive: true,
        },
      });

      if (memberCount >= community.maxMembers) {
        throw new Error('Community has reached maximum member limit');
      }
    }

    const membership = await prisma.communityMember.create({
      data: {
        userId,
        communityId: data.communityId,
        role: CommunityRole.MEMBER,
        isActive: true,
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
    });

    return this.formatCommunityMemberResponse(membership);
  }

  async leaveCommunity(userId: number, communityId: number): Promise<boolean> {
    const membership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId,
        isActive: true,
      },
    });

    if (!membership) {
      throw new Error('User is not a member of this community');
    }

    // Check if user is the owner
    if (membership.role === CommunityRole.OWNER) {
      throw new Error('Community owner cannot leave the community. Transfer ownership or delete the community instead.');
    }

    await prisma.communityMember.update({
      where: { id: membership.id },
      data: { isActive: false },
    });

    return true;
  }

  async inviteUser(userId: number, data: InviteUserRequest): Promise<CommunityMemberResponse> {
    // Check if inviter has permission to invite
    const inviterMembership = await prisma.communityMember.findFirst({
      where: {
        communityId: data.communityId,
        userId,
        role: { in: [CommunityRole.OWNER, CommunityRole.ADMIN, CommunityRole.MODERATOR] },
        isActive: true,
      },
    });

    if (!inviterMembership) {
      throw new Error('Insufficient permissions to invite users');
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user is already a member
    const existingMembership = await prisma.communityMember.findFirst({
      where: {
        communityId: data.communityId,
        userId: data.userId,
      },
    });

    if (existingMembership) {
      if (existingMembership.isActive) {
        throw new Error('User is already a member of this community');
      } else {
        // Reactivate membership
        const membership = await prisma.communityMember.update({
          where: { id: existingMembership.id },
          data: { 
            isActive: true,
            role: data.role || CommunityRole.MEMBER,
            invitedBy: userId,
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
            inviter: {
              select: {
                id: true,
                name: true,
                nickname: true,
              },
            },
          },
        });

        return this.formatCommunityMemberResponse(membership);
      }
    }

    // Check if community has reached max members
    const community = await prisma.community.findUnique({
      where: { id: data.communityId },
    });

    if (community?.maxMembers) {
      const memberCount = await prisma.communityMember.count({
        where: {
          communityId: data.communityId,
          isActive: true,
        },
      });

      if (memberCount >= community.maxMembers) {
        throw new Error('Community has reached maximum member limit');
      }
    }

    const membership = await prisma.communityMember.create({
      data: {
        userId: data.userId,
        communityId: data.communityId,
        role: data.role || CommunityRole.MEMBER,
        invitedBy: userId,
        isActive: true,
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
        inviter: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    return this.formatCommunityMemberResponse(membership);
  }

  async getCommunityMembers(communityId: number, userId: number): Promise<CommunityMemberResponse[]> {
    // Check if user is a member of the community
    const userMembership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId,
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
        inviter: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' },
        { joinedAt: 'desc' },
      ],
    });

    return members.map(member => this.formatCommunityMemberResponse(member));
  }

  async updateMemberRole(communityId: number, adminUserId: number, data: UpdateMemberRoleRequest): Promise<CommunityMemberResponse> {
    // Check if admin has permission to update roles
    const adminMembership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId: adminUserId,
        role: { in: [CommunityRole.OWNER, CommunityRole.ADMIN] },
        isActive: true,
      },
    });

    if (!adminMembership) {
      throw new Error('Insufficient permissions to update member roles');
    }

    // Check if target user is a member
    const targetMembership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId: data.userId,
        isActive: true,
      },
    });

    if (!targetMembership) {
      throw new Error('User is not a member of this community');
    }

    // Prevent changing owner role
    if (targetMembership.role === CommunityRole.OWNER) {
      throw new Error('Cannot change owner role');
    }

    // Prevent non-owners from promoting to admin
    if (data.role === CommunityRole.ADMIN && adminMembership.role !== CommunityRole.OWNER) {
      throw new Error('Only owners can promote users to admin');
    }

    const updatedMembership = await prisma.communityMember.update({
      where: { id: targetMembership.id },
      data: { role: data.role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            nickname: true,
            email: true,
          },
        },
        inviter: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    return this.formatCommunityMemberResponse(updatedMembership);
  }

  async removeMember(communityId: number, adminUserId: number, targetUserId: number): Promise<boolean> {
    // Check if admin has permission to remove members
    const adminMembership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId: adminUserId,
        role: { in: [CommunityRole.OWNER, CommunityRole.ADMIN] },
        isActive: true,
      },
    });

    if (!adminMembership) {
      throw new Error('Insufficient permissions to remove members');
    }

    // Check if target user is a member
    const targetMembership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId: targetUserId,
        isActive: true,
      },
    });

    if (!targetMembership) {
      throw new Error('User is not a member of this community');
    }

    // Prevent removing owner
    if (targetMembership.role === CommunityRole.OWNER) {
      throw new Error('Cannot remove community owner');
    }

    // Prevent non-owners from removing admins
    if (targetMembership.role === CommunityRole.ADMIN && adminMembership.role !== CommunityRole.OWNER) {
      throw new Error('Only owners can remove admins');
    }

    await prisma.communityMember.update({
      where: { id: targetMembership.id },
      data: { isActive: false },
    });

    return true;
  }

  async getUserCommunities(userId: number): Promise<CommunityResponse[]> {
    const memberships = await prisma.communityMember.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        community: {
          include: {
            members: {
              where: { isActive: true },
              select: { id: true },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    return memberships.map(membership => ({
      ...this.formatCommunityResponse(membership.community),
      memberCount: membership.community.members.length,
    }));
  }

  async getAllUsersFromUserCommunities(userId: number): Promise<CommunityMemberResponse[]> {
    // Get all communities where the user is a member
    const userMemberships = await prisma.communityMember.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        communityId: true,
      },
    });

    const communityIds = userMemberships.map(membership => membership.communityId);

    if (communityIds.length === 0) {
      return [];
    }

    // Get all members from these communities (excluding the current user)
    const allMembers = await prisma.communityMember.findMany({
      where: {
        communityId: { in: communityIds },
        userId: { not: userId }, // Exclude current user
        isActive: true,
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
        community: {
          select: {
            id: true,
            title: true,
          },
        },
        inviter: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
      orderBy: [
        { user: { name: 'asc' } },
        { joinedAt: 'desc' },
      ],
    });

    // Remove duplicates based on userId and format response
    const uniqueUsers = new Map<number, CommunityMemberResponse>();
    
    allMembers.forEach(member => {
      if (!uniqueUsers.has(member.userId)) {
        uniqueUsers.set(member.userId, this.formatCommunityMemberResponse(member));
      }
    });

    return Array.from(uniqueUsers.values());
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private formatCommunityResponse(community: any): CommunityResponse {
    return {
      id: community.id,
      title: community.title,
      description: community.description,
      slug: community.slug,
      status: community.status,
      isPrivate: community.isPrivate,
      maxMembers: community.maxMembers,
      defaultWorkFee: community.defaultWorkFee ? Number(community.defaultWorkFee) : undefined,
      defaultSupportFee: community.defaultSupportFee ? Number(community.defaultSupportFee) : undefined,
      createdAt: community.createdAt,
      updatedAt: community.updatedAt,
    };
  }

  private formatCommunityMemberResponse(member: any): CommunityMemberResponse {
    return {
      id: member.id,
      userId: member.userId,
      communityId: member.communityId,
      role: member.role,
      joinedAt: member.joinedAt,
      invitedBy: member.invitedBy,
      isActive: member.isActive,
      user: member.user,
      inviter: member.inviter,
    };
  }
}
