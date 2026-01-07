# Colors

A lightweight, performance-oriented cross-platform color palette application for Linux, Windows, and Android with cloud synchronization.

## Features

- 🎨 **Screen Color Picker** - Pick colors from anywhere on your screen (Desktop)
- 📁 **Project Organization** - Organize colors into projects and folders
- 🖼️ **Image Color Extraction** - Extract color palettes from images
- ☁️ **Cloud Sync** - Sync colors across devices with Supabase
- 📱 **Cross-Platform** - Desktop (Windows/Linux) and Mobile (Android)

## Tech Stack

- **Desktop**: Tauri 2.0 + Vite + React + TypeScript
- **Mobile**: React Native + Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State**: Zustand
- **Monorepo**: Turborepo + pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Rust (via [rustup.rs](https://rustup.rs))
- Tauri prerequisites ([see docs](https://tauri.app/v1/guides/getting-started/prerequisites))

### Installation

```bash
# Clone the repository
git clone git@github.com:Menintel/colors.git
cd colors

# Install dependencies
pnpm install

# Start desktop app in development
pnpm dev:desktop
```

## Project Structure

```
colors/
├── apps/
│   ├── desktop/          # Tauri + Vite + React
│   └── mobile/           # React Native + Expo
├── packages/
│   ├── shared/           # Shared types, hooks, utils
│   └── supabase/         # Supabase client & types
└── supabase/             # Database migrations
```

## License

MIT
