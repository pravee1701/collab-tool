import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
    parentFolderId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    content: { type: String },
    contentType: { type: String },
    isFolder: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });

export default mongoose.model("File", FileSchema)