'use client';

import { useState, useEffect } from "react";
import { GoodDeed } from "@/types";
import { deedSchema } from '@/lib/validation';
import { useFormValidation } from '@/hooks/useFormValidation';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface DeedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string, description?: string }) => void;
    deed?: GoodDeed | null;
    loading?: boolean;
    errors?: string[] | null;
}

export default function DeedModal({ isOpen, onClose, onSubmit, deed, loading, errors }: DeedModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const { getFieldError, validate } = useFormValidation({
        schema: deedSchema,
        onSuccess: (data) => {
            onSubmit({
                title: data.title,
                description: data.description || undefined
            });
        }
    });

    useEffect(() => {
        if (deed) {
            setTitle(deed.title);
            setDescription(deed.description || '');
        }
        else {
            setTitle('');
            setDescription('');
        }
    }, [deed, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        validate({ title, description });
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4'>
            <div className='bg-white rounded-xl shadow-xl p-6 w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6'>{deed ? 'Редактировать дело' : 'Новое доброе дело'}</h2>

                {/* {errors && errors.length > 0 && !errors[0].startsWith('title') && (
                    <div className='bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm'>{errors[0]}</div>
                )} */}

                <form onSubmit={handleSubmit}>
                    <Input
                        label='Название'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        error={getFieldError('title')}
                        placeholder='Что хорошего хотите сделать?' />

                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Описание
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                getFieldError('description') ? 'border-red-500' : 'border-gray-300'
                            }`}
                            rows={3}
                            placeholder="Подробнее о деле..." />
                            {getFieldError('description') && (
                                <p className='text-red-500 text-sm mt-1'>{getFieldError('description')}</p>
                            )}
                    </div>

                    <div className='flex gap-3 justify-end'>
                        <Button type='button' variant='secondary' onClick={onClose}>Отмена</Button>
                        <Button type='submit' loading={loading}>
                            {deed ? 'Сохранить' : 'Создать'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}