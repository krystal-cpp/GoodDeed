'use client';

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import { fetchFriends, addFriend, removeFriend, clearError } from "@/store/slices/friendsSlice";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function FriendsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { friends, loading, error } = useSelector((state: RootState) => state.friends);

    const [ username, setUsername ] = useState('');

    useEffect(() => {
        if(!isAuthenticated) {
            router.push('/login');
            return;
        }
        dispatch(fetchFriends());
    }, [isAuthenticated, dispatch, router]);

    const handleAddFriend = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if(!username.trim()) return;

        dispatch(clearError());
        const result = await dispatch(addFriend(username.trim()));

        if(addFriend.fulfilled.match(result)) {
            setUsername('');
            dispatch(fetchFriends());
        }
    };

    const handleRemoveFriend = async (friendId: number, friendName: string) => {
        if(window.confirm(`Удалить ${friendName} из друзей?`)) {
            await dispatch(removeFriend(friendId));
            dispatch(fetchFriends());
        }
    }

    return(
        <div className='min-h-screen bg-gray-50'>
            <div className='container mx-auto px-4 py-8'>
                <h1 className='text-3xl font-bold text-gray-800 mb-8'>Друзья</h1>

                <div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
                    <h2 className='text-xl font-semibold mb-4'>Добавить друга</h2>

                    {error && (
                        <div className='bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm'>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAddFriend} className='flex gap-3'>
                        <div className='flex-1'>
                            <Input
                            label='Username друга'
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Введите username"
                            required/>
                        </div>
                        <div className='flex items-center justify-center pt-1.5'>
                            <Button type='submit'>Добавить</Button>
                        </div>
                    </form>
                </div>
                <div className='bg-white rounded-xl shadow-lg p-6'>
                    <h2 className='text-xl font-semibold mb-4'>Мои друзья ({friends.length})</h2>

                    {loading ? (
                        <div className='text-center py-8'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'/>
                        </div>
                    ): friends.length === 0 ? (
                        <div className='text-center py-12'>
                            <p className='text-gray-500 text-lg mb-4'>У вас пока нет друзей</p>
                            <p className='text-gray-400'>Добавьте друзей по username, чтобы видеть их дела!</p>
                        </div>
                    ): (
                        <div className='space-y-3'>
                            {friends.map((friend) => (
                                <div key={friend.id} className='flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                                            <span className='text-blue-600 font-semibold text-lg'>
                                                {friend.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className='font-semibold text-gray-800'>{friend.name}</p>
                                            <p className='text-sm text-gray-500'>@{friend.username}</p>
                                        </div>
                                    </div>

                                    <div className='flex gap-2'>
                                        <Link href={`/friends/${friend.id}`} className='px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg'>Дела</Link>
                                        <Button variant='danger' onClick={() => handleRemoveFriend(friend.id, friend.name)}>Удалить</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}