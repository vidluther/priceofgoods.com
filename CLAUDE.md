# CLAUDE.md - Development Guide

## Build & Development Commands
```bash
npm run dev      # Start local development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run astro    # Run Astro CLI commands
```

## Code Style & Conventions

### Project Structure
- Astro pages in `src/pages/`
- React components in `src/components/react/`
- Utility functions in `src/lib/`
- Layouts in `src/layouts/`

### TypeScript
- Strict mode enabled
- Use type annotations for function parameters and returns
- Use JSDoc for JavaScript files with `@ts-check` where needed

### Naming Conventions
- PascalCase for React components
- camelCase for functions, variables, and exports
- UPPERCASE for constants
- kebab-case for CSS classes and file names

### Formatting & Style
- 2-space indentation
- Trailing commas in multi-line objects and arrays
- Group related imports together
- Framework imports first, followed by project modules

### Error Handling
- Use try/catch for async operations
- Provide fallback values when operations fail
- Include context in error logging