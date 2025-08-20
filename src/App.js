import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import './App.css';

const API_URL = 'http://localhost:5000/api/projects';

function App() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);


  const [error, setError] = useState(null);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new project
  const createProject = async (projectData) => {
    try {
      const response = await axios.post(API_URL, projectData);
      setProjects([response.data, ...projects]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
    }
  };

  // Update existing project
  const updateProject = async (projectData) => {
    try {
      const response = await axios.put(`${API_URL}/${editingProject._id}`, projectData);
      setProjects(projects.map(project =>
        project._id === editingProject._id ? response.data : project
      ));
      setEditingProject(null);
      setError(null);
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setProjects(projects.filter(project => project._id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete project');
        console.error('Error deleting project:', err);
      }
    }
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="App">

      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : (
          <ProjectList
            projects={projects}
            onDelete={deleteProject}
            onEdit={setEditingProject}
          />
        )}

        {showForm && (
          <ProjectForm
            onSubmit={createProject}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingProject && (
          <ProjectForm
            project={editingProject}
            onSubmit={updateProject}
            onCancel={() => setEditingProject(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
