import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
}

export default function Button({ children, variant='primary', loading, ...props } : ButtonProps) {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50';
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700'
    };

    return(
        <button { ...props } disabled={loading || props.disabled} className={`${baseClasses} ${variants[variant]}`}>
            {loading ? 'Загрузка' : children}
        </button>
    );
};