import { FileQuestion } from 'lucide-react';
import PromptCard from './PromptCard';

export default function PromptList({ prompts, onCopy, onDelete, onEdit }) {
    if (!prompts || prompts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="bg-gray-800 p-6 rounded-full mb-4">
                    <FileQuestion size={48} className="text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No hay prompts todavía</h3>
                <p className="text-gray-500 max-w-sm">
                    Crea tu primer prompt para empezar a construir tu librería personal.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
                <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onCopy={onCopy}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
