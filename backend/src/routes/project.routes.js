import express from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  forkProject,
  getProjectSettings,
  updateProjectSettings,
  getEnvironmentVariables,
  updateEnvironmentVariables,
  getCollaborators,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorPermissions,
} from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  projectValidator,
  projectUpdateValidator,
  collaboratorValidator,
} from "../validators/project.validators.js";
import { validate } from "../validators/validate.js";

const router = express.Router();

// Project Management
router.route("/").get(protect, getProjects); 
router.route("/").post(protect, projectValidator, validate, createProject); 
router.route("/:id").get(protect, getProject); // Get project details
router.route("/:id").put(protect, projectUpdateValidator, validate, updateProject);
router.route("/:id").delete(protect, deleteProject); // Delete a project
router.route("/:id/fork").post(protect, forkProject); // Fork a project

// Project Settings
router.route("/:id/settings").get(protect, getProjectSettings); // Get project settings
router.route("/:id/settings").put(protect, updateProjectSettings); // Update project settings

// Environment Variables
router.route("/:id/environment").get(protect, getEnvironmentVariables); // Get environment variables
router.route("/:id/environment").put(protect, updateEnvironmentVariables); // Update environment variables

// Collaborators
router.route("/:id/collaborators").get(protect, getCollaborators); // List collaborators
router.route("/:id/collaborators").post(protect, collaboratorValidator, validate, addCollaborator); // Add collaborator
router.route("/:id/collaborators/:collaboratorId").delete(protect, removeCollaborator); // Remove collaborator
router.route("/:id/collaborators/:userId").put(protect, collaboratorValidator, validate, updateCollaboratorPermissions); // Update collaborator permissions

export default router;
