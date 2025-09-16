const router = require('express').Router()
const Project = require('../models/Project')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')
const cloudinary = require('../utils/cloudinary')

// Get all projects
router.get('/', async (req, res) => {
  try {
    const data = await Project.find().sort({ createdAt: -1 })
    res.json(data)
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    console.error('Error fetching project:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Create new project with image upload
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    let imageUrls = [];
    
    // If files were uploaded, get their URLs
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }
    
    // If URLs were also provided in the form, add them
    if (req.body.images) {
      const providedUrls = Array.isArray(req.body.images) 
        ? req.body.images 
        : req.body.images.split(',').map(url => url.trim()).filter(Boolean);
      imageUrls = [...imageUrls, ...providedUrls];
    }

    // Convert number fields to proper types
    const projectData = {
      ...req.body,
      images: imageUrls,
      totalBudget: req.body.totalBudget ? Number(req.body.totalBudget) : undefined,
      volunteers: req.body.volunteers ? Number(req.body.volunteers) : undefined
    };

    const data = await Project.create(projectData);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
})

// Update project with image upload
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    let imageUrls = [];
    
    // Get existing project to preserve existing images
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // If files were uploaded, get their URLs
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map(file => file.path);
    }
    
    // If URLs were provided in the form, use them
    if (req.body.images) {
      const providedUrls = Array.isArray(req.body.images) 
        ? req.body.images 
        : req.body.images.split(',').map(url => url.trim()).filter(Boolean);
      imageUrls = [...imageUrls, ...providedUrls];
    } else {
      // Keep existing images if no new ones provided
      imageUrls = existingProject.images || [];
    }

    // Convert number fields to proper types
    const updateData = {
      ...req.body,
      images: imageUrls,
      totalBudget: req.body.totalBudget ? Number(req.body.totalBudget) : existingProject.totalBudget,
      volunteers: req.body.volunteers ? Number(req.body.volunteers) : existingProject.volunteers
    };

    const data = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(data);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
})

// Delete project and associated images
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (project.images && project.images.length > 0) {
      // Delete images from Cloudinary
      for (const imageUrl of project.images) {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`aawaz-projects/${publicId}`);
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
})

// Image upload endpoint
router.post('/upload', auth, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const urls = req.files.map(file => file.path);
    res.json({ urls });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

module.exports = router