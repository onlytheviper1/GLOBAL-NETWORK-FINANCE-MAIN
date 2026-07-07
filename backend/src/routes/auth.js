import express from 'express'
import * as cmsController from '../controllers/cmsController.js'
import * as authController from '../controllers/authController.js'
import { authMiddleware, adminMiddleware, editorMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Auth routes
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/profile', authMiddleware, authController.getProfile)

export default router
