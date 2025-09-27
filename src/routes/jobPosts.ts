import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { JobPostController } from '../controllers/jobPostController';
import { requireUser } from '../middleware/auth';

const router = Router();
const jobPostController = new JobPostController();

// Rate limiting for job post creation (5 posts per hour per user)
const createJobPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 25, // 5 job posts per hour
  message: {
    success: false,
    message: 'Too many job posts created. Please try again later.',
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply authentication middleware to all routes
router.use(requireUser);

// Job post CRUD operations
router.post('/', createJobPostLimiter, jobPostController.createJobPost.bind(jobPostController));
router.get('/', jobPostController.getJobPosts.bind(jobPostController));
router.get('/:id', jobPostController.getJobPostById.bind(jobPostController));
router.put('/:id', jobPostController.updateJobPost.bind(jobPostController));
router.delete('/:id', jobPostController.deleteJobPost.bind(jobPostController));

// Community and user related endpoints
router.get('/communities/user', jobPostController.getUserCommunities.bind(jobPostController));
router.get('/communities/:communityId/users', jobPostController.getCommunityUsers.bind(jobPostController));

export default router;
