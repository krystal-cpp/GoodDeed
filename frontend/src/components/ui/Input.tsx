import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function Input({ label, error, disabled, ...props }: InputProps) {
    return(
        <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
                {label}
            </label>
            <input {...props} disabled={disabled} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 text-gray-500' : ''}`}/>
            {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
        </div>
    );
}