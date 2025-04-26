const projectSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    collaborators: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      accessLevel: {
        type: String,
        enum: ['read', 'write', 'admin'],
        default: 'read'
      },
      joinedDate: {
        type: Date,
        default: Date.now
      }
    }],
    settings: {
      environment: String,
      buildCommand: String,
      startCommand: String,
      outputDirectory: String,
      nodeVersion: String,
      packageManager: {
        type: String,
        enum: ['npm', 'yarn', 'pnpm'],
        default: 'npm'
      },
      envVariables: [{
        key: String,
        value: String,
        isSecret: {
          type: Boolean,
          default: false
        }
      }]
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    lastModified: {
      type: Date,
      default: Date.now
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewCount: {
      type: Number,
      default: 0
    },
    forkCount: {
      type: Number,
      default: 0
    },
    likeCount: {
      type: Number,
      default: 0
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false
    }
  });
  
  // Create Project model
  const Project = mongoose.model('Project', projectSchema);
  
  // Utility function to check user permissions
  const checkPermission = async (req, projectId, requiredLevel = 'read') => {
    try {
      const project = await Project.findById(projectId);
      
      if (!project) {
        return { success: false, message: 'Project not found', status: 404 };
      }
      
      // Owner has all permissions
      if (project.owner.toString() === req.user.id) {
        return { success: true, project };
      }
      
      // Check collaborator permissions
      const collaborator = project.collaborators.find(
        c => c.userId.toString() === req.user.id
      );
      
      if (!collaborator) {
        // Public projects can be viewed by anyone
        if (requiredLevel === 'read' && project.isPublic) {
          return { success: true, project };
        }
        return { success: false, message: 'Permission denied', status: 403 };
      }
      
      // Access level hierarchy: read < write < admin
      const accessLevels = ['read', 'write', 'admin'];
      if (accessLevels.indexOf(collaborator.accessLevel) >= accessLevels.indexOf(requiredLevel)) {
        return { success: true, project };
      }
      
      return { success: false, message: 'Insufficient permissions', status: 403 };
    } catch (error) {
      return { success: false, message: 'Server error', status: 500 };
    }
  };
  