import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProjectSettings } from "../store/projectSlice";
import { useDispatch } from 'react-redux';

const ProjectSettings = ({ project }) => {
  const [environment, setEnvironment] = useState(project.settings.environment);
  const [buildCommand, setBuildCommand] = useState(project.settings.buildCommand || '');
  const [startCommand, setStartCommand] = useState(project.settings.startCommand || '');
  const dispatch = useDispatch()

  const handleSaveSettings = () => {
    const updatedSettings = { environment, buildCommand, startCommand };
    dispatch(updateProjectSettings({ projectId: project._id, settings: updatedSettings }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold">Project Settings</h3>
      <div>
        <Input
          type="text"
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          placeholder="Environment (e.g., node)"
        />
        <Input
          type="text"
          value={buildCommand}
          onChange={(e) => setBuildCommand(e.target.value)}
          placeholder="Build Command"
        />
        <Input
          type="text"
          value={startCommand}
          onChange={(e) => setStartCommand(e.target.value)}
          placeholder="Start Command"
        />
      </div>
      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </div>
  );
};

export default ProjectSettings;
