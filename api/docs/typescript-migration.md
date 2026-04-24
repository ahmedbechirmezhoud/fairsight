# Backend Refactoring & TypeScript Migration

## Context

The primary goal of this project is the mobile application. The API exists solely to support the mobile evaluation; it is a mock server that provides realistic data and a functional AI chat endpoint. Complexity in the backend is therefore a cost with no corresponding benefit. Every decision in the API codebase is made with that constraint in mind: do the minimum needed to make the mobile experience work correctly.

## Why TypeScript

The original JavaScript implementation was replaced with TypeScript for two reasons.

First, consistency: the mobile codebase is fully TypeScript with strict mode enabled. Having the API in plain JavaScript meant that shared concepts, report shape, issue structure, conversation state, existed in two places with no shared contract. TypeScript makes the API's data shapes explicit and comparable to the mobile types.

Second, correctness at the boundaries: the API handles request validation (Zod), in-memory state, and AI SDK interactions. TypeScript catches category errors at compile time that would otherwise surface as runtime failures; wrong property names, missing fields, incorrect argument types to the `ai` SDK.

## Migration Approach

The migration was done in a single pass rather than incrementally. The codebase is small enough that a gradual migration would have produced a confusing half-typed state longer than a clean cut-over.

`tsx` is used as the TypeScript runner. This means there is no compilation step in development; `npm start` runs `tsx server.ts` directly. The TypeScript compiler is only invoked for type checking (`tsc --noEmit`). This keeps the development loop identical to what it was with plain Node.js while adding full type safety.

## Type Definitions

All domain types are centralised in `types/index.ts`. The types describe the shape of the in-memory data store as well as the API request and response contracts. Zod schemas are used at the HTTP boundary for request validation; `z.infer<typeof schema>` derives the TypeScript type from the schema so the two cannot drift apart.

## Structure

The structure was kept flat and direct:

- `config.ts`: environment variable loading and validation at startup.
- `data/reports.ts`: the in-memory dataset with typed accessors.
- `store/memory.ts`: in-memory conversation state.
- `services/`: AI streaming and system prompt construction.
- `middleware/`: request validation and error handling.
- `routes/`: Express routers, one file per resource.

No framework abstractions, no dependency injection, no repository pattern. The simplest shape that makes the code navigable and type-safe.
