"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { useTheme } from "@/lib/theme-context"

import { Button } from "@/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"

const themes = [
  { name: 'Iris', value: 'iris', color: '#8b5cf6' },
  { name: 'Plum', value: 'plum', color: '#a855f7' },
  { name: 'Crimson', value: 'crimson', color: '#dc2626' },
  { name: 'Sky', value: 'sky', color: '#0ea5e9' },
  { name: 'Lime', value: 'lime', color: '#84cc16' },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value as any)}
            className="flex items-center space-x-2"
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: themeOption.color }}
            />
            <span>{themeOption.name}</span>
            {theme === themeOption.value && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
