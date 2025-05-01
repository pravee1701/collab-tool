import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { forkProject } from '@/store/projectSlice';
import { Button } from '@/components/ui/button';

const ProjectFork = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.projects);
  const [forkedProject, setForkedProject] = useState(null);

  useEffect(() => {
    const forkCurrentProject = async () => {
      try {
        const forked = await dispatch(forkProject(id));
        setForkedProject(forked.payload); // Update with the new forked project data
      } catch (err) {
        console.error('Failed to fork project:', err);
      }
    };

    forkCurrentProject();
  }, [id, dispatch]);

  const handleGoToForkedProject = () => {
    if (forkedProject) {
      navigate(`/projects/${forkedProject._id}`); // Navigate to the forked project details page
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Forking Project...</h1>
      
      {forkedProject ? (
        <div className="p-6 border border-gray-300 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Project Forked Successfully!</h2>
          <p className="mt-2">You have successfully forked the project: {forkedProject.name}.</p>
          <Button onClick={handleGoToForkedProject} className="mt-4">Go to Forked Project</Button>
        </div>
      ) : (
        <div>
          <p>Forking in progress...</p>
        </div>
      )}
    </div>
  );
};

export default ProjectFork;
