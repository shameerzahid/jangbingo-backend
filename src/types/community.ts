import { CommunityStatus, CommunityRole } from '@prisma/client';

export interface CreateCommunityRequest {
  title: string;
  description?: string | undefined;
  slug?: string | undefined;
  status?: CommunityStatus | undefined;
  isPrivate?: boolean | undefined;
  maxMembers?: number | undefined;
  
  // Community Fee Settings (set by Group Leader)
  defaultWorkFee?: number | undefined;
  defaultSupportFee?: number | undefined;
}

export interface UpdateCommunityRequest {
  title?: string | undefined;
  description?: string | undefined;
  slug?: string | undefined;
  status?: CommunityStatus | undefined;
  isPrivate?: boolean | undefined;
  maxMembers?: number | undefined;
  
  // Community Fee Settings (set by Group Leader)
  defaultWorkFee?: number | undefined;
  defaultSupportFee?: number | undefined;
}

export interface JoinCommunityRequest {
  communityId: number;
}

export interface InviteUserRequest {
  communityId: number;
  userId: number;
  role?: CommunityRole | undefined;
}

export interface UpdateMemberRoleRequest {
  userId: number;
  role: CommunityRole;
}

export interface CommunityResponse {
  id: number;
  title: string;
  description?: string;
  slug: string;
  status: CommunityStatus;
  isPrivate: boolean;
  maxMembers?: number;
  
  // Community Fee Settings (set by Group Leader)
  defaultWorkFee?: number | undefined;
  defaultSupportFee?: number | undefined;
  
  createdAt: Date;
  updatedAt: Date;
  memberCount?: number;
  author?: {
    id: number;
    name?: string;
    nickname?: string;
  };
}

export interface CommunityMemberResponse {
  id: number;
  userId: number;
  communityId: number;
  role: CommunityRole;
  joinedAt: Date;
  invitedBy?: number;
  isActive: boolean;
  user?: {
    id: number;
    name?: string;
    nickname?: string;
    email?: string;
  };
  inviter?: {
    id: number;
    name?: string;
    nickname?: string;
  };
}

export interface CommunityFilters {
  status?: CommunityStatus | undefined;
  isPrivate?: boolean | undefined;
  search?: string | undefined;
}
