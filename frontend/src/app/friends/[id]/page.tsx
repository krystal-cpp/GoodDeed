'use client';

import { useEffect, use } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import { fetchFriendDeeds, clearFriendDeeds } from "@/store/slices/friendsSlice";
import Link from "next/link";

export default function FriendDeedsPage({ params }: { params: Promise<{id: string}> }) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { friendDeeds, loading } = useSelector((state: RootState) => state.friends);

    const { id } = use(params);
    const friendId = parseInt(id);

    useEffect(() => {
        if(!isAuthenticated) {
            router.push('/login');
            return;
        }
        dispatch(fetchFriendDeeds(friendId));

        return () => {
            dispatch(clearFriendDeeds());
        };
    }, [isAuthenticated, friendId, dispatch, router]);

    const activeDeeds = friendDeeds.filter((d) => !d.status);
    const completedDeeds = friendDeeds.filter((d) => d.status);

    const friendInfo = friendDeeds.length > 0 ? friendDeeds[0].owner : null;

    return(
        <div className='min-h-screen bg-gray-50'>
            <div className='container mx-auto px-4 py-8'>
                <div className='mb-8'>
                    <Link href='/friends' className='text-blue-600 hover:underline mb-4 inline-block'>← Назад к друзьям</Link>
                    <h1 className='text-3xl font-bold text-gray-300'>Дела {friendInfo ? friendInfo.name : 'друга'}</h1>
                    {friendInfo && (
                        <p className='text-gray-500 mt-1'>@{friendInfo.username}</p>
                    )}
                </div>

                {loading ? (
                    <div className='text-center py-12'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'/>
                        <p className='mt-4 text-gray-600'>Загрузка дел...</p>
                    </div>
                ) : (
                  <>
                    <div className='mb-8'>
                        <h2 className='text-xl font-semibold mb-4 text-gray-700'>Активные ({activeDeeds.length})</h2>
                        <div className='space-y-4'>
                            {activeDeeds.map((deed) => (
                                <div key={deed.id} className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-500'>
                                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>{deed.title}</h3>
                                    {deed.description && (
                                        <p className='text-gray-600 mb-3'>{deed.description}</p>
                                    )}
                                    <p className='text-sm text-gray-500'>Создано: {new Date(deed.createdAt).toLocaleDateString('ru-RU')}</p>
                                </div>
                            ))}
                            {activeDeeds.length === 0 && (
                                <p className='text-gray-500 text-center py-8 bg-white rounded-lg'>Нет активных дел</p>
                            )}
                        </div>
                    </div>

                    {completedDeeds.length > 0 && (
                        <div>
                            <h2 className='text-xl font-semibold mb-4 text-gray-700'>Выполненные ({completedDeeds.length})</h2>
                            <div className='space-y-4'>
                                {completedDeeds.map((deed) => (
                                    <div key={deed.id} className='bg-white rounded-lg shadow p-6 border-l-4 border-green-500 opacity-75'>
                                        <h3 className='text-lg font-semibold text-gray-800 mb-2 line-through'>{deed.title}</h3>
                                        {deed.description && (
                                            <p className='text-gray-600 mb-3'>{deed.description}</p>
                                        )}
                                        <div className='flex gap-4 text-sm text-gray-500'>
                                            <span>
                                                Создано: {new Date(deed.createdAt).toLocaleDateString('ru-RU')}
                                            </span>
                                            {deed.completedAt && (
                                                <span className='text-green-600'>✓ Выполнено: {new Date(deed.completedAt).toLocaleDateString('ru-RU')}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                  </>  
                )}
            </div>
        </div>
    );
}