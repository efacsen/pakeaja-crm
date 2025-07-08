'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: Sun,
      description: 'Light theme for bright environments',
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: Moon,
      description: 'Dark theme for low-light environments',
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: Monitor,
      description: 'Follow system preference',
    },
  ];

  const currentTheme = themeOptions.find(option => option.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'relative h-9 w-9 px-0 transition-theme',
            'bg-background hover:bg-hover border-border'
          )}
          aria-label="Toggle theme"
        >
          <div className="relative h-4 w-4">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card border-border shadow-lg"
      >
        {themeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 cursor-pointer transition-theme',
                'hover:bg-hover focus:bg-hover',
                theme === option.value && 'bg-accent text-accent-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>
              {theme === option.value && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple theme toggle switch component
export function ThemeSwitch() {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(actualTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        'relative h-9 w-9 px-0 transition-theme',
        'hover:bg-hover'
      )}
      aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className="relative h-4 w-4">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute top-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
    </Button>
  );
}

// Theme indicator component for showing current theme
export function ThemeIndicator() {
  const { theme, actualTheme } = useTheme();

  const getThemeInfo = () => {
    switch (theme) {
      case 'light':
        return { icon: Sun, label: 'Light Mode', color: 'text-yellow-500' };
      case 'dark':
        return { icon: Moon, label: 'Dark Mode', color: 'text-blue-500' };
      case 'system':
        return { 
          icon: Monitor, 
          label: `System (${actualTheme === 'dark' ? 'Dark' : 'Light'})`,
          color: 'text-gray-500'
        };
      default:
        return { icon: Sun, label: 'Light Mode', color: 'text-yellow-500' };
    }
  };

  const themeInfo = getThemeInfo();
  const Icon = themeInfo.icon;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className={cn('h-4 w-4', themeInfo.color)} />
      <span>{themeInfo.label}</span>
    </div>
  );
} 