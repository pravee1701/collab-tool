import File from '../models/file.model.js';
import FileVersion from '../models/fileVersion.model.js';

export const createFile = async (data) => {
  const file = new File(data);
  return await file.save();
};

export const getFileById = async (fileId) => {
  return await File.findById(fileId);
};

export const updateFile = async (fileId, data) => {
  return await File.findByIdAndUpdate(fileId, data, { new: true });
};

export const deleteFile = async (fileId) => {
  return await File.findByIdAndDelete(fileId);
};

export const listFiles = async (projectId) => {
  return await File.find({ projectId });
};

export const renameFile = async (fileId, newName) => {
  return await File.findByIdAndUpdate(fileId, { name: newName }, { new: true });
};

export const moveFile = async (fileId, newPath) => {
  return await File.findByIdAndUpdate(fileId, { path: newPath }, { new: true });
};

export const listFileVersions = async (fileId) => {
  return await FileVersion.find({ fileId });
};

export const getFileVersion = async (versionId) => {
  return await FileVersion.findById(versionId);
};

export const restoreFileVersion = async (fileId, versionId) => {
  const version = await FileVersion.findById(versionId);
  if (!version) throw new Error('Version not found');
  return await File.findByIdAndUpdate(fileId, { content: version.content }, { new: true });
};
