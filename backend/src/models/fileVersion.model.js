import mongoose from "mongoose";

const FileVersionSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    changes: {
      additions: Number,
      deletions: Number,
      operations: [Object]
    }
  });

export default mongoose.model("FileVersion", FileVersionSchema)