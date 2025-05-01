import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchFileContent, updateFileContent } from '@/store/fileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import { Pencil } from 'lucide-react';

const FileEditorPage = () => {
  const { projectId, fileId } = useParams();
  const dispatch = useDispatch();
  const { fileContent, loading } = useSelector((state) => state.files);
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (fileId && projectId) {
      dispatch(fetchFileContent({ projectId, fileId }));
    }
  }, [dispatch, projectId, fileId]);

  useEffect(() => {
    if (fileContent) {
      setValue(fileContent);
    }
  }, [fileContent]);

  const handleSave = async () => {
    if (!value) return;
    setIsSaving(true);
    try {
      await dispatch(updateFileContent({ projectId, fileId, content: value })).unwrap();
      toast.success('File saved');
    } catch (err) {
      toast.error('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center p-2 border-b bg-background">
        <p className="font-medium">{fileId}</p>
        <Button onClick={handleSave} disabled={isSaving || loading}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={value}
          onChange={(val) => setValue(val)}
          theme="vs-dark"
        />
      </div>
    </div>
  );
};

export default FileEditorPage;
