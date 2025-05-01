import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axiosInstance.js';

const initialState = {
  files: [],
  fileContents: {}, // Store file content by file ID
  fileVersions: [],
  loading: false,
  error: null,
};

// Fetch all files in a project
export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/projects/${projectId}/files`);
      return res.data;
    } catch (err) {
      console.error('Error fetching files:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch files');
    }
  }
);

// Get file content
export const fetchFileContent = createAsyncThunk(
  'files/fetchFileContent',
  async ({ projectId, fileId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/projects/${projectId}/files/${fileId}`);
      return { fileId, content: res.data };
    } catch (err) {
      console.error('Error fetching file content:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch file content');
    }
  }
);

// Fetch file versions
export const fetchFileVersions = createAsyncThunk(
  'files/fetchFileVersions',
  async ({ projectId, fileId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/projects/${projectId}/files/${fileId}/versions`);
      return res.data.versions;
    } catch (err) {
      console.error('Error fetching file versions:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch file versions');
    }
  }
);

// Restore a specific file version
export const restoreFileVersion = createAsyncThunk(
  'files/restoreFileVersion',
  async ({ projectId, fileId, versionId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/projects/${projectId}/files/${fileId}/restore`, { versionId });
      return res.data.file;
    } catch (err) {
      console.error('Error restoring file version:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to restore file version');
    }
  }
);

// Create a new file or folder
export const createFileOrFolder = createAsyncThunk(
  'files/createFileOrFolder',
  async ({ projectId, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/projects/${projectId}/files`, data);
      return res.data;
    } catch (err) {
      console.error('Error creating file or folder:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to create file or folder');
    }
  }
);

// Update file content
export const updateFileContent = createAsyncThunk(
  'files/updateFileContent',
  async ({ projectId, fileId, content }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/projects/${projectId}/files/${fileId}`, { content });
      return res.data;
    } catch (err) {
      console.error('Error updating file content:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to update file content');
    }
  }
);

// Rename file/folder
export const renameFile = createAsyncThunk(
  'files/renameFile',
  async ({ projectId, fileId, newName }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/projects/${projectId}/files/${fileId}/rename`, { name: newName });
      return res.data.file;
    } catch (err) {
      console.error('Error renaming file:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to rename file');
    }
  }
);

// Delete file/folder
export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async ({ projectId, fileId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/projects/${projectId}/files/${fileId}`);
      return fileId;
    } catch (err) {
      console.error('Error deleting file:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to delete file');
    }
  }
);

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearFileContent: (state, action) => {
      delete state.fileContents[action.payload]; // Clear content for a specific file
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchFileContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFileContent.fulfilled, (state, action) => {
        state.loading = false;
        state.fileContents[action.payload.fileId] = action.payload.content;
      })
      .addCase(fetchFileContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchFileVersions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFileVersions.fulfilled, (state, action) => {
        state.loading = false;
        state.fileVersions = action.payload;
      })
      .addCase(fetchFileVersions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(restoreFileVersion.fulfilled, (state, action) => {
        state.fileContent = action.payload.content;
        const updatedFile = action.payload;
        const index = state.files.findIndex(f => f._id === updatedFile._id);
        if (index !== -1) {
          state.files[index] = updatedFile;
        }
      })

      .addCase(createFileOrFolder.fulfilled, (state, action) => {
        state.files.push(action.payload);
      })

      .addCase(updateFileContent.fulfilled, (state, action) => {
        
        state.fileContent = action.payload.content;
      })

      .addCase(renameFile.fulfilled, (state, action) => {
        const index = state.files.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.files[index] = action.payload;
        }
      })

      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file._id !== action.payload);
      });
  },
});

export const { clearFileContent } = fileSlice.actions;
export default fileSlice.reducer;