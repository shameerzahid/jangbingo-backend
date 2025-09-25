import { Request, Response } from 'express';
import { CommunityService } from '../services/communityService';
import { CreateCommunityRequest, UpdateCommunityRequest, JoinCommunityRequest, InviteUserRequest, UpdateMemberRoleRequest, CommunityFilters } from '../types/community';
import { createCommunitySchema, updateCommunitySchema, joinCommunitySchema, inviteUserSchema, updateMemberRoleSchema } from '../validators/communityValidator';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
    kakaoId: string;
  };
}

const communityService = new CommunityService();

export class CommunityController {
  async createCommunity(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      // Validate request body
      const validationResult = createCommunitySchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          status: 400,
          errors: validationResult.error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      const data: CreateCommunityRequest = validationResult.data;
      const community = await communityService.createCommunity(userId, data);
      
      res.status(201).json({
        success: true,
        message: 'Community created successfully',
        status: 201,
        data: community,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async getCommunities(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const filters: CommunityFilters = {
        status: req.query['status'] as any,
        isPrivate: req.query['isPrivate'] ? req.query['isPrivate'] === 'true' : undefined,
        search: req.query['search'] as string,
      };

      const communities = await communityService.getCommunities(filters);
      
      res.status(200).json({
        success: true,
        data: communities,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getCommunityById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] as string);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid community ID',
        });
        return;
      }

      const community = await communityService.getCommunityById(id);
      
      if (!community) {
        res.status(404).json({
          success: false,
          error: 'Community not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: community,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateCommunity(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      const id = parseInt(req.params['id'] as string);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid community ID',
          status: 400,
        });
        return;
      }

      // Validate request body
      const validationResult = updateCommunitySchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          status: 400,
          errors: validationResult.error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      const data: UpdateCommunityRequest = validationResult.data;
      const community = await communityService.updateCommunity(id, userId, data);
      
      if (!community) {
        res.status(404).json({
          success: false,
          message: 'Community not found or access denied',
          status: 404,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Community updated successfully',
        status: 200,
        data: community,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async deleteCommunity(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      const id = parseInt(req.params['id'] as string);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid community ID',
          status: 400,
        });
        return;
      }

      const success = await communityService.deleteCommunity(id, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Community not found or access denied',
          status: 404,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Community deleted successfully',
        status: 200,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async joinCommunity(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      // Validate request body
      const validationResult = joinCommunitySchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          status: 400,
          errors: validationResult.error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      const data: JoinCommunityRequest = validationResult.data;
      const membership = await communityService.joinCommunity(userId, data);
      
      res.status(201).json({
        success: true,
        message: 'Successfully joined community',
        status: 201,
        data: membership,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async leaveCommunity(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      const communityId = parseInt(req.params['id'] as string);
      if (isNaN(communityId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid community ID',
          status: 400,
        });
        return;
      }

      await communityService.leaveCommunity(userId, communityId);
      
      res.status(200).json({
        success: true,
        message: 'Successfully left community',
        status: 200,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async inviteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      // Validate request body
      const validationResult = inviteUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          status: 400,
          errors: validationResult.error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      const data: InviteUserRequest = validationResult.data;
      const membership = await communityService.inviteUser(userId, data);
      
      res.status(201).json({
        success: true,
        message: 'User invited successfully',
        status: 201,
        data: membership,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async getCommunityMembers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      const communityId = parseInt(req.params['id'] as string);
      if (isNaN(communityId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid community ID',
          status: 400,
        });
        return;
      }

      const members = await communityService.getCommunityMembers(communityId, userId);
      
      res.status(200).json({
        success: true,
        data: members,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async updateMemberRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      const communityId = parseInt(req.params['id'] as string);
      if (isNaN(communityId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid community ID',
          status: 400,
        });
        return;
      }

      // Validate request body
      const validationResult = updateMemberRoleSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          status: 400,
          errors: validationResult.error.issues.map((issue: any) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
        return;
      }

      const data: UpdateMemberRoleRequest = validationResult.data;
      const membership = await communityService.updateMemberRole(communityId, userId, data);
      
      res.status(200).json({
        success: true,
        message: 'Member role updated successfully',
        status: 200,
        data: membership,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async removeMember(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      const communityId = parseInt(req.params['id'] as string);
      const targetUserId = parseInt(req.params['userId'] as string);
      
      if (isNaN(communityId) || isNaN(targetUserId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid community ID or user ID',
          status: 400,
        });
        return;
      }

      await communityService.removeMember(communityId, userId, targetUserId);
      
      res.status(200).json({
        success: true,
        message: 'Member removed successfully',
        status: 200,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async getUserCommunities(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      const communities = await communityService.getUserCommunities(userId);
      
      res.status(200).json({
        success: true,
        data: communities,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAllUsersFromCommunities(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized',
          status: 401 
        });
        return;
      }

      const users = await communityService.getAllUsersFromUserCommunities(userId);
      
      res.status(200).json({
        success: true,
        data: users,
        message: `Found ${users.length} users from your communities`,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
