# Colors - Cross-Platform Color Palette Application

A lightweight, performance-oriented cross-platform color palette application for Linux, Windows, and Android with cloud synchronization.

---

## Technology Stack (Confirmed)

| Component             | Technology                      | Rationale                                    |
| --------------------- | ------------------------------- | -------------------------------------------- |
| **Desktop Framework** | Tauri 2.0 (Rust + Vite + React) | Lightweight, native OS access, no Electron   |
| **Mobile Framework**  | React Native + Expo             | Shared React knowledge, simplified builds    |
| **Backend/Database**  | Supabase (free tier)            | Auth, realtime, storage, PostgreSQL          |
| **State Management**  | Zustand                         | Lightweight, simple API                      |
| **Monorepo**          | Turborepo + pnpm                | Fast builds, shared code                     |
| **Sync Strategy**     | Online sync + offline cache     | Real-time when connected, queue when offline |

---

## Project Architecture

```
colors/
├── apps/
│   ├── desktop/                    # Tauri + Vite + React desktop app
│   │   ├── src/
│   │   │   ├── components/         # React components
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   ├── stores/             # Zustand stores
│   │   │   ├── styles/             # CSS/Styling
│   │   │   ├── utils/              # Utility functions
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── src-tauri/              # Tauri Rust backend
│   │   │   ├── src/
│   │   │   │   ├── color_picker.rs # Native screen color picker
│   │   │   │   ├── window.rs       # Window management (always-on-top)
│   │   │   │   └── main.rs
│   │   │   ├── Cargo.toml
│   │   │   └── tauri.conf.json
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── mobile/                     # React Native + Expo Android app
│       ├── src/
│       │   ├── components/         # React Native components
│       │   ├── hooks/              # Custom hooks
│       │   ├── screens/            # App screens
│       │   ├── stores/             # Zustand stores
│       │   ├── navigation/         # React Navigation setup
│       │   └── utils/              # Utilities
│       ├── app.json
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/                     # Shared code between platforms
│   │   ├── src/
│   │   │   ├── types/              # TypeScript types/interfaces
│   │   │   │   ├── color.ts
│   │   │   │   ├── project.ts
│   │   │   │   ├── folder.ts
│   │   │   │   └── user.ts
│   │   │   ├── hooks/              # Shared React hooks
│   │   │   │   ├── useColors.ts
│   │   │   │   ├── useProjects.ts
│   │   │   │   └── useAuth.ts
│   │   │   ├── utils/              # Shared utilities
│   │   │   │   ├── colorConversion.ts
│   │   │   │   ├── colorExtraction.ts
│   │   │   │   └── validation.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── supabase/                   # Supabase client & types
│       ├── src/
│       │   ├── client.ts           # Supabase client setup
│       │   ├── auth.ts             # Authentication helpers
│       │   ├── database.ts         # Database operations
│       │   ├── storage.ts          # File storage (images)
│       │   ├── sync.ts             # Offline queue & sync logic
│       │   └── types.ts            # Generated Supabase types
│       ├── package.json
│       └── tsconfig.json
│
├── supabase/                       # Supabase project config
│   ├── migrations/                 # Database migrations
│   ├── functions/                  # Edge functions (if needed)
│   └── config.toml
│
├── turbo.json                      # Turborepo configuration
├── package.json                    # Root package.json (workspaces)
├── pnpm-workspace.yaml             # pnpm workspace config
└── README.md
```

---

## Database Schema (Supabase)

```sql
-- Users (handled by Supabase Auth)

-- Workspaces (one per user for now)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Workspace',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Folders (for organizing projects)
CREATE TABLE folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects (color collections)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Colors
CREATE TABLE colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  hex TEXT NOT NULL,
  rgb JSONB,
  hsl JSONB,
  name TEXT,
  notes TEXT,
  position INTEGER DEFAULT 0,
  source TEXT, -- 'picker', 'image', 'manual'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Reference Images (stored in Supabase Storage)
CREATE TABLE reference_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  extracted_colors UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Offline sync queue (client-side, stored in IndexedDB/AsyncStorage)
-- Not a Supabase table, but documented here for reference
```

---

## Platform Feature Matrix

