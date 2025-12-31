import express from 'express';
import {
  createListing,
  getAllListings,
  getListing,
  claimListing,
  deleteListing,
  getMyListings,
  getLeaderboard, // Import the new controller
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { listingValidationRules, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', protect, listingValidationRules(), validate, createListing);
router.get('/', getAllListings);
router.get('/leaderboard', getLeaderboard); // NEW: Leaderboard route
router.get('/my-listings', protect, getMyListings);
router.get('/:id', getListing);
router.post('/claim/:id', protect, claimListing);
router.delete('/:id', protect, deleteListing);

export default router;