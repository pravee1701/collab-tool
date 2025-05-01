import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchFileVersions, restoreFileVersion } from '@/store/fileSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const FileVersioningPage = () => {
  const { projectId, fileId } = useParams();
  const dispatch = useDispatch();
  const { fileVersions, loading } = useSelector((state) => state.files);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (fileId && projectId) {
      dispatch(fetchFileVersions({ projectId, fileId }));
    }
  }, [dispatch, projectId, fileId]);

  const handleRestore = async (versionId) => {
    setIsRestoring(true);
    try {
      await dispatch(restoreFileVersion({ projectId, fileId, versionId })).unwrap();
      toast.success('File version restored');
    } catch (err) {
      toast.error('Failed to restore version');
    } finally {
      setIsRestoring(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-lg font-semibold">File Version History</h2>
      <ul className="space-y-2 mt-4">
        {fileVersions?.map((version) => (
          <li key={version._id} className="flex justify-between items-center">
            <div>
              <p className="text-sm">{version.createdAt}</p>
              <p className="text-sm text-muted">{version.message}</p>
            </div>
            <Button
              onClick={() => handleRestore(version._id)}
              disabled={isRestoring}
              variant="outline"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileVersioningPage;
