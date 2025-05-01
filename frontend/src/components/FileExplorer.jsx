import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFiles,
  fetchFileContent,
  createFileOrFolder,
  deleteFile,
  renameFile,
} from '@/store/fileSlice';
import { Folder, File, Plus, Trash, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';

const FileExplorer = ({ projectId, onFileSelect = () => {} }) => {
  const dispatch = useDispatch();
  const { files, loading, error } = useSelector((state) => state.files);
  const [selectedFileId, setSelectedFileId] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchFiles(projectId));
    }
  }, [dispatch, projectId]);

  const handleCreate = async (isFolder) => {
    const name = prompt(`Enter ${isFolder ? 'folder' : 'file'} name:`);
    if (!name) return;

    try {
      await dispatch(
        createFileOrFolder({
          projectId,
          data: { name, isFolder, path: `/${name}` },
        })
      ).unwrap();
      toast.success(`${isFolder ? 'Folder' : 'File'} created successfully.`);
    } catch (err) {
      console.error('Error creating file or folder:', err);
      toast.error(`Failed to create ${isFolder ? 'folder' : 'file'}.`);
    }
  };

  const handleRename = async (file) => {
    const newName = prompt('Enter new name:', file.name);
    if (!newName || newName === file.name) return;

    try {
      await dispatch(
        renameFile({
          projectId,
          fileId: file._id,
          newName,
        })
      ).unwrap();
      toast.success('Renamed successfully.');
    } catch (err) {
      console.error('Error renaming file or folder:', err);
      toast.error('Failed to rename.');
    }
  };

  const handleDelete = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;

    try {
      await dispatch(deleteFile({ projectId, fileId: file._id })).unwrap();
      toast.success('Deleted successfully.');
    } catch (err) {
      console.error('Error deleting file or folder:', err);
      toast.error('Failed to delete.');
    }
  };

  const handleSelect = async (file) => {
    if (file.isFolder) {
      toast.success('Folder selection is not supported yet.');
      return;
    }

    try {
      setSelectedFileId(file._id);
      const fileContent = await dispatch(fetchFileContent({ projectId, fileId: file._id })).unwrap();
      onFileSelect({ ...file, content: fileContent });
      toast.success(`File "${file.name}" opened successfully.`);
    } catch (err) {
      console.error('Error fetching file content:', err);
      toast.error(`Failed to open file "${file.name}".`);
    }
  };

  return (
    <div className="w-full h-full p-3 bg-muted rounded-md shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">File Explorer</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleCreate(false)}>
            <Plus className="w-4 h-4 mr-1" /> File
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleCreate(true)}>
            <Plus className="w-4 h-4 mr-1" /> Folder
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Error: {String(error)}</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {files?.map((file) => (
            <li
              key={file._id}
              className={`flex justify-between items-center px-2 py-1 rounded cursor-pointer ${
                selectedFileId === file._id ? 'bg-accent text-white' : 'hover:bg-accent'
              }`}
              onClick={() => handleSelect(file)}
            >
              <div className="flex items-center gap-2">
                {file.isFolder ? <Folder size={16} /> : <File size={16} />}
                <span>{file.name}</span>
              </div>
              <div className="flex gap-1">
                <Pencil
                  className="w-4 h-4 text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRename(file);
                  }}
                />
                <Trash
                  className="w-4 h-4 text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileExplorer;