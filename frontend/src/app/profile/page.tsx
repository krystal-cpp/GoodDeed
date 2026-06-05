'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { fetchProfile, updateProfile, deleteProfile, clearError } from '@/store/slices/profileSlice';
import { updateUserData } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ProfilePage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { profile, loading, error, validationErrors } = useSelector((state: RootState) => state.profile);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        dispatch(clearError());
        dispatch(fetchProfile());
    }, [isAuthenticated, dispatch, router]);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username);
            setEmail(profile.email);
            setName(profile.name);
        }
    }, [profile]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const data: any = { username, email, name };
        if (password) data.password = password;

        const result = await dispatch(updateProfile(data));
        if (updateProfile.fulfilled.match(result)) {
            dispatch(updateUserData(result.payload));
            setIsEditing(false);
            setPassword('');
            dispatch(clearError());
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие невозможно отменить!')) {
            await dispatch(deleteProfile());
            router.push('/');
        }
    };

    const getFieldError = (field: string): string | undefined => {
        if (!validationErrors || validationErrors.length === 0) return undefined;

        const error = validationErrors.find(e => e.toLowerCase().startsWith(field.toLowerCase() + ' '));
        if (!error) return undefined;
        if (error.includes('already exists')) {
            return 'Уже используется';
        }
        if (error.includes('longer than or equal to')) {
            const min = error.match(/\d+/)?.[0];
            return `Минимальная длина: ${min} символов`;
        }
        return 'Ошибка валидации';
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-md'>
                <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>Профиль</h1>

                {error && (
                    <div className='bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm'>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label='Имя пользователя'
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={getFieldError('username')}
                        disabled={!isEditing}
                        required />

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        required />

                    <Input
                        label='Имя'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        required />

                    {isEditing && (
                        <Input
                            label='Новый пароль (оставьте пустым, чтобы не менять)'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={getFieldError('password')}
                            placeholder='Минимум 6 символов' />
                    )}


                    {isEditing && (
                        <div className='flex gap-3 mt-6'>
                            <Button type='submit' loading={loading}>Сохранить</Button>
                            <Button type='button' variant='secondary'
                                onClick={() => {
                                    setIsEditing(false);
                                    setPassword('');
                                    dispatch(clearError());
                                    if (profile) {
                                        setUsername(profile.username);
                                        setEmail(profile.email);
                                        setName(profile.name);
                                    }
                                }}>Отмена</Button>
                        </div>
                    )}
                </form>

                {!isEditing && (
                    <div className='flex gap-3 mt-6'>
                        <Button type='button' onClick={() => setIsEditing(true)}>Редактировать</Button>
                    </div>
                )}

                <div className='mt-8 pt-6 border-t border-gray-200'>
                    <Button variant='danger'
                        onClick={handleDelete}
                        className='w-full'>Удалить</Button>
                </div>
            </div>
        </div>
    );
}