import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error, validationErrors } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const getFieldError = (field: string): string | undefined => {
        if (!validationErrors || validationErrors.length === 0) return undefined;

        const error = validationErrors.find(e => {
            const lowerError = e.toLowerCase();
            if (lowerError.startsWith(field.toLowerCase() + ' ')) {
                return true;
            }
            return false;
        });

        if (!error) return undefined;

        if (error.includes('longer than or equal to')) {
            const min = error.match(/\d+/)?.[0];
            return `Минимальная длина: ${min} символов`;
        }
        if (error.includes('shorter than or equal to')) {
            const max = error.match(/\d+/)?.[0];
            return `Максимальная длина: ${max} символов`;
        }
        if (error.includes('should not be empty')) {
            return 'Обязательное поле';
        }
        if (error.includes('must be an email')) {
            return 'Некорректный email';
        }

        return 'Ошибка валидации';
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        dispatch(clearError());
        setLocalError('');

        if (password !== confirmPassword) {
            setLocalError('Пароли не совпадают');
            return;
        }

        const result = await dispatch(register({ username, email, name, password }));
        if (register.fulfilled.match(result)) router.push('/dashboard');
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-md'>
                <h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>Регистрация</h1>

                {(error || localError) && (
                    <div className='bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm'>{localError || error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label='Имя пользователя'
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={getFieldError('username')}
                        required
                        placeholder='Придумайте username (мин. 3 символа)' />
                    <Input
                        label='Email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='Введите email' />
                    <Input
                        label='Имя'
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={getFieldError('name')}
                        required
                        placeholder='Ваше имя (мин. 2 символа)' />
                    <Input
                        label='Пароль'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={getFieldError('password')}
                        required
                        placeholder='Минимум 6 символов' />
                    <Input
                        label='Подтвердите пароль'
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder='Повторите пароль' />
                    <div className='flex justify-center mt-4'>
                        <Button type='submit' loading={loading} className='w-full mt-4'>Зарегистрироваться</Button>
                    </div>
                </form>

                <p className='text-center mt-6 text-gray-600'>
                    Уже есть аккаунт?{' '}
                    <Link href='/login' className='text-blue-600 hover:underline'>Войти</Link>
                </p>
            </div>
        </div>
    );
}