| Feature                | Desktop (Windows/Linux) | Mobile (Android)     |
| ---------------------- | ----------------------- | -------------------- |
| Screen color picker    | ✅ Native (Rust)        | ❌ Not supported     |
| Floating always-on-top | ✅ Tauri window         | ❌ Not needed        |
| Image color extraction | ✅ Upload/drop images   | ✅ Gallery only      |
| Manual color input     | ✅ HEX/RGB/HSL          | ✅ HEX/RGB/HSL       |
| Project management     | ✅ Full CRUD            | ✅ Full CRUD         |
| Folder organization    | ✅ Full support         | ✅ Full support      |
| Real-time sync         | ✅ Supabase realtime    | ✅ Supabase realtime |
| Offline caching        | ✅ IndexedDB            | ✅ AsyncStorage      |
| Export colors          | ✅ JSON/CSS/Sass        | ❌ View only         |
| Global hotkeys         | ✅ System-wide          | ❌ Not applicable    |

---

## Implementation Phases (Desktop-First)

### Phase 1: Project Initialization & Monorepo Setup

**Duration**: 2-3 days

| Task                    | Description                                    |
| ----------------------- | ---------------------------------------------- |
| Initialize Turborepo    | Create monorepo structure with pnpm workspaces |
| Configure TypeScript    | Set up shared tsconfig with strict mode        |
| Set up Biome            | Linting and formatting (faster than ESLint)    |
| Create shared package   | Initialize `packages/shared` with basic types  |
| Create supabase package | Initialize `packages/supabase` skeleton        |
| Documentation           | Create README with setup instructions          |

**Deliverables**: Working monorepo with all packages linked

---

### Phase 2: Supabase Backend Setup

**Duration**: 2-3 days

| Task                      | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| Create Supabase project   | Set up free-tier Supabase instance                      |
| Design database schema    | Create tables for workspaces, folders, projects, colors |
| Write migrations          | SQL migration files for schema                          |
| Configure RLS policies    | Row-level security for user data isolation              |
| Set up Storage bucket     | For reference images                                    |
| Generate TypeScript types | Using Supabase CLI                                      |
| Implement client          | Create typed Supabase client wrapper                    |

**Deliverables**: Fully configured Supabase backend with types

---

### Phase 3: Shared Logic Implementation

**Duration**: 3-4 days

| Task                   | Description                                         |
| ---------------------- | --------------------------------------------------- |
| Color types            | Define Color, Project, Folder, Workspace interfaces |
| Color conversion utils | HEX ↔ RGB ↔ HSL ↔ CMYK conversions                  |
| Color extraction       | Extract dominant colors from images (colorthief)    |
| Validation utils       | Input validation for colors, names                  |
| useAuth hook           | Shared authentication hook                          |
| useColors hook         | CRUD operations for colors                          |
| useProjects hook       | CRUD operations for projects                        |
| useFolders hook        | CRUD operations for folders                         |

**Deliverables**: Shared package with all reusable logic

---

### Phase 4: Desktop App - Core UI

**Duration**: 4-5 days

| Task                    | Description                        |
| ----------------------- | ---------------------------------- |
| Initialize Vite + React | Create desktop app skeleton        |
| Configure Tauri         | Set up Tauri 2.0 with Vite         |
| Design system           | Colors, typography, spacing tokens |
| Layout components       | Sidebar, Header, MainContent       |
| Zustand stores          | Local state management             |
| Color palette component | Display and manage colors          |
| Color card component    | Individual color display with copy |
| Color input component   | Manual HEX/RGB/HSL entry           |
| Project list component  | Show user's projects               |
| Folder tree component   | Hierarchical folder view           |

**Deliverables**: Desktop app with core UI shell

---

### Phase 5: Desktop App - Native Color Picker

**Duration**: 4-5 days

| Task                     | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| Rust color picker module | Native screen pixel sampling using `screenshots` crate |
| Tauri commands           | Bridge Rust ↔ TypeScript for color picking             |
| Color wheel picker       | Interactive color selection (react-colorful)           |
| Eyedropper UI            | Crosshair cursor, magnifier preview                    |
| Floating window mode     | Always-on-top mini picker window                       |
| Window controls          | Minimize, pin, expand, close                           |
| Global hotkeys           | System-wide shortcuts (e.g., Alt+C to pick)            |

