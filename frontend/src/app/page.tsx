'use client';
import { useSelector } from "react-redux"; 
import { RootState } from "@/store";
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-16'>
        <div className='text-center'>
          <h1 className='text-5xl font-bold text-gray-800 mb-4'>Список добрых дел</h1>
          <p className='text-xl text-gray-600 mb-8'>Делай добрые дела и делись ими с друзьями!</p>
          {isAuthenticated ? (
            <div className='space-y-4'>
              <p className='text-lg text-gray-700'>Добро пожаловать, {user?.name}!</p>
              <Link href='/dashboard' className='inline-block text-white px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors'>
              Перейти к списку дел
              </Link>
            </div>
          ) : (
            <div className='space-x-4'>
              <Link href='/login' className='inline-block bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-lg'>
              Войти
              </Link>
              <Link href='/register' className='inline-block bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue hover:bg-blue-50 transition-colors'>
              Зарегистрироваться
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
