'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function DBInitializer() {
    const initializeFromDB = useAppStore(s => s.initializeFromDB);

    useEffect(() => {
        initializeFromDB();
    }, [initializeFromDB]);

    return null;
}
