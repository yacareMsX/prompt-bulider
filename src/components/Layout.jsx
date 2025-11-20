import { useState } from 'react';
import { Menu, Plus, Copy, Trash2, Search, X, Folder, FolderPlus } from 'lucide-react';

export default function Layout({
    children,
    onSearch,
    onCreateNew,
    projects = [],
    selectedProjectId,
    onSelectProject,
    onCreateProject
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    const handleCreateProjectSubmit = (e) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            onCreateProject(newProjectName.trim());
            setNewProjectName('');
            setIsCreatingProject(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-gray-800 border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Prompt Manager
                        </h1>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4">
                        <button
                            onClick={onCreateNew}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-4 rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
                        >
                            <Plus size={18} />
                            Nuevo Prompt
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                                Biblioteca
                            </h3>
                            <button
                                onClick={() => onSelectProject(null)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${selectedProjectId === null
                                    ? 'text-blue-400 bg-blue-500/10'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <Copy size={18} />
                                <span>Todos los Prompts</span>
                            </button>
                        </div>

                        <div>
                            <div className="flex items-center justify-between px-3 mb-2">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Proyectos
                                </h3>
                                <button
                                    onClick={() => setIsCreatingProject(true)}
                                    className="text-gray-500 hover:text-blue-400 transition-colors"
                                    title="Crear Proyecto"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            {isCreatingProject && (
                                <form onSubmit={handleCreateProjectSubmit} className="px-3 mb-2">
                                    <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-700 rounded-md p-1.5">
                                        <FolderPlus size={14} className="text-gray-500" />
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Nombre..."
                                            value={newProjectName}
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            onBlur={() => {
                                                // Only close if empty to avoid frustration
                                                if (!newProjectName) setIsCreatingProject(false);
                                            }}
                                            className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="text-green-500 hover:text-green-400"
                                            onMouseDown={(e) => e.preventDefault()} // Prevent blur before submit
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-1">
                                {projects.map(project => (
                                    <button
                                        key={project.id}
                                        onClick={() => onSelectProject(project.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${selectedProjectId === project.id
                                            ? 'text-blue-400 bg-blue-500/10'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <Folder size={18} />
                                        <span className="truncate">{project.name}</span>
                                    </button>
                                ))}

                                {projects.length === 0 && !isCreatingProject && (
                                    <div className="px-3 py-2 text-sm text-gray-600 italic">
                                        Sin proyectos
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-gray-700">
                        <div className="text-xs text-gray-500 text-center">
                            v1.1.0
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-gray-800/50 backdrop-blur-md border-b border-gray-700 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden text-gray-400 hover:text-white p-2"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex-1 max-w-xl mx-4 lg:mx-0">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar prompts..."
                                onChange={(e) => onSearch && onSearch(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User profile or settings could go here */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500"></div>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
