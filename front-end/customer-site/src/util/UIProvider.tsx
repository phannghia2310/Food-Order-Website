'use client'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from 'react';

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    localStorage.clear();
  })

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  )
}