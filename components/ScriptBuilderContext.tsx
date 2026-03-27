'use client'
import { createContext, useContext, ReactNode } from 'react'
import { useScriptBuilder } from '@/hooks/useScriptBuilder'

type ScriptBuilderContextType = ReturnType<typeof useScriptBuilder>

const ScriptBuilderContext = createContext<ScriptBuilderContextType | null>(null)

export function ScriptBuilderProvider({ children }: { children: ReactNode }) {
  const value = useScriptBuilder()
  return (
    <ScriptBuilderContext.Provider value={value}>
      {children}
    </ScriptBuilderContext.Provider>
  )
}

// Returns a no-op fallback if called outside the provider (SSR/SSG safe)
export function useScriptBuilderContext() {
  const ctx = useContext(ScriptBuilderContext)
  return ctx
}


// Convenience hook — returns just whether a prompt is selected
export function useIsInScript(id: string) {
  const ctx = useScriptBuilderContext()
  return ctx?.selectedPrompts.some(p => p.id === id) ?? false
}
