import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collaboratorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
    isPublic: { type: Boolean, default: false },
    isFrozen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    settings: {
      environment: { type: String, default: "node" },
      buildCommand: { type: String },
      startCommand: { type: String },
      environmentVariables: { type: Map, of: String },
      packageManager: { type: String, enum: ["npm", "yarn", "pnpm"], default: "npm" },
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
