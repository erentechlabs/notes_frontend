# Notes Frontend

A modern, high-performance note-taking application with rich text editing, temporary sharing, and PWA capabilities.

## Features

- **Rich Text Editor** - Full-featured editor with formatting, lists, code blocks, and more
- **Smart Theming** - Auto-detects system preference with manual override
- **Temporary Sharing** - Time-based note expiration with shareable links
- **PWA Ready** - Installable with offline support and native-like experience
- **SEO Optimized** - Dynamic meta tags, Open Graph, and structured data
- **Performance First** - Code splitting, lazy loading, and optimized bundles
- **Fully Responsive** - Mobile-first design that works on all devices

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**Prerequisites:** Node.js 18+ and a backend API running on port 8080

## Tech Stack

- **React 18** + **TypeScript** - Modern React with full type safety
- **Vite** - Fast build tooling with HMR
- **TailwindCSS** - Utility-first styling
- **TipTap** - Headless rich text editor
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── editor/        # Rich text editor
│   └── ui/            # UI components
├── pages/             # Route components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── services/          # API layer
├── types/             # TypeScript definitions
└── utils/             # Helper functions
```

## API Endpoints

The app connects to a backend API on port 8080:

- `POST /api/notes` - Create note
- `GET /api/notes/{code}` - Get note
- `PUT /api/notes/{code}` - Update note

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Performance

- Code splitting and lazy loading
- Vendor chunking for optimal caching
- Tree shaking and minification
- Image optimization
- Gzip compression

## PWA Support

Install as a native app on any device:
- **Desktop**: Install button in browser
- **Mobile**: "Add to Home Screen"
- Works offline after first load

