import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from "@/lib/axiosInstance";

const initialState = {
    projects: [],
    project: null,
    loading: false,
    error: null,
};

// Fetch all user's projects
export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/projects');
            return response.data.projects;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Fetch a single project by ID
export const fetchProject = createAsyncThunk(
    'projects/fetchProject',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/projects/${id}`);
            return response.data.project;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Create a new project
export const createProject = createAsyncThunk(
    'projects/createProject',
    async (projectData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/projects', projectData);
            return response.data.project;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Fork a project
export const forkProject = createAsyncThunk(
    'projects/forkProject',
    async (projectId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/projects/${projectId}/fork`);
            return response.data.project;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Add collaborator to project
export const addCollaborator = createAsyncThunk(
    'projects/addCollaborator',
    async ({ projectId, email }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/projects/${projectId}/collaborators`, { email });
            return response.data.collaboratorIds;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Remove collaborator from project
export const removeCollaborator = createAsyncThunk(
    'projects/removeCollaborator',
    async ({ projectId, collaboratorId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/projects/${projectId}/collaborators/${collaboratorId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Update collaborator's role
export const updateCollaboratorPermissions = createAsyncThunk(
    'projects/updateCollaboratorPermissions',
    async ({ projectId, collaboratorId, permission }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/projects/${projectId}/collaborators/${collaboratorId}`, { permission });
            return response.data.collaborator;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Update project settings (environment variables, build command, etc.)
export const updateProjectSettings = createAsyncThunk(
    'projects/updateProjectSettings',
    async ({ projectId, settings }, { rejectWithValue }) => {
        try {

            const response = await axiosInstance.put(`/projects/${projectId}/settings`, settings);
            return response.data.project;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Slice
const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setProject: (state, action) => {
            state.project = action.payload;
        },
        clearProject: (state) => {
            state.project = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProject.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload;
            })
            .addCase(fetchProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload;
                state.projects.push(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(forkProject.pending, (state) => {
                state.loading = true;
            })
            .addCase(forkProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.push(action.payload); // Add forked project to the list
            })
            .addCase(forkProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addCollaborator.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCollaborator.fulfilled, (state, action) => {
                state.loading = false;
                state.project.collaboratorIds.push(action.payload);
            })
            .addCase(addCollaborator.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeCollaborator.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeCollaborator.fulfilled, (state, action) => {
                state.loading = false;
                state.project.collaboratorIds = state.project?.collaboratorIds.filter(
                    (collaborator) => collaborator._id !== action.payload
                );
            })
            .addCase(removeCollaborator.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCollaboratorPermissions.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCollaboratorPermissions.fulfilled, (state, action) => {
                state.loading = false;
                const collaboratorIndex = state.project.collaborators.findIndex(
                    (collaborator) => collaborator._id === action.payload._id
                );
                if (collaboratorIndex >= 0) {
                    state.project.collaborators[collaboratorIndex] = action.payload;
                }
            })
            .addCase(updateCollaboratorPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProjectSettings.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProjectSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.project = action.payload;
            })
            .addCase(updateProjectSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setProject, clearProject } = projectSlice.actions;
export default projectSlice.reducer;
