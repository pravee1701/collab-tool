import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="card border p-4 rounded shadow-sm bg-white dark:bg-black">
      <h2 className="text-xl font-semibold">{project.name}</h2>
      <p className="text-muted-foreground mb-4">{project.description}</p>
      <Link to={`/projects/${project._id}`} className="btn btn-primary">
        Open Project
      </Link>
    </div>
  );
};

export default ProjectCard;
