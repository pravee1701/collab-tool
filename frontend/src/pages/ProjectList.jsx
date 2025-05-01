import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '@/store/projectSlice';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Your Projects</h1>
      <Button asChild>
        <Link to="/projects/create">Create New Project</Link>
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {projects?.map((project) => (
          <div key={project._id} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-sm">{project.description}</p>
            <Link to={`/projects/${project._id}`}>
              <Button className="mt-4">View Details</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
