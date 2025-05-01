import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFileContent, fetchFileContent } from '@/store/fileSlice';
import toast from 'react-hot-toast';

const CodeEditor = ({ projectId, file }) => {
  const dispatch = useDispatch();
  const fileContents = useSelector((state) => state.files.fileContents);
  console.log('File contents:', fileContents);
  
  const [value, setValue] = useState('');

  // Load file content when file changes
  useEffect(() => {
    if (file && file._id) {
      if (!fileContents[file._id]) {
        // Fetch content only if not already loaded
        dispatch(fetchFileContent({ projectId, fileId: file._id }))
          .unwrap()
          .catch((error) => {
            console.error('Failed to load file content:', error);
            toast.error('Failed to load file content');
          });
      } else {
        setValue(fileContents[file._id]); // Use cached content
      }
    }
  }, [dispatch, file, projectId, fileContents]);

  // Update local state when file content changes in Redux
  useEffect(() => {
    if (file && fileContents[file._id]?.content) {
      setValue(fileContents[file._id].content);
    }
  }, [file, fileContents]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSave = async () => {
    if (!file || !file._id) {
      toast.error('Cannot save: No active file');
      return;
    }

    try {
      await dispatch(
        updateFileContent({
          projectId,
          fileId: file._id,
          content: value,
        })
      ).unwrap();
      toast.success('File saved successfully.');
    } catch (err) {
      console.error('Error saving file:', err);
      toast.error('Failed to save file.');
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center p-2 border-b bg-background">
        <p className="font-medium">{file ? file.name : 'No file selected'}</p>
        <button
          onClick={handleSave}
          disabled={!file}
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
        >
          Save
        </button>
      </div>
      {file ? (
        <textarea
          className="w-full h-full p-4 font-mono bg-gray-900 text-gray-200 border-none outline-none resize-none"
          value={value}
          onChange={handleChange}
          spellCheck="false"
          placeholder="// Start coding here..."
        />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select a file to edit
        </div>
      )}
    </div>
  );
};

export default CodeEditor;