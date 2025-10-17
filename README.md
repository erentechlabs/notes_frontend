# Notes Frontend

A modern, feature-rich note-taking application with temporary sharing capabilities.

## Features

- 🎨 Rich text editing with formatting options
- 🌓 Dark/Light theme support (system default)
- ⏱️ Time-based note expiration
- 🔗 Shareable note links
- 📱 Fully responsive design
- ✨ Smooth animations and transitions

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

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- TipTap for rich text editing
- React Router for navigation
- Axios for API calls
- Lucide React for icons

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── services/       # API services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── styles/         # Global styles
```

## API Integration

The frontend expects the backend to be running on port 8080 with the following endpoints:

- `POST /api/notes` - Create a new note
- `GET /api/notes/{urlCode}` - Retrieve a note
- `PUT /api/notes/{urlCode}` - Update a note
