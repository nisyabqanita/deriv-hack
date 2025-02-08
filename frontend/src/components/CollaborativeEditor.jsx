import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { AlertCircle } from 'lucide-react';

export default  CollaborativeEditor = ({ socket, projectId }) => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('heading');
  const [isEditing, setIsEditing] = useState(false);

  // Debounced function to emit changes
  const emitChange = useCallback(
    debounce((newComponents) => {
      socket.emit('editor-update', {
        projectId,
        content: newComponents
      });
    }, 500),
    [socket, projectId]
  );

  useEffect(() => {
    socket.on('editor-update', (newContent) => {
      if (!isEditing) {
        setComponents(newContent);
      }
    });

    return () => {
      socket.off('editor-update');
    };
  }, [socket, isEditing]);

  const updateComponent = (index, newProperties) => {
    setIsEditing(true);
    const updatedComponents = [...components];
    updatedComponents[index] = {
      ...updatedComponents[index],
      properties: newProperties
    };
    setComponents(updatedComponents);
    emitChange(updatedComponents);
    setIsEditing(false);
  };

  const addComponent = () => {
    const newComponent = { ...componentTemplates[selectedComponent] };
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    emitChange(newComponents);
  };

  const removeComponent = (index) => {
    const updatedComponents = components.filter((_, i) => i !== index);
    setComponents(updatedComponents);
    emitChange(updatedComponents);
  };

  const moveComponent = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === components.length - 1)
    ) {
      return;
    }

    const updatedComponents = [...components];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [updatedComponents[index], updatedComponents[newIndex]] = 
    [updatedComponents[newIndex], updatedComponents[index]];
    
    setComponents(updatedComponents);
    emitChange(updatedComponents);
  };

  const saveContent = () => {
    socket.emit('save-content', {
      projectId,
      content: components
    });
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center gap-4 mb-4 sticky top-0 bg-white p-2">
          <select
            className="border rounded p-2"
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
          >
            <option value="heading">Heading</option>
            <option value="paragraph">Paragraph</option>
            <option value="list">List</option>
            <option value="alert">Alert</option>
          </select>
          <Button onClick={addComponent}>Add Component</Button>
          <Button onClick={saveContent}>Save Content</Button>
        </div>

        <div className="space-y-4">
          {components.map((component, index) => (
            <div key={index} className="relative border rounded p-4">
              <div className="absolute right-2 top-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveComponent(index, 'up')}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveComponent(index, 'down')}
                  disabled={index === components.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeComponent(index)}
                >
                  ×
                </Button>
              </div>
              
              {React.createElement(ComponentRenderers[component.type], {
                properties: component.properties,
                onUpdate: (newProperties) => updateComponent(index, newProperties)
              })}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

