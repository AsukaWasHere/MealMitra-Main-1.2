import express from 'express';
import { getSuggestions, chatWithAI, analyzeFoodImage } from '../controllers/aiController.js';

const router = express.Router();

// @route   POST /api/ai/suggest
// @desc    Get AI-powered suggestions for charities
router.post('/suggest', getSuggestions);

// @route   POST /api/ai/chat
// @desc    Chat with MealMitra AI
router.post('/chat', chatWithAI);

// @route   POST /api/ai/analyze-image
// @desc    Analyze food image quality
router.post('/analyze-image', analyzeFoodImage);

export default router;