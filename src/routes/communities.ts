import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { CommunityController } from '../controllers/communityController';
import { requireUser } from '../middleware/auth';

const router = Router();
const communityController = new CommunityController();

// Rate limiting for community creation (3 communities per hour per user)
const createCommunityLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 communities per hour
  message: {
    success: false,
    message: 'Too many communities created. Please try again later.',
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply authentication middleware to all routes
router.use(requireUser);

// Community CRUD operations
router.post('/', createCommunityLimiter, communityController.createCommunity.bind(communityController));
router.get('/', communityController.getCommunities.bind(communityController));
router.get('/user', communityController.getUserCommunities.bind(communityController));
router.get('/:id', communityController.getCommunityById.bind(communityController));
router.put('/:id', communityController.updateCommunity.bind(communityController));
router.delete('/:id', communityController.deleteCommunity.bind(communityController));

// Community membership operations
router.post('/join', communityController.joinCommunity.bind(communityController));
router.post('/:id/leave', communityController.leaveCommunity.bind(communityController));
router.post('/invite', communityController.inviteUser.bind(communityController));
router.get('/:id/members', communityController.getCommunityMembers.bind(communityController));
router.put('/:id/members/role', communityController.updateMemberRole.bind(communityController));
router.delete('/:id/members/:userId', communityController.removeMember.bind(communityController));

// Get all users from user's communities (for job post designation)
router.get('/users/all', communityController.getAllUsersFromCommunities.bind(communityController));

export default router;
