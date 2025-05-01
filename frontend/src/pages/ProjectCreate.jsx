import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '@/store/projectSlice';
import { Button } from '@/components/ui/button';
import {  Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const ProjectCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProject =  dispatch(createProject(formData));
    if (newProject) {
      navigate(`/projects`);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            name="name"
            placeholder="Project Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            type="text"
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="mt-4">Create Project</Button>
      </form>
    </div>
  );
};

export default ProjectCreate;
