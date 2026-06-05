import { useState } from "react";
import { z, ZodType } from 'zod';
import { parseZodErrors } from '@/lib/validation';

interface UseFormValidationOptions<T> {
    schema: ZodType<T>;
    onSuccess: (data: T) => void;
}

export function useFormValidation<T>({ schema, onSuccess }: UseFormValidationOptions<T>) {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = (data: unknown): boolean => {
        try {
            const validData = schema.parse(data);
            setErrors({});
            onSuccess(validData);
            return true;
        }
        catch(err) {
            if(err instanceof z.ZodError) setErrors(parseZodErrors(err));
            return false;
        }
    };

    const clearErrors = () => setErrors({});

    const getFieldError = (field: string): string | undefined => {
        return errors[field];
    };

    return { errors, validate, clearErrors, getFieldError };
}