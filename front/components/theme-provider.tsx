"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

/**
 * A custom theme provider component.
 * 
 * @param {ThemeProviderProps} props - The props for the ThemeProvider component.
 * @returns {JSX.Element} The rendered ThemeProvider component.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