**Deliverables**: Native color picker with floating window

---

### Phase 6: Desktop App - Image & Data Features

**Duration**: 4-5 days

| Task                    | Description                                |
| ----------------------- | ------------------------------------------ |
| Image upload            | Drag & drop / file picker                  |
| Image color extraction  | Pick colors from uploaded images           |
| Reference image gallery | View and manage saved images               |
| Authentication UI       | Login, signup, password reset              |
| Supabase integration    | Connect to backend                         |
| Real-time sync          | Live updates via Supabase realtime         |
| Project management      | Create, edit, delete projects              |
| Folder management       | Organize with folders                      |
| Export functionality    | Export colors as JSON, CSS variables, Sass |

**Deliverables**: Feature-complete desktop app with cloud sync

---

### Phase 7: Offline Support & Polish

**Duration**: 3-4 days

| Task                | Description                                  |
| ------------------- | -------------------------------------------- |
| IndexedDB caching   | Store data locally using idb-keyval or Dexie |
| Offline detection   | Network status monitoring                    |
| Offline queue       | Queue mutations when offline                 |
| Sync on reconnect   | Process queue when back online               |
| Conflict resolution | Last-write-wins with timestamps              |
| UI animations       | Smooth transitions (Framer Motion)           |
| Loading states      | Skeleton loaders, spinners                   |
| Error handling      | User-friendly error messages                 |
| Dark/light themes   | System theme detection + toggle              |

**Deliverables**: Polished desktop app with offline support

---

### Phase 8: Desktop Testing & Build

**Duration**: 2-3 days

| Task                   | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| Unit tests             | Test shared utilities (Vitest)                       |
| Component tests        | React Testing Library                                |
| E2E tests              | Playwright for desktop workflows                     |
| Cross-platform testing | Test on Windows and Linux                            |
| Tauri builds           | Build for Windows (.msi) and Linux (.deb, .AppImage) |
| Auto-update            | Tauri updater setup                                  |
| CI/CD pipeline         | GitHub Actions for automated builds                  |

**Deliverables**: Tested, distributable desktop application

---

### Phase 9: Mobile App - Core Setup

**Duration**: 3-4 days

| Task                 | Description                             |
| -------------------- | --------------------------------------- |
| Initialize Expo      | Create React Native app with TypeScript |
| Configure navigation | React Navigation (native-stack)         |
| Design system        | Mobile-adapted design tokens            |
| Auth screens         | Login, signup flows                     |
| Supabase integration | Connect shared supabase package         |
| Zustand stores       | Mobile state management                 |
| Offline caching      | AsyncStorage for local data             |

**Deliverables**: Mobile app skeleton with auth

---

### Phase 10: Mobile App - Features

**Duration**: 3-4 days

| Task                | Description                                    |
| ------------------- | ---------------------------------------------- |
| Home screen         | Project overview with folders                  |
| Project screen      | View and manage project colors                 |
| Color input screen  | Manual HEX/RGB/HSL entry                       |
| Image picker        | Select photos from gallery (expo-image-picker) |
| Color extraction    | Extract colors from selected images            |
| Color detail screen | View color info, copy codes                    |
| Real-time sync      | Supabase realtime subscriptions                |
| Pull-to-refresh     | Refresh data on demand                         |

**Deliverables**: Feature-complete mobile app

---

### Phase 11: Mobile Polish & Build

**Duration**: 2-3 days

| Task            | Description                             |
| --------------- | --------------------------------------- |
| UI polish       | Animations, haptics, smooth transitions |
| Error handling  | User-friendly messages and retry        |
| Offline mode    | Graceful degradation when offline       |
| Performance     | Optimize list rendering (FlashList)     |
| Android build   | APK for testing                         |
| Play Store prep | App bundle, screenshots, listing        |

**Deliverables**: Polished, distributable Android app

---

### Phase 12: Final Integration & Launch

**Duration**: 2-3 days

