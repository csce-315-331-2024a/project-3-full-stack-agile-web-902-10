"use client";

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import { type LanguageStore, createLanguageStore } from '@/lib/stores/language-store'

export const LanguageStoreContext = createContext<StoreApi<LanguageStore> | null>(
    null,
)

export interface LanguageStoreProviderProps {
    children: ReactNode
}

export const LanguageStoreProvider = ({
    children,
}: LanguageStoreProviderProps) => {
    const storeRef = useRef<StoreApi<LanguageStore>>()
    if (!storeRef.current) {
        storeRef.current = createLanguageStore()
    }

    return (
        <LanguageStoreContext.Provider value={storeRef.current}>
            {children}
        </LanguageStoreContext.Provider>
    )
}

export const useLanguageStore = <T,>(
    selector: (store: LanguageStore) => T,
): T => {
    const languageStoreContext = useContext(LanguageStoreContext)

    if (!languageStoreContext) {
        throw new Error(`useLanguageStore must be use within LanguageStoreProvider`)
    }

    return useStore(languageStoreContext, selector)
}