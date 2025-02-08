
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetch('/api/projects')
        .then(res => res.json())
        .then(data => setProjects(data));
    }, []);
  
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="grid gap-4">
          {projects.map(project => (
            <Card key={project.id} className="p-4">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="mt-2">{project.description}</p>
              <Button 
                className="mt-4"
                onClick={() => navigate(`/collaboration/${project.id}`)}
              >
                Select Project
              </Button>
            </Card>
          ))}
        </div>
      </div>
    );
  };

export default ProjectList;
