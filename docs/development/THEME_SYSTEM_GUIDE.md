# 🎨 Theme System Guide - PakeAja CRM

## Overview

The PakeAja CRM now features a comprehensive dark/light theme system with automatic system preference detection and persistent user settings. The theme system uses modern CSS variables and React Context for seamless theme switching across the entire application.

## 🚀 Features

- **🌓 Dual Themes**: Light and Dark mode with professional color palettes
- **🖥️ System Preference**: Automatically follows user's OS theme preference
- **💾 Persistent Settings**: Remembers user choice across sessions
- **⚡ Smooth Transitions**: Animated theme switching with 200ms transitions
- **♿ Accessibility**: AA compliant contrast ratios and screen reader support
- **📱 Responsive**: Works perfectly across all device sizes

## 🎛️ How to Use

### Quick Theme Toggle
- **Dashboard Header**: Click the sun/moon icon in the top-right corner
- **Settings Page**: Navigate to Settings → Theme & Appearance for full options

### Theme Options
1. **Light Mode**: Clean, professional light theme for bright environments
2. **Dark Mode**: Modern dark theme optimized for low-light work sessions  
3. **System**: Automatically follows your operating system's theme preference

## 🏗️ Implementation Details

### Architecture
```
src/
├── contexts/
│   └── theme-context.tsx          # Theme state management
├── components/ui/
│   └── theme-toggle.tsx           # Theme toggle components
├── app/
│   ├── globals.css               # CSS variables and theme definitions
│   └── layout.tsx                # Theme provider integration
└── app/dashboard/settings/
    └── page.tsx                  # Settings page with theme controls
```

### Key Components

#### 1. ThemeProvider
- Manages theme state using React Context
- Handles localStorage persistence
- Listens for system theme changes
- Applies theme classes to document

#### 2. Theme Toggle Components
- **ThemeToggle**: Full dropdown with all options
- **ThemeSwitch**: Simple light/dark toggle
- **ThemeIndicator**: Shows current theme status

#### 3. CSS Variables
- Light and dark theme color palettes
- Semantic color naming (primary, secondary, accent, etc.)
- Smooth transition properties
- Custom utility classes

## 🎨 Color Palette

### Dark Theme Colors
```css
--bg-primary: #0a0b0d        /* Main background */
--bg-secondary: #13151a      /* Card backgrounds */
--bg-tertiary: #1a1d23       /* Elevated elements */
--bg-hover: #22252d          /* Hover states */

--text-primary: #ffffff      /* Main headings */
--text-secondary: #9ca3af    /* Secondary text */
--text-tertiary: #6b7280     /* Muted text */

--accent-primary: #3b82f6    /* Primary actions */
--accent-success: #10b981    /* Success states */
--accent-warning: #f59e0b    /* Warning states */
--accent-danger: #ef4444     /* Error states */
```

### Light Theme Colors
```css
--bg-primary: #ffffff        /* Main background */
--bg-secondary: #f9fafb      /* Card backgrounds */
--bg-tertiary: #f3f4f6       /* Elevated elements */
--bg-hover: #e5e7eb          /* Hover states */

--text-primary: #1f2937      /* Main headings */
--text-secondary: #4b5563    /* Secondary text */
--text-tertiary: #6b7280     /* Muted text */

--accent-primary: #3b82f6    /* Primary actions */
--accent-success: #10b981    /* Success states */
--accent-warning: #f59e0b    /* Warning states */
--accent-danger: #ef4444     /* Error states */
```

## 🔧 Developer Usage

### Using Theme Context
```tsx
import { useTheme } from '@/contexts/theme-context';

function MyComponent() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Actual theme being used: {actualTheme}</p>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

### Using CSS Variables
```css
.my-component {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  transition: background-color 0.2s, color 0.2s;
}

.my-component:hover {
  background-color: var(--bg-hover);
}
```

### Utility Classes
```tsx
// Background utilities
<div className="bg-primary">Primary background</div>
<div className="bg-secondary">Secondary background</div>

// Text utilities  
<p className="text-primary">Primary text</p>
<p className="text-secondary">Secondary text</p>

// Interactive elements
<button className="interactive-element">Hover me</button>

// Theme transitions
<div className="transition-theme">Smooth transitions</div>
```

## 🎯 Best Practices

### 1. Always Use CSS Variables
```css
/* ✅ Good - Uses theme variables */
.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
}

/* ❌ Bad - Hard-coded colors */
.card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}
```

### 2. Include Smooth Transitions
```css
/* ✅ Good - Smooth theme transitions */
.component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.2s, color 0.2s;
}
```

### 3. Test Both Themes
- Always test components in both light and dark themes
- Ensure proper contrast ratios for accessibility
- Verify hover states work in both themes

### 4. Use Semantic Colors
```css
/* ✅ Good - Semantic naming */
.success-message {
  color: var(--accent-success);
}

.error-message {
  color: var(--accent-danger);
}
```

## 🚨 Troubleshooting

### Theme Not Switching
1. Check if ThemeProvider is wrapping your app in layout.tsx
2. Verify theme context is being used correctly
3. Ensure CSS variables are defined in globals.css

### Colors Not Updating
1. Make sure you're using CSS variables instead of hard-coded colors
2. Check if transition classes are applied
3. Verify the component is inside the theme provider

### Persistence Not Working
1. Check localStorage permissions in browser
2. Verify theme context is properly initialized
3. Ensure useEffect for localStorage is running

## 🔄 Future Enhancements

- [ ] Custom color theme builder
- [ ] High contrast accessibility mode
- [ ] Multiple dark theme variants
- [ ] Theme preview in settings
- [ ] Automatic theme scheduling (day/night)
- [ ] Per-page theme preferences

## 📝 Changelog

### v1.0.0 (2025-01-08)
- ✨ Initial theme system implementation
- 🎨 Dark and light theme palettes
- ⚙️ Settings page integration
- 🔄 System preference detection
- 💾 localStorage persistence
- ♿ Accessibility improvements
- 📱 Responsive design support

---

**Need Help?** Check the Settings page for theme options or refer to the component documentation for advanced usage. 