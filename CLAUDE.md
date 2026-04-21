# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FairFleet is a **Drone Inspection Report Viewer** mobile app (technical test). The repo has two parts:
- `Fairsight/` — React Native/Expo mobile app (Ignite v11.5.0 boilerplate)
- `api/` — Express mock API server

## Commands

**All mobile commands must be run from `Fairsight/`** — the repo root has no `package.json`, so npm will fail if you don't `cd Fairsight/` first.

```bash
# Dev server
npm run start             # Expo dev server
npm run ios               # iOS simulator
npm run android           # Android simulator

# Type checking & linting
npm run compile           # TypeScript type check (no emit)
npm run lint              # ESLint with auto-fix
npm run lint:check        # ESLint check only

# Tests
npm test                  # Jest unit tests
npm run test:watch        # Jest watch mode
npm run test:maestro      # Maestro E2E tests

# Architecture analysis
npm run depcruise         # Dependency graph analysis

# Native builds (EAS local)
npm run build:ios:sim     # iOS simulator build
npm run build:android:sim # Android simulator build
```

Mock API (from `api/`):
```bash
npm start                 # Starts Express on port 3000
docker-compose up         # Docker alternative
```

## Architecture

### Theming
All styles use the themed style pattern — function receives theme tokens, never hardcode colors/spacing:
```typescript
const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  padding: spacing.md,
})
```
Access theme in components via `useAppTheme()`. Theme preference persists to MMKV. Supports light/dark/system.

### Navigation
- `AppNavigator` is the root (with error boundary + state persistence)
- All route params typed in `app/navigators/navigationTypes.ts`
- Deep linking configured via `Linking.createURL()`

### API Layer
- `app/services/api/` — apisauce (axios wrapper) singleton
- Base URL from `app/config/` — `config.dev.ts` vs `config.prod.ts`, selected via `__DEV__`

### Storage
- MMKV via `app/utils/storage/` — typed `load<T>()` / `save()` abstraction
- Used for: theme preference, navigation state, i18n language

### i18n
- i18next, 7 languages (en, ar, es, fr, hi, ja, ko), RTL-aware for Arabic
- Translation keys typed — never use raw strings in UI

### Component Library
Pre-built components in `app/components/`: `Screen`, `Button`, `Text`, `TextField`, `Card`, `ListItem`, `Header`, `EmptyState`, `Toggle`, `AutoImage`, `Icon`. Use these instead of raw RN primitives.

### ESLint Rules to Know
- Imports must use `@/` path alias for internal modules
- Must use project's component library (`@/components`), not raw RN components
- No circular dependencies (enforced by dependency-cruiser)
- Import order: external → internal (`@/`) → relative
