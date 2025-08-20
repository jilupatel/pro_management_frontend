import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectForm from './ProjectForm';

const API_URL = 'http://localhost:5000/api/projects';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(API_URL);
            setProjects(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const handleCreate = async (projectData) => {
        try {
            const response = await axios.post(API_URL, projectData);
            setProjects([response.data, ...projects]);
            setShowForm(false);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleUpdate = async (projectData) => {
        try {
            const response = await axios.put(`${API_URL}/${editingProject._id}`, projectData);
            setProjects(projects.map(p => p._id === editingProject._id ? response.data : p));
            setEditingProject(null);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setProjects(projects.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div className="loading">Loading projects...</div>;

    return (
        <div className="project-list-container">
            <div className="header">
                <h1>Project Management</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    Create New Project
                </button>
            </div>

            {showForm && (
                <ProjectForm
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingProject && (
                <ProjectForm
                    project={editingProject}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingProject(null)}
                />
            )}



            <div className="projects-grid">
                {projects.length === 0 ? (
                    <div className="no-projects">No projects found. Create your first project!</div>
                ) : (
                    projects.map(project => (
                        <div key={project._id} className="project-card">
                            <h3>{project.name}</h3>
                            <p className="description">{project.description}</p>
                            <div className="project-details">
                                <span className="due-date">Due: {formatDate(project.due_date)}</span>
                                <span className={`status ${project.status}`}>{project.status}</span>
                            </div>
                            <div className="project-actions">
                                <button
                                    className="btn btn-edit"
                                    onClick={() => setEditingProject(project)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-delete"
                                    onClick={() => handleDelete(project._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProjectList;
