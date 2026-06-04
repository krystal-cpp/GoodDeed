'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { isAuthenticated, initialized } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [userName, setUserName] = useState('');

    const updateUserName = () => {
        if(typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if(userStr) {
                const user = JSON.parse(userStr);
                setUserName(user.name || '');
            }
        }
    };
    
    useEffect(() => {
        updateUserName();
        window.addEventListener('userUpdated', updateUserName);
        return () => window.removeEventListener('userUpdated', updateUserName);
    }, [isAuthenticated]);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    if(!initialized) {
        return(
            <header className='bg-white shadow-sm'>
                <div className='container mx-auto px-4 py-4'>
                    <Link href='/' className='text-2xl font-bold text-blue-600'>Добрые дела</Link>
                </div>
            </header>
        );
    }

    return(
        <header className='bg-white shadow-sm'>
            <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
                <Link href='/' className='text-2xl font-bold text-blue-600'>Добрые дела</Link>

                <nav className='flex items-center gap-4'>
                    {isAuthenticated ? (
                        <>
                            <Link href='/dashboard' className='text-gray-600 hover:text-blue-600 transition-colors'>
                            Мои дела
                            </Link>
                            <Link href='/profile' className='text-gray-600 hover:text-blue-600 transition-colors'>
                            Профиль
                            </Link>
                            <Link href='/friends' className='text-gray-600 hover:text-blue-600 transition-colors'>
                            Друзья
                            </Link>
                            
                            <div className='flex items-center gap-4'>
                                <span className='text-base text-gray-500'>{userName}</span>
                                <button onClick={handleLogout} className='text-red-500 hover:text-red-700 transition-colors'>Выйти</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href='/login' className='text-gray-600 hover:text-blue-600 transition-colors'>
                            Войти
                            </Link>
                            <Link href='/register' className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
                            Регистрация
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}