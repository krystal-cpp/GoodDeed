import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        dispatch(clearError());

        const result = await dispatch(login({ username, password }));
        if (login.fulfilled.match(result)) router.push('/dashboard');
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-md'>
                <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>Вход</h1>

                {error && (
                    <div className='bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input label='Имя пользователя'
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Введите username" />
                    <Input label='Пароль'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Введите пароль" />
                    <div className='flex justify-center mt-4'>
                        <Button type='submit' loading={loading} className='w-full mt-4'>Войти</Button>
                    </div>
                </form>

                <p className='text-center mt-6 text-gray-600'>
                    Нет аккаунта?{' '}
                    <Link href='/register' className='text-blue-600 hover:underline'>Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
}