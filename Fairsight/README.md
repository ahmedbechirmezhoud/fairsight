# Fairsight — Mobile

React Native / Expo mobile app for the Fairsight drone inspection viewer.

---

## Important: Expo Go is not supported

This app uses custom native modules (`@rnmapbox/maps`, `react-native-mmkv`, `react-native-keyboard-controller`, `react-native-bottom-tabs`, `@callstack/liquid-glass`). **It will not run in Expo Go.** You must build and install a custom dev client first.

---

## Prerequisites

- Node.js 18+
- Xcode (iOS) or Android Studio (Android) installed and configured
- An iOS simulator or Android emulator, or a physical device
- EAS CLI: `npm install -g eas-cli`

---

## First-time setup

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env
```

Open `.env` and add your Mapbox tokens before running prebuild:

```
RNMAPBOX_MAPS_DOWNLOAD_TOKEN=sk.ey...   # build-time, Android Maven download
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.ey... # runtime, tile requests
```

```bash
# 3. Generate native projects
npx expo prebuild

# or clean-rebuild if you already have android/ and ios/:
npx expo prebuild --clean
```

---

## Building the dev client

You only need to do this once, or whenever you add/change a native dependency.

### iOS simulator

```bash
npm run build:ios:sim
```

This produces a `.tar.gz` containing the `.app`. Extract it and drag it into your simulator, or let EAS install it automatically.

### iOS physical device

```bash
npm run build:ios:device
```

Requires a registered device UDID in your Apple Developer account.

### Android emulator / device

```bash
npm run build:android:sim   # emulator (.apk)
npm run build:android:device # physical device (.apk)
```

Install the resulting `.apk` via `adb install <file>.apk` or drag it onto a running emulator.

---

## Running the dev server

Once the dev client is installed on the target device or simulator:

```bash
npm run start        # Expo dev server (scan QR with the dev client app)
npm run ios          # start + launch iOS simulator directly
npm run android      # start + launch Android emulator directly
```

The dev server supports fast refresh. Native code changes require a rebuild.

---

## Other commands

```bash
npm run compile      # TypeScript check (no emit)
npm run lint         # ESLint with auto-fix
npm run lint:check   # ESLint check only
npm test             # Jest unit tests
npm run test:watch   # Jest watch mode
```

---

## Folder structure

```
Fairsight/
├── app/
│   ├── components/          UI component library
│   │   ├── report/          Report-specific atoms, molecules, organisms
│   │   └── chat/            Chat UI components
│   ├── navigators/          Navigation setup (AppNavigator, tab navigators, types)
│   ├── screens/             Screen-level components (thin coordinators)
│   ├── services/
│   │   └── api/             apisauce client and endpoint functions
│   ├── queries/             TanStack Query hooks (useReports, useReport, useConversation)
│   ├── theme/               Color tokens, spacing, typography, theme context
│   ├── types/               Shared TypeScript types (api.ts)
│   └── utils/               Small utilities (imageUrl, mapboxStyles, storage)
├── assets/
│   ├── icons/               PNG icon set used by the Icon component
│   └── images/              App icons and static images
├── docs/                    Architecture decision docs
├── app.json                 Static Expo config
├── app.config.ts            Dynamic Expo config (plugins, env vars)
└── .env.example             Required environment variables
```

### Component layers

Components in `app/components/report/` follow an atomic hierarchy:

| Layer | Examples |
|---|---|
| Atoms | `StatusBadge`, `TypeBadge`, `IssueSeverityBadge`, `ReportThumbnail` |
| Molecules | `ReportCardHeader`, `WeatherStats`, `LocationMap`, `IssueListItem` |
| Organisms | `ReportCard`, `ReportListFeed`, `IssuesList`, `ImagesGallery` |

Screens own query state and navigation only; all rendering is delegated to organisms.

---

## Platform differences

| Feature | iOS | Android |
|---|---|---|
| Maps | Apple Maps via react-native-maps | Mapbox GL via @rnmapbox/maps |
| Search | Dedicated bottom tab with floating bar | Inline bar below navigation header |
| Header blur | System ultra-thin material blur | Solid background |
| Tab bar | Native UITabBarController | react-native-bottom-tabs |
| Glass effects | Liquid Glass (iOS 26+) with fallback | Flat fallback |

See [`docs/map-strategy.md`](docs/map-strategy.md) and [`docs/ui-ux.md`](docs/ui-ux.md) for rationale.
