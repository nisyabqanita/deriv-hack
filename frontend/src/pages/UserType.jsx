import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import b from '../assets/images/user/b.png';

export default function UserType() {
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userType, email }),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('userEmail', email);
  
        // Fetch user's projects
        const projectResponse = await fetch(`/api/projects?userId=${data.user_id}`);
        const projects = await projectResponse.json();
  
        let projectId;
        if (projects.length > 0) {
          projectId = projects[0].id;
        } else {
          const createProjectResponse = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: data.user_id,
              title: 'New Project',
              description: 'Auto-created project',
            }),
          });
  
          const newProject = await createProjectResponse.json();
          projectId = newProject.id;
        }
  
        // Log projectId to verify
        console.log(`Navigating to /collaboration/${projectId}`);
        
        navigate(`/collaboration/${projectId}`); // Navigate directly to CollaborationSpace
      } else {
        console.error('Authentication failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${b})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Card className="w-full max-w-lg p-8 bg-white/95 shadow-lg border border-gray-300 rounded-xl">
        <h1 className="text-4xl font-semibold text-center mb-8 text-gray-900 tracking-wide">
          Welcome to Deriv 
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select User Type
            </label>
            <select
              className="w-full py-2.5 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-red-500 transition duration-200 bg-transparent"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose your role
              </option>
              <option value="Seller">Seller</option>
              <option value="Buyer">Buyer</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full py-2 px-4 border-b-2 border-gray-300 focus:outline-none focus:border-red-500 transition duration-200 bg-transparent"
              required
            />
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition duration-200"
          >
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
