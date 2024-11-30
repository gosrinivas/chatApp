import express from 'express';

import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsersForSlider,sendMessage,getMessages } from '../controllers/message.controller.js';

const router=express.Router();

router.get('/users',protectRoute,getUsersForSlider);
router.get('/:id',protectRoute,getMessages);

router.post("/send/:id",protectRoute,sendMessage)

export default router;