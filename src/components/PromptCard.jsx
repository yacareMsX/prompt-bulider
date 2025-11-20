import { Copy, Trash2, Edit2, Check } from 'lucide-react';
import { useState } from 'react';

export default function PromptCard({ prompt, onCopy, onDelete, onEdit }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopy(prompt.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 hover:border-blue-500/50 transition-all group shadow-lg shadow-black/20 flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-100 line-clamp-1" title={prompt.title}>
                    {prompt.title}
                </h3>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(prompt)}
                        className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                        title="Editar"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(prompt.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-3 mb-4 flex-1 overflow-hidden relative group/code">
                <p className="text-gray-300 text-sm font-mono whitespace-pre-wrap line-clamp-6">
                    {prompt.content}
                </p>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/90 pointer-events-none" />
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-700/50">
                <div className="flex gap-2 overflow-hidden">
                    {prompt.tags?.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 whitespace-nowrap">
                            #{tag}
                        </span>
                    ))}
                </div>

                <button
                    onClick={handleCopy}
                    className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
            ${copied
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                        }
          `}
                >
                    {copied ? (
                        <>
                            <Check size={14} />
                            <span>Copiado</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Copiar</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
