import CMSContent from '../models/CMSContent.js'

// Get all published content
export const getContent = async (req, res) => {
  try {
    const { category, tag, featured, limit = 10, skip = 0 } = req.query
    
    let query = { status: 'published' }
    
    if (category) query.category = category
    if (featured === 'true') query.featured = true
    if (tag) query.tags = tag

    const content = await CMSContent.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 })

    const total = await CMSContent.countDocuments(query)

    res.json({ content, total })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get single content by slug
export const getContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    const content = await CMSContent.findOne({ slug, status: 'published' })
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' })
    }

    // Increment views
    content.views += 1
    await content.save()

    res.json(content)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Create new content (Editor+ only)
export const createContent = async (req, res) => {
  try {
    const { title, description, content, category, tags, imageUrl } = req.body
    
    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const newContent = new CMSContent({
      title,
      slug,
      description,
      content,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      imageUrl,
      author: req.user.username,
      status: 'draft',
    })

    await newContent.save()
    res.status(201).json({ message: 'Content created successfully', content: newContent })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update content
export const updateContent = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    
    const content = await CMSContent.findByIdAndUpdate(id, updates, { new: true })
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' })
    }

    res.json({ message: 'Content updated successfully', content })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete content
export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params
    const content = await CMSContent.findByIdAndDelete(id)
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' })
    }

    res.json({ message: 'Content deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get all content (Admin only - includes drafts)
export const getAllContent = async (req, res) => {
  try {
    const { limit = 20, skip = 0 } = req.query
    
    const content = await CMSContent.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 })

    const total = await CMSContent.countDocuments()

    res.json({ content, total })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
