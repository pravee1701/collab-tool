import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FileExplorer from '@/components/FileExplorer';
import CodeEditor from '@/components/CodeEditor';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import { fetchFileContent } from '@/store/fileSlice';

const ProjectEditorPage = () => {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  // Get file contents from Redux store
  const fileContents = useSelector((state) => state.files.fileContents);

  // Handle file selection from the FileExplorer
  const handleFileSelect = (file) => {
    if (!file || !file._id) return;

    // Check if the file is already open
    const existingFileIndex = openFiles.findIndex((openFile) => openFile._id === file._id);

    if (existingFileIndex >= 0) {
      // File already open, just set it as active
      setActiveFile(openFiles[existingFileIndex]);
    } else {
      // Add new file to open files
      const newOpenFiles = [...openFiles, file];
      setOpenFiles(newOpenFiles);
      setActiveFile(file);

      // Fetch file content if not already loaded
      if (!fileContents[file._id]) {
        dispatch(fetchFileContent({ projectId, fileId: file._id })).catch((err) => {
          console.error('Failed to fetch file content:', err);
        });
      }
    }
  };

  // Restore open files and active file on reload
  useEffect(() => {
    const savedOpenFiles = JSON.parse(localStorage.getItem('openFiles')) || [];
    const savedActiveFileId = localStorage.getItem('activeFileId');

    // Restore open files
    setOpenFiles(savedOpenFiles);

    // Restore active file
    if (savedActiveFileId) {
      const savedActiveFile = savedOpenFiles.find((file) => file._id === savedActiveFileId);
      setActiveFile(savedActiveFile || null);
    }

    // Fetch content for restored files if not already in Redux
    savedOpenFiles.forEach((file) => {
      if (!fileContents[file._id]) {
        dispatch(fetchFileContent({ projectId, fileId: file._id })).catch((err) => {
          console.error('Failed to fetch file content for restored file:', err);
        });
      }
    });
  }, [dispatch, projectId, fileContents]);

  // Save open files and active file to localStorage
  useEffect(() => {
    localStorage.setItem('openFiles', JSON.stringify(openFiles));
    localStorage.setItem('activeFileId', activeFile?._id || '');
  }, [openFiles, activeFile]);

  return (
    <div className="grid grid-cols-12 h-[calc(100vh-4rem)]">
      {/* Left: File Explorer */}
      <div className="col-span-3 border-r p-2 overflow-y-auto">
        <FileExplorer projectId={projectId} onFileSelect={handleFileSelect} />
      </div>

      {/* Right: Code Editor with Tabs */}
      <div className="col-span-9 flex flex-col h-full">
        {openFiles.length > 0 ? (
          <Tabs
            value={activeFile?._id || ''}
            onValueChange={(tabId) => {
              const selectedFile = openFiles.find((file) => file._id === tabId);
              if (selectedFile) setActiveFile(selectedFile);
            }}
            className="flex flex-col h-full"
          >
            <TabsList className="border-b">
              {openFiles.map((file) => (
                <TabsTrigger key={file._id} value={file._id} className="flex items-center gap-1">
                  <span>{file.name}</span>
                  <span
                    className="ml-2 p-1 rounded-full hover:bg-muted cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenFiles(openFiles.filter((f) => f._id !== file._id));
                      if (activeFile?._id === file._id) {
                        setActiveFile(openFiles[0] || null);
                      }
                    }}
                  >
                    <X size={14} />
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-grow">
              {openFiles.map((file) => (
                <TabsContent key={file._id} value={file._id} className="h-full data-[state=active]:flex-grow">
                  <CodeEditor projectId={projectId} file={file} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a file from the file explorer to begin editing
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditorPage;