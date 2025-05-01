import express from 'express';
import { body } from 'express-validator';
import * as fileController from '../controllers/file.controller.js';
import { validate } from '../validators/validate.js';

const router = express.Router();

router.get('/projects/:id/files', fileController.listFiles);
router.get('/projects/:id/files/:fileId', fileController.getFile);

router.post(
  '/projects/:id/files',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('path').notEmpty().withMessage('Path is required'),
    body('isFolder').optional().isBoolean().withMessage('isFolder must be a boolean'),
    validate,
  ],
  fileController.createFile
);

router.put(
  '/projects/:id/files/:fileId',
  [
    body('name').optional().isString().withMessage('Name must be a string'),
    body('content').optional().isString().withMessage('Content must be a string'),
    body('contentType').optional().isString().withMessage('ContentType must be a string'),
    validate,
  ],
  fileController.updateFile
);

router.delete('/projects/:id/files/:fileId', fileController.deleteFile);

router.put(
  '/projects/:id/files/:fileId/rename',
  [
    body('newName').notEmpty().withMessage('New name is required'),
    validate,
  ],
  fileController.renameFile
);

router.post(
  '/projects/:id/files/:fileId/move',
  [
    body('newPath').notEmpty().withMessage('New path is required'),
    validate,
  ],
  fileController.moveFile
);

router.get('/projects/:id/files/:fileId/versions', fileController.listFileVersions);
router.get('/projects/:id/files/:fileId/versions/:versionId', fileController.getFileVersion);
router.post('/projects/:id/files/:fileId/restore/:versionId', fileController.restoreFileVersion);

export default router;
