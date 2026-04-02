"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Palette, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <div className="flex items-center gap-2">
            {theme === "light" && <Sun className="h-4 w-4" />}
            {theme === "dark" && <Moon className="h-4 w-4" />}
            {theme === "pink" && <Palette className="h-4 w-4" />}
            {theme === "system" && <Monitor className="h-4 w-4" />}
            {!theme && <Palette className="h-4 w-4" />}
            <span>Theme</span>
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("pink")}>
            Pink
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
            System
            </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
