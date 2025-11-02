# Notes Frontend

A modern, feature-rich note-taking application with temporary sharing capabilities, built with performance and SEO in mind.

## ✨ Features

### Core Features
- 📝 **Rich Text Editor** with extensive formatting options:
  - Bold, Italic, Underline, Strikethrough
  - Headings (H1, H2, H3)
  - Text alignment (Left, Center, Right)
  - Text color and highlighting
  - Lists (Bullet, Numbered, Task/Checkbox)
  - Code blocks and inline code
  - Blockquotes
  - Subscript and Superscript
- 🌓 **Smart Theme System**
  - Auto-detects system preference (light/dark mode)
  - Manual theme toggle
  - Persists user preference
  - Responds to system theme changes in real-time
- ⏱️ **Time-based Note Expiration**
  - Configurable expiration duration
  - Visual expiration indicators
- 🔗 **Easy Sharing**
  - Shareable note links
  - Copy note code from interface
  - QR code generation (in share modal)
- 📱 **Fully Responsive Design**
  - Mobile-first approach
  - Optimized for all screen sizes
- ✨ **Smooth Animations**
  - Fade-in effects
  - Transition animations
  - Optimized with `will-change` for performance

### Technical Features
- 🚀 **Performance Optimizations**
  - Lazy loading of route components
  - Code splitting for vendor libraries
  - Optimized bundle sizes
  - Tree shaking
  - Minification with Terser (removes console.log in production)
- 🔍 **SEO Optimized**
  - Dynamic meta tags per page
  - Open Graph tags for social media
  - Twitter Card support
  - JSON-LD structured data
  - Canonical URLs
  - robots.txt and sitemap.xml
  - Semantic HTML
- ♿ **Accessibility**
  - ARIA labels
  - Keyboard navigation support
  - Screen reader friendly

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on http://localhost:8080

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app will run on http://localhost:3000 and proxy API requests to http://localhost:8080.

## 🛠️ Tech Stack

### Core
- **React 18** with TypeScript
- **Vite** for blazing-fast build tooling
- **TailwindCSS** for utility-first styling
- **React Router** for client-side routing

### Rich Text Editor
- **TipTap** (Headless Prosemirror wrapper)
- Extensions: Highlight, Subscript, Superscript, Strike, CodeBlock, TaskList, TextAlign, Color, Underline, and more

### UI & Icons
- **Lucide React** for beautiful, consistent icons
- Custom UI components built with Tailwind

### Data & API
- **Axios** for API calls
- **date-fns** for date formatting

### Development
- **TypeScript** for type safety
- **ESLint** for code linting
- **PostCSS** with Autoprefixer
- **Terser** for production minification

## 📁 Project Structure

```
src/
├── components/
│   ├── editor/         # Rich text editor components
│   │   ├── RichTextEditor.tsx
│   │   └── EditorToolbar.tsx
│   └── ui/             # Reusable UI components
│       ├── Button.tsx
│       ├── DurationSelector.tsx
│       ├── ShareModal.tsx
│       ├── ThemeToggle.tsx
│       ├── Toast.tsx
│       └── SEO.tsx     # SEO meta tags component
├── pages/              # Route pages
│   ├── CreateNotePage.tsx
│   └── ViewNotePage.tsx
├── contexts/           # React contexts
│   └── ToastContext.tsx
├── hooks/              # Custom React hooks
│   └── useTheme.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── note.ts
├── utils/              # Utility functions
│   ├── cn.ts           # Class name utilities
│   └── date.ts         # Date formatting
└── styles/             # Global styles
    └── index.css
```

## 🔌 API Integration

The frontend expects the backend to be running on port 8080 with the following endpoints:

- `POST /api/notes` - Create a new note
- `GET /api/notes/{urlCode}` - Retrieve a note
- `PUT /api/notes/{urlCode}` - Update a note

## 🎯 Performance

The application is optimized for performance with:
- **Code Splitting**: Routes are lazy-loaded
- **Vendor Chunking**: React, TipTap, and utilities are split into separate chunks
- **Minification**: Production builds are minified with Terser
- **Tree Shaking**: Unused code is eliminated
- **CSS Optimization**: Animations use `will-change` for better performance
- **Dependency Optimization**: Vite pre-bundles dependencies for faster loading

## 🔍 SEO Features

- **Meta Tags**: Dynamic, page-specific meta descriptions and titles
- **Open Graph**: Social media preview support (Facebook, LinkedIn)
- **Twitter Cards**: Enhanced Twitter sharing
- **Structured Data**: JSON-LD for rich search results
- **Sitemap**: XML sitemap for search engines
- **robots.txt**: Crawler directives for better indexing
- **Canonical URLs**: Prevents duplicate content issues

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:
- Minified JavaScript and CSS
- Code splitting for optimal loading
- Source maps disabled for smaller bundle size
- Console logs removed for cleaner production code

### Preview Production Build

```bash
npm run preview
```

## 📱 PWA Features

The app is a Progressive Web App with:
- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Works without internet after first load
- **Service Worker**: Smart caching for better performance
- **Native-like**: Runs in standalone mode when installed
- **Auto-updates**: Fetches latest version automatically

### Installing the PWA
- **Desktop**: Click install icon in address bar
- **Android**: Tap "Add to Home Screen" or use install banner
- **iOS**: Share button → "Add to Home Screen"

## 🔍 Note Lookup

Find notes quickly without typing URLs:
1. Click "Find Note" button in header
2. Enter note code
3. Press Enter or click "Find"

## 📢 Social Sharing

Share notes on:
- Twitter
- Facebook
- LinkedIn  
- WhatsApp
- Native device share (mobile)

## 📝 License

This project is part of a notes application system.
