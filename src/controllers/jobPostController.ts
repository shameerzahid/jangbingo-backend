import { Request, Response } from 'express';
import { JobPostService } from '../services/jobPostService';
import { CreateJobPostRequest, UpdateJobPostRequest, JobPostFilters } from '../types/jobPost';
import { JobPostType, JobPostCategory } from '@prisma/client';
import { createJobPostSchema, updateJobPostSchema } from '../validators/jobPostValidator';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: string;
    kakaoId: string;
  };
}

const jobPostService = new JobPostService();

export class JobPostController {
  async createJobPost(req: AuthenticatedRequest, res: Response): Promise<void> {
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
      const validationResult = createJobPostSchema.safeParse(req.body);
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

      const data: CreateJobPostRequest = validationResult.data;
      const jobPost = await jobPostService.createJobPost(userId, data);
      
      res.status(201).json({
        success: true,
        message: 'Job post created successfully',
        status: 201,
        data: jobPost,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async getJobPosts(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const filters: JobPostFilters = {
        type: req.query['type'] as JobPostType,
        category: req.query['category'] as JobPostCategory,
        communityId: req.query['communityId'] ? parseInt(req.query['communityId'] as string) : undefined,
        authorId: req.query['authorId'] ? parseInt(req.query['authorId'] as string) : undefined,
      };

      const jobPosts = await jobPostService.getJobPosts(filters, userId);
      
      res.status(200).json({
        success: true,
        data: jobPosts,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getJobPostById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const id = parseInt(req.params['id'] as string);
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid job post ID',
        });
        return;
      }

      const jobPost = await jobPostService.getJobPostById(id, userId);
      
      if (!jobPost) {
        res.status(404).json({
          success: false,
          error: 'Job post not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: jobPost,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateJobPost(req: AuthenticatedRequest, res: Response): Promise<void> {
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
          message: 'Invalid job post ID',
          status: 400,
        });
        return;
      }

      // Validate request body
      const validationResult = updateJobPostSchema.safeParse(req.body);
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

      const data: UpdateJobPostRequest = validationResult.data;
      const jobPost = await jobPostService.updateJobPost(id, userId, data);
      
      if (!jobPost) {
        res.status(404).json({
          success: false,
          message: 'Job post not found or access denied',
          status: 404,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job post updated successfully',
        status: 200,
        data: jobPost,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
        status: 400,
      });
    }
  }

  async deleteJobPost(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const id = parseInt(req.params['id'] as string);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid job post ID',
        });
        return;
      }

      const success = await jobPostService.deleteJobPost(id, userId);
      
      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Job post not found or access denied',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Job post deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getUserCommunities(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const communities = await jobPostService.getUserCommunities(userId);
      
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

  async getCommunityUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const communityId = parseInt(req.params['communityId'] as string);
      if (isNaN(communityId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid community ID',
        });
        return;
      }

      const users = await jobPostService.getCommunityUsers(userId, communityId);
      
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

}
