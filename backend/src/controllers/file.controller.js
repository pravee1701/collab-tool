import * as fileService from '../services/file.service.js';

export const listFiles = async (req, res) => {
  try {
    const files = await fileService.listFiles(req.params.id);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFile = async (req, res) => {
  try {
    const file = await fileService.getFileById(req.params.fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFile = async (req, res) => {
  try {
    const file = await fileService.createFile({ ...req.body, projectId: req.params.id });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFile = async (req, res) => {
  try {
    const file = await fileService.updateFile(req.params.fileId, req.body);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await fileService.deleteFile(req.params.fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renameFile = async (req, res) => {
  try {
    const file = await fileService.renameFile(req.params.fileId, req.body.newName);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const moveFile = async (req, res) => {
  try {
    const file = await fileService.moveFile(req.params.fileId, req.body.newPath);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listFileVersions = async (req, res) => {
  try {
    const versions = await fileService.listFileVersions(req.params.fileId);
    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFileVersion = async (req, res) => {
  try {
    const version = await fileService.getFileVersion(req.params.versionId);
    if (!version) return res.status(404).json({ error: 'Version not found' });
    res.json(version);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const restoreFileVersion = async (req, res) => {
  try {
    const file = await fileService.restoreFileVersion(req.params.fileId, req.params.versionId);
    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
