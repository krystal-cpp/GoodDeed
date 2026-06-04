'use client';

import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { useEffect } from "react";
import { initializeAuth } from "@/store/slices/authSlice";

function AuthInitializer({children}: {children: React.ReactNode}) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeAuth());
    }, [dispatch]);

    return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>
        <AuthInitializer>{children}</AuthInitializer>
    </Provider>
}