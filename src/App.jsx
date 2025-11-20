import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PromptList from './components/PromptList';
import PromptForm from './components/PromptForm';

function App() {
  const [prompts, setPrompts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promptsRes, projectsRes] = await Promise.all([
          fetch('/api/prompts'),
          fetch('/api/projects')
        ]);

        if (promptsRes.ok) {
          const promptsData = await promptsRes.json();
          setPrompts(promptsData);
        }
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const handleCreateNew = () => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  };

  const handleCreateProject = async (name) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const newProject = await res.json();
        setProjects([newProject, ...projects]);
      } else {
        console.error('Project creation failed:', await res.text());
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este prompt?')) {
      try {
        const res = await fetch(`/api/prompts/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          setPrompts(prompts.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error("Error deleting prompt:", error);
      }
    }
  };

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleSavePrompt = async (promptData) => {
    try {
      if (editingPrompt) {
        // Update existing
        const res = await fetch(`/api/prompts/${editingPrompt.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promptData)
        });

        if (res.ok) {
          const updatedPrompt = await res.json();
          setPrompts(prompts.map(p => p.id === editingPrompt.id ? updatedPrompt : p));
        } else {
          console.error('Update failed:', await res.text());
        }
      } else {
        // Create new
        const res = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promptData)
        });

        if (res.ok) {
          const newPrompt = await res.json();
          setPrompts([newPrompt, ...prompts]);
        } else {
          console.error('Create failed:', await res.text());
        }
      }
      setIsFormOpen(false);
      setEditingPrompt(null);
    } catch (error) {
      console.error("Error saving prompt:", error);
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery) ||
      prompt.content.toLowerCase().includes(searchQuery) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery));

    const matchesProject = selectedProjectId
      ? prompt.projectId === selectedProjectId
      : true;

    return matchesSearch && matchesProject;
  });

  return (
    <Layout
      onSearch={handleSearch}
      onCreateNew={handleCreateNew}
      projects={projects}
      selectedProjectId={selectedProjectId}
      onSelectProject={setSelectedProjectId}
      onCreateProject={handleCreateProject}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {selectedProjectId
            ? projects.find(p => p.id === selectedProjectId)?.name
            : 'Todos los Prompts'}
        </h2>
        <p className="text-gray-400">
          {selectedProjectId
            ? `Prompts en el proyecto ${projects.find(p => p.id === selectedProjectId)?.name}`
            : 'Gestiona y organiza tu colección de prompts.'}
        </p>
      </div>

      <PromptList
        prompts={filteredPrompts}
        onCopy={handleCopy}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <PromptForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePrompt}
        initialData={editingPrompt}
        projects={projects}
      />
    </Layout>
  )
}

export default App
