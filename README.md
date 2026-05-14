# Portfolio OS Desktop

A modern, single-page portfolio website built with React, Vite, TailwindCSS, and Framer Motion. The site mimics a premium futuristic operating system desktop environment, featuring draggable windows, a glassmorphism taskbar, and animated desktop icons.

## Features

- **OS Desktop UI**: Full-screen desktop experience with glassmorphism background and animated particles
- **Draggable Windows**: Realistic OS-style windows with close, minimize, and maximize controls
- **Taskbar**: Floating dock with app icons that open browser-style popup windows
- **Desktop Icons**: Projects, Skills, About Me, Contact, and Resume folders
- **Responsive Design**: Desktop-first with keyboard accessibility
- **Smooth Animations**: Framer Motion for hover effects, window transitions, and drag inertia

## Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- Framer Motion

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Background.tsx       # Animated background with particles
│   ├── DesktopIcon.tsx      # Desktop icon component
│   ├── Taskbar.tsx          # Bottom taskbar with app icons
│   ├── Window.tsx           # Base draggable window component
│   ├── BrowserWindow.tsx    # Browser-style popup for apps
│   ├── ProjectsWindow.tsx   # File explorer for projects
│   ├── SkillsWindow.tsx     # Settings panel for skills
│   ├── AboutWindow.tsx      # Profile card
│   ├── ContactWindow.tsx    # Contact form
│   └── ResumeWindow.tsx     # Resume viewer
├── App.tsx                  # Main desktop component
├── main.tsx                 # Entry point
└── index.css                # Tailwind imports
```
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
