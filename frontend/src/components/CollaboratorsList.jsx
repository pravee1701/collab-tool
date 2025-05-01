import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { addCollaborator, removeCollaborator, updateCollaboratorPermissions } from "../store/projectSlice";
import { Input } from "@/components/ui/input";

const CollaboratorsList = ({ project }) => {
  const dispatch = useDispatch();
  const [newCollaborator, setNewCollaborator] = useState('');
  const [permission, setPermission] = useState('read');
  
  const handleAddCollaborator = () => {
    dispatch(addCollaborator({ projectId: project._id, email: newCollaborator }));
    setNewCollaborator('');
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    dispatch(removeCollaborator({ projectId: project._id, collaboratorId }));
  };

  const handleUpdatePermissions = (collaboratorId) => {
    dispatch(updateCollaboratorPermissions({ projectId: project._id, collaboratorId, permission }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold">Collaborators</h3>
      <ul className="list-disc pl-6">
        {project.collaboratorIds?.map((collaborator) => (
          <li key={collaborator._id}>
            {collaborator.username} - {collaborator.role}
            <Button onClick={() => handleRemoveCollaborator(collaborator._id)} className="ml-2">
              Remove
            </Button>
            <Input
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="ml-2"
            />
            <Button onClick={() => handleUpdatePermissions(collaborator._id)} className="ml-2">
              Update Permissions
            </Button>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Input
          type="email"
          value={newCollaborator}
          onChange={(e) => setNewCollaborator(e.target.value)}
          placeholder="Collaborator's email"
        />
        <Button onClick={handleAddCollaborator} className="mt-2">
          Add Collaborator
        </Button>
      </div>
    </div>
  );
};

export default CollaboratorsList;
