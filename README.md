# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
 
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
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

# Admin Dashboard Frontend Architecture

## Introduction
This document outlines the frontend requirements for an Admin Dashboard built with:

- React 18 + Vite
- TypeScript
- Redux Toolkit (State Management)
- Material-UI (MUI) + Styled Components (Styling)
- React Router v6 (Routing)
- Axios (API Client)

## Naming Conventions

| File Type | Naming Pattern | Example |
|-----------|---------------|---------|
| Screen Components | [name].screen.tsx | Login.screen.tsx |
| Components | [name].component.tsx | Divider.component.tsx |
| Styled Components | [name].styles.tsx | Login.styles.tsx |
| Services | [name].service.tsx | Auth.service.tsx |
| Interfaces | [name].interface.tsx | Repository.interface.tsx |

## Project Structure

```
src/
├── app/                  # App configuration
├── core/                 # Cross-cutting concerns
│   └── auth/             # Authentication module
│       ├── components/   # Shared auth components
│       ├── screens/      # Auth screens
│       └── services/     # Auth services
└── modules/              # Feature modules
    ├── assets/           # Static assets
    ├── dashboard/        # Dashboard feature
    │   ├── components/   # Dashboard components
    │   ├── screens/      # Dashboard screens
    │   └── services/     # Dashboard services
    ├── hooks/            # Custom hooks
    ├── services/         # Shared services
    ├── types/            # Global types
    └── utils/            # Utility functions
```

## Module Component Architecture

### Dashboard Module

```
modules/
└── dashboard/
    ├── components/
    │   ├── Sidebar/
    │   │   ├── sidebar.component.tsx
    │   │   └── sidebar.styles.tsx
    │   └── StatsCard/
    │       ├── stats-card.component.tsx
    │       └── stats-card.styles.tsx
    ├── screens/
    │   └── Dashboard/
    │       ├── dashboard.screen.tsx
    │       └── dashboard.styles.tsx
    └── services/
```

### Auth Module

```
core/
└── auth/
    ├── components/
    │   ├── AuthForm/
    │   │   ├── auth-form.component.tsx
    │   │   └── auth-form.styles.tsx
    │   └── AuthHeader/
    │       ├── auth-header.component.tsx
    │       └── auth-header.styles.tsx
    ├── screens/
    │   ├── Login/
    │   │   ├── login.screen.tsx
    │   │   └── login.styles.tsx
    │   └── Signup/
    │       ├── signup.screen.tsx
    │       └── signup.styles.tsx
    └── services/
```

## Key Architecture Principles

- **Module Isolation**: Each module contains all related components, screens, and services.
- **No cross-module component dependencies**.
- **Component Organization**: Each component has its own directory with logic and styles.
- **Clear Separation**: Screens compose components; components remain presentation-only; business logic lives in services.

## Development

To start the development server:

```bash
npm run dev
```

To build for production:

```bash
npm run build
```
navigate to the url/login