| Task                 | Description                            |
| -------------------- | -------------------------------------- |
| Cross-device testing | Verify sync between desktop and mobile |
| Bug fixes            | Address issues found in testing        |
| Documentation        | User guide, README updates             |
| Release builds       | Final production builds                |
| Version tagging      | Git tags and changelogs                |
| Launch prep          | Distribution and announcements         |

**Deliverables**: Production-ready applications

---

## Sync Strategy

```
┌─────────────────┐     ┌─────────────────┐
│  Desktop App    │     │   Mobile App    │
│                 │     │                 │
│  ┌───────────┐  │     │  ┌───────────┐  │
│  │ Zustand   │  │     │  │ Zustand   │  │
│  │ Store     │  │     │  │ Store     │  │
│  └─────┬─────┘  │     │  └─────┬─────┘  │
│        │        │     │        │        │
│  ┌─────▼─────┐  │     │  ┌─────▼─────┐  │
│  │ IndexedDB │  │     │  │AsyncStorage│ │
│  │ (cache)   │  │     │  │ (cache)   │  │
│  └─────┬─────┘  │     │  └─────┬─────┘  │
└────────┼────────┘     └────────┼────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │  Supabase   │
              │  Realtime   │
              │  PostgreSQL │
              └─────────────┘

Online:  Sync immediately via Supabase realtime
Offline: Queue changes locally, sync when reconnected
```

---

## Dependencies

### Root (Turborepo)

```json
{
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0",
    "@biomejs/biome": "^1.5.0"
  }
}
```

### Desktop App (apps/desktop)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0",
    "@tauri-apps/api": "^2.0.0",
    "react-colorful": "^5.6.1",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.300.0",
    "idb-keyval": "^6.2.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Mobile App (apps/mobile)

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react": "^18.2.0",
    "react-native": "0.73.0",
    "zustand": "^4.5.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/native-stack": "^6.9.0",
    "expo-image-picker": "~14.7.0",
    "@shopify/flash-list": "^1.6.0",
    "react-native-reanimated": "~3.6.0"
  }
}
```

### Shared Package (packages/shared)

```json
{
  "dependencies": {
    "colorthief": "^2.4.0"
  }
}
```

### Supabase Package (packages/supabase)

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

---

## Timeline Summary (Desktop-First)

| Phase                | Name                    | Duration | Cumulative   |
| -------------------- | ----------------------- | -------- | ------------ |
| 1                    | Monorepo Setup          | 2-3 days | Week 1       |
| 2                    | Supabase Backend        | 2-3 days | Week 1       |
| 3                    | Shared Logic            | 3-4 days | Week 2       |
| 4                    | Desktop Core UI         | 4-5 days | Week 2-3     |
| 5                    | Native Color Picker     | 4-5 days | Week 3-4     |
| 6                    | Desktop Data Features   | 4-5 days | Week 4-5     |
| 7                    | Offline & Polish        | 3-4 days | Week 5       |
| 8                    | Desktop Testing & Build | 2-3 days | Week 5-6     |
| **Desktop Complete** |                         |          | **~6 weeks** |
| 9                    | Mobile Core Setup       | 3-4 days | Week 6-7     |
| 10                   | Mobile Features         | 3-4 days | Week 7       |
| 11                   | Mobile Polish & Build   | 2-3 days | Week 7-8     |
| 12                   | Final Integration       | 2-3 days | Week 8       |
| **Full Project**     |                         |          | **~8 weeks** |

---

## Next Steps

1. ✅ Review and approve this implementation plan
2. 🔄 Install prerequisites:
   - Node.js 20+ and pnpm
   - Rust toolchain (rustup)
   - Tauri CLI prerequisites (platform-specific)
3. 🔄 Create Supabase account and project
4. 🔄 Begin Phase 1: Project Initialization

---

## Prerequisites Checklist

### Development Environment

- [ ] Node.js 20+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Rust installed (via rustup.rs)
- [ ] Tauri prerequisites installed (see Tauri docs for OS-specific)
- [ ] VS Code with extensions: Rust-Analyzer, Biome, Tauri

### Accounts

- [ ] Supabase account created
- [ ] GitHub repository created (for CI/CD)

### Platform-Specific (for testing)

- [ ] Windows machine or VM for Windows testing
- [ ] Linux machine or VM for Linux testing
- [ ] Android device or emulator for mobile testing
