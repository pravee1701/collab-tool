import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject, forkProject } from '../store/projectSlice';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectSettings from '../components/ProjectSettings';
import CollaboratorsList from '../components/CollaboratorsList';
import { Button } from "@/components/ui/button";

const ProjectDetailsPage = () => {
  const { id } = useParams(); // Extract projectId from URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { project, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProject(id)); // Fetch project details when the page loads
  }, [dispatch, id]);

  const handleForkProject = () => {
    dispatch(forkProject(id)); // Fork project
  };

  const handleOpenFileExplorer = () => {
    navigate(`/projects/${id}/files`);
  };

  if (loading) return <div>Loading...</div>;

  // Handle the error correctly by rendering a string or fallback UI
  if (error) return <div style={{ color: 'red' }}>Error: {String(error) || 'An unexpected error occurred'}</div>;

  return (
    <>
      {project && (
        <>
          <h2>{project.name}</h2>
          <p>{project.description}</p>

          <div className="flex gap-4 mt-4">
            <Button onClick={handleForkProject}>Fork Project</Button>
            <Button variant="outline" onClick={handleOpenFileExplorer}>Open File Explorer</Button>
          </div>

          <ProjectSettings project={project} />
          <CollaboratorsList project={project} />
        </>
      )}
    </>
  );
};

export default ProjectDetailsPage;