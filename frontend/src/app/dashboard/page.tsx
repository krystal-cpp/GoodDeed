'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { fetchMyDeeds, createDeed, updateDeed, deleteDeed, clearError as clearDeedError } from '@/store/slices/deedsSlice';
import { GoodDeed } from '@/types';
import DeedCard from '@/components/good-deed/DeedCard';
import DeedModal from '@/components/good-deed/DeedModal';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { deeds, loading, validationErrors } = useSelector((state: RootState) => state.goodDeeds);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingDeed, setEditingDeed] = useState<GoodDeed | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        dispatch(fetchMyDeeds());
    }, [isAuthenticated, dispatch, router]);

    const handleCreate = async (data: { title: string, description?: string }) => {
        const result = await dispatch(createDeed(data));
        if (createDeed.fulfilled.match(result)) {
            setModalOpen(false);
            dispatch(clearDeedError());
        }
    };

    const handleUpdate = async (data: { title?: string, description?: string }) => {
        if (editingDeed) {
            const result = await dispatch(updateDeed({ id: editingDeed.id, data }));
            if (updateDeed.fulfilled.match(result)) {
                setEditingDeed(null);
                dispatch(clearDeedError());
            }
        }
    };

    const handleToggle = async (id: number, status: boolean) => {
        await dispatch(updateDeed({ id, data: { status } }));
    };

    const handleEdit = async (deed: GoodDeed) => {
        dispatch(clearDeedError());
        setEditingDeed(deed);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Удалить это доброе дело?')) await dispatch(deleteDeed(id));
        dispatch(fetchMyDeeds());
    }

    const activeDeeds = deeds.filter((d) => !d.status);
    const completedDeeds = deeds.filter((d) => d.status);

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container mx-auto px-4 py-8'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800'>Мои добрые дела</h1>
                    <Button onClick={() => { dispatch(clearDeedError()); setModalOpen(true) }}>+ Новое дело</Button>
                </div>
                {loading ? (
                    <div className='text-center py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto' />
                        <p className='mt-4 text-gray-600'>Загрузка...</p>
                    </div>
                ) : (
                    <>
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold mb-4 text-gray-700'>Активные ({activeDeeds.length})</h2>
                            <div className='space-y-4'>
                                {activeDeeds.map((deed) => (
                                    <DeedCard
                                        key={deed.id}
                                        deed={deed}
                                        onToggle={handleToggle}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete} />
                                ))}
                                {activeDeeds.length === 0 && (
                                    <p className='text-gray-500 text-center py-8 bg-white rounded-lg'>Нет активных дел. Создайте новое!</p>
                                )}
                            </div>
                        </div>

                        {completedDeeds.length > 0 && (
                            <div>
                                <h2 className='text-xl font-semibold mb-4 text-gray-700'>Выполненные ({completedDeeds.length})</h2>
                                <div className='space-y-4'>
                                    {completedDeeds.map((deed) => (
                                        <DeedCard
                                            key={deed.id}
                                            deed={deed}
                                            onToggle={handleToggle}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
                <DeedModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        dispatch(clearDeedError());
                    }}
                    errors={validationErrors}
                    onSubmit={handleCreate}
                    loading={loading} />

                <DeedModal
                    isOpen={!!editingDeed}
                    onClose={() => {
                        setEditingDeed(null);
                        dispatch(clearDeedError());
                    }}
                    errors={validationErrors}
                    onSubmit={handleUpdate}
                    deed={editingDeed}
                    loading={loading} />
            </div>
        </div>
    );
}