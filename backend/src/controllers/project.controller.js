import Project from "../models/project.model.js";
import {User} from "../models/user.model.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      ownerId: req.user._id, 
    };

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all user's projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ ownerId: req.user._id });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get project details by ID
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("ownerId")
      .populate("collaboratorIds");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update project details
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fork a project (clone it)
export const forkProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Convert the project to a plain object and remove the _id field
    const projectData = project.toObject();
    delete projectData._id;

    // Create a new project with the modified data
    const forkedProject = new Project({
      ...projectData,
      ownerId: req.user._id,
      collaboratorIds: [], 
    });

    await forkedProject.save();
    res.status(201).json({ success: true, project: forkedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Settings related APIs
export const getProjectSettings = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, settings: project.settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProjectSettings = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { settings: req.body.settings }, { new: true });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Environment variables related APIs
export const getEnvironmentVariables = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, environmentVariables: project.settings.environmentVariables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEnvironmentVariables = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, { 
      'settings.environmentVariables': req.body.environmentVariables 
    }, { new: true });
    
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Collaborators management APIs
export const getCollaborators = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("collaboratorIds");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, collaborators: project.collaboratorIds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const addCollaborator = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const { email } = req.body;
    const collaborator = await User.findOne({ email });
    if (!collaborator) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (project.collaboratorIds.includes(collaborator._id)) {
      return res.status(400).json({ success: false, message: "User is already a collaborator" });
    }

    project.collaboratorIds.push(collaborator._id);
    await project.save();

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove collaborator
export const removeCollaborator = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    
    project.collaboratorIds = project.collaboratorIds.filter(
      (collaboratorId) => !collaboratorId.equals(req.user._id)
    );
    await project.save();
    
    res.status(200).json({ success: true,data: req.user._id, message: "Collaborator removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update collaborator permissions
export const updateCollaboratorPermissions = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    
    // Logic for updating collaborator permissions (can be extended later)
    res.status(200).json({ success: true, message: "Collaborator permissions updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
