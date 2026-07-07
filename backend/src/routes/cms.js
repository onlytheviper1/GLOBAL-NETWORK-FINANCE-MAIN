import express from 'express'
import * as cmsController from '../controllers/cmsController.js'
import { authMiddleware, editorMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/content', cmsController.getContent)
router.get('/content/:slug', cmsController.getContentBySlug)

// Protected routes (require authentication)
router.post('/content', authMiddleware, editorMiddleware, cmsController.createContent)
router.put('/content/:id', authMiddleware, editorMiddleware, cmsController.updateContent)
router.delete('/content/:id', authMiddleware, adminMiddleware, cmsController.deleteContent)

// Admin only routes
router.get('/admin/content', authMiddleware, adminMiddleware, cmsController.getAllContent)

export default router
