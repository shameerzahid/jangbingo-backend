import { z } from 'zod';
import { CommunityStatus, CommunityRole } from '@prisma/client';

export const createCommunitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug must be less than 50 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  status: z.nativeEnum(CommunityStatus).optional(),
  isPrivate: z.boolean().optional(),
  maxMembers: z.number().int().min(1, 'Max members must be at least 1').max(10000, 'Max members must be less than 10000').optional(),
  
  // Community Fee Settings (set by Group Leader)
  defaultWorkFee: z.number().min(0, 'Work fee must be at least 0%').max(100, 'Work fee must be less than 100%').optional(),
  defaultSupportFee: z.number().min(0, 'Support fee must be at least 0%').max(100, 'Support fee must be less than 100%').optional(),
});

export const updateCommunitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug must be less than 50 characters').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  status: z.nativeEnum(CommunityStatus).optional(),
  isPrivate: z.boolean().optional(),
  maxMembers: z.number().int().min(1, 'Max members must be at least 1').max(10000, 'Max members must be less than 10000').optional(),
  
  // Community Fee Settings (set by Group Leader)
  defaultWorkFee: z.number().min(0, 'Work fee must be at least 0%').max(100, 'Work fee must be less than 100%').optional(),
  defaultSupportFee: z.number().min(0, 'Support fee must be at least 0%').max(100, 'Support fee must be less than 100%').optional(),
});

export const joinCommunitySchema = z.object({
  communityId: z.number().int().positive('Community ID must be a positive number'),
});

export const inviteUserSchema = z.object({
  communityId: z.number().int().positive('Community ID must be a positive number'),
  userId: z.number().int().positive('User ID must be a positive number'),
  role: z.nativeEnum(CommunityRole).optional(),
});

export const updateMemberRoleSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive number'),
  role: z.nativeEnum(CommunityRole),
});

export type CreateCommunityValidation = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityValidation = z.infer<typeof updateCommunitySchema>;
export type JoinCommunityValidation = z.infer<typeof joinCommunitySchema>;
export type InviteUserValidation = z.infer<typeof inviteUserSchema>;
export type UpdateMemberRoleValidation = z.infer<typeof updateMemberRoleSchema>;
