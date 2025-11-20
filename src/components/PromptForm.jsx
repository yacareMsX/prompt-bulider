import { useState, useEffect } from 'react';
import { X, Plus, Save, Sparkles, Check, RefreshCw } from 'lucide-react';

// Mock AI Service
const mockAIImprovement = async (text) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`[Mejorado por IA] ${text}\n\n✨ Sugerencia: Considera añadir más contexto sobre el tono deseado y el formato de salida para obtener mejores resultados.`);
        }, 1500);
    });
};

export default function PromptForm({ isOpen, onClose, onSave, initialData = null, projects = [] }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        projectId: ''
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    content: initialData.content,
                    tags: initialData.tags ? initialData.tags.join(', ') : '',
                    projectId: initialData.projectId || ''
                });
            } else {
                setFormData({ title: '', content: '', tags: '', projectId: '' });
            }
            setAiSuggestion(null);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const tagsArray = formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        onSave({
            ...formData,
            tags: tagsArray,
            projectId: formData.projectId || null
        });
    };

    const handleAIImprove = async () => {
        if (!formData.content.trim()) return;

        setIsGenerating(true);
        setAiSuggestion(null);

        try {
            const improvedText = await mockAIImprovement(formData.content);
            setAiSuggestion(improvedText);
        } catch (error) {
            console.error("Error generating AI suggestion", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const acceptSuggestion = () => {
        setFormData({ ...formData, content: aiSuggestion });
        setAiSuggestion(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Editar Prompt' : 'Nuevo Prompt'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                Título
                            </label>
                            <input
                                type="text"
                                id="title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ej: Experto en Python"
                            />
                        </div>

                        <div>
                            <label htmlFor="project" className="block text-sm font-medium text-gray-300 mb-2">
                                Proyecto
                            </label>
                            <select
                                id="project"
                                value={formData.projectId}
                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                            >
                                <option value="">Sin proyecto</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                                Contenido del Prompt
                            </label>
                            <button
                                type="button"
                                onClick={handleAIImprove}
                                disabled={isGenerating || !formData.content.trim()}
                                className={`
                                flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all
                                ${isGenerating
                                        ? 'bg-purple-500/20 text-purple-300 cursor-wait'
                                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20'
                                    }
                                disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw size={12} className="animate-spin" />
                                        <span>Mejorando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={12} />
                                        <span>Mejorar con IA</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <textarea
                            id="content"
                            required
                            rows={6}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                            placeholder="Escribe aquí tu prompt..."
                        />

                        {/* AI Suggestion Box */}
                        {aiSuggestion && (
                            <div className="mt-3 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="text-purple-400 mt-1 flex-shrink-0" size={18} />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-purple-300 mb-1">Sugerencia de IA</h4>
                                        <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap mb-3">
                                            {aiSuggestion}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={acceptSuggestion}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs rounded-md transition-colors"
                                            >
                                                <Check size={12} />
                                                Aplicar cambio
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setAiSuggestion(null)}
                                                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-md transition-colors"
                                            >
                                                Descartar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                            Etiquetas (separadas por comas)
                        </label>
                        <input
                            type="text"
                            id="tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="coding, productividad, email..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                        >
                            <Save size={18} />
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
