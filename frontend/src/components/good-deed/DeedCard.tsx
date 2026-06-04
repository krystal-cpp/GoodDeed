'use client';

import { GoodDeed } from "@/types";
import Button from "@/components/ui/Button";

interface DeedCardProps {
    deed: GoodDeed;
    onToggle: (id: number, status: boolean) => void;
    onEdit: (deed: GoodDeed) => void;
    onDelete: (id: number) => void;
}

export default function DeedCard({ deed, onToggle, onEdit, onDelete }: DeedCardProps) {
    return(
        <div className={`bg-white rounded-lg shadow p-6 border-l-4 transition-colors ${deed.status ? 'border-green-500' : 'border-blue-500'}`}>
            <div className='flex items-center justify-between'>
                <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                        <input
                        type='checkbox'
                        checked={deed.status}
                        onChange={() => onToggle(deed.id, !deed.status)}
                        className='w-5 h-5 text-blue-600 rounded focus:ring-blue-500'/>
                        <h3 className={`text-lg font-semibold ${deed.status ? 'line-through text-gray-400' : 'text-gray-800'}`}>{deed.title}</h3>
                    </div>

                    {deed.description && (
                        <p className='text-gray-600 ml-8 mb-3'>{deed.description}</p>
                    )}

                    <div className='flex gap-2 ml-8 text-sm text-gray-500'>
                        <span>
                            Создано: {new Date(deed.createdAt).toLocaleDateString('ru-RU')}
                        </span>
                        {deed.completedAt && (
                            <span className='text-green'>
                                ✓ Выполнено: {new Date(deed.completedAt).toLocaleDateString('ru-RU')}
                            </span>
                        )}
                    </div>
                </div>

                <div className='flex gap-2 ml-4'>
                    <Button variant='secondary' onClick={() => onEdit(deed)}>✏️</Button>
                    <Button variant='danger' onClick={() => onDelete(deed.id)}>🗑️</Button>
                </div>
            </div>
        </div>
    );
}
