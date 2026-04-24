# API Layer, Types & Data Fetching

## Approach

The API layer is intentionally thin. A single `apisauce` (axios wrapper) instance is configured once with the base URL and shared error handling. All endpoint functions live in `app/services/api/` and return typed responses; they do not contain any UI logic.

The base URL is resolved at build time from the config system: `config.dev.ts` uses the platform-aware address (`10.0.2.2:3000` on Android emulator, `localhost:3000` on iOS simulator) so developers never manually switch addresses.

## Types

All API shapes are defined in `app/types/api.ts` and shared across the data layer, query hooks, and UI components. The source of truth is the API contract: the types mirror the JSON responses exactly. This avoids duplicating field definitions and ensures TypeScript surfaces any drift between the backend schema and the consuming code at compile time rather than at runtime.

Image filenames rather than full URLs are stored in the API data. The mobile app composes the full URL using the `imageUrl()` utility, which reads `Config.API_URL` at call time. This keeps the backend free of host assumptions and makes the URL correct on every target environment without any extra configuration.

## React Query

Data fetching is handled exclusively through TanStack Query (`@tanstack/react-query`). The rationale:

- **Caching.** Repeated navigations to the same report do not trigger redundant network requests. The query client is configured with a `staleTime` of 60 seconds and a `gcTime` of 5 minutes.
- **Prefetching.** Tapping a list item prefetches the detail query before the navigation animation finishes, so the detail screen appears with data already available.
- **`placeholderData: keepPreviousData`.** When the search query changes, the previous result set stays visible while the new fetch is in flight. This prevents the skeleton from flashing between every keystroke and keeps the UI stable.

## Search

Search is driven by a query parameter passed to the reports list endpoint. The search term is trimmed before being sent so whitespace-only input is treated as an empty query (no filter applied). The query key includes the search params object, so each distinct search term is cached independently.

## Pull to Refresh

The `isFetching` flag from React Query drives the `RefreshControl` on the list. The skeleton loader is shown only when `isLoading` is true, that is, when there is no cached data at all and a fetch is in progress. Background refetches (pull to refresh, search query change with previous data available) do not interrupt the displayed content.
