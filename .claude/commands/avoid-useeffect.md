# Avoid useEffect — Refactoring Skill

Eliminate unnecessary `useEffect` by pushing logic to where it belongs:
event handlers, render-time derivations, or injected callbacks. Keep only
effects that genuinely synchronize with external systems.

---

## Decision tree — what to do with each useEffect

```
Is this effect reacting to a user event?
  YES → move logic into the event handler directly (cascade)

Is this effect computing/transforming state from other state?
  YES → derive it at render time (useMemo or inline const)

Is this effect notifying a parent when internal state changes?
  YES → replace with an injected callback called at the mutation site

Is this effect synchronizing with a truly external system
  (subscriptions, timers, DOM APIs, native device APIs)?
  YES → keep it, but only for cleanup (return () => teardown())

Does nothing apply?
  KEEP the effect — it's legitimate
```

---

## Pattern 1 — Cascade (replace effect-on-event)

**Before**: effect watches state, then calls a function

```ts
useEffect(() => {
  if (isCompleted && status === "idle") {
    handleCheckIn()
  }
}, [isCompleted, handleCheckIn, status])
```

**After**: inject a callback, call it at the mutation site

```ts
// hook accepts callback option
interface Options {
  onHoldComplete?: () => void
}

// inside the hook, where isCompleted is set:
setIsCompleted(true)
options?.onHoldComplete?.() // ← called in-place, no effect needed

// consumer passes it in:
useCheckInAnimations({
  onHoldComplete: () => {
    if (checkInStatus === "idle") handleCheckIn()
  },
})
```

**Rule**: if an effect fires because of a user action, the action handler
is the right place. Effects add a render-cycle delay and create stale
closure risk.

---

## Pattern 2 — Derive at render time (replace effect-on-state-sync)

**Before**: effect updates state B whenever state A changes

```ts
const [total, setTotal] = useState(0)
useEffect(() => {
  setTotal(items.reduce((sum, i) => sum + i.price, 0))
}, [items])
```

**After**: compute inline — no extra render, no effect

```ts
const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items])
```

Use plain `const` when no memoization is needed. Use `useMemo` for
expensive calculations or to preserve referential stability.

---

## Pattern 3 — Merge hooks, use ref for sync reads

When merging two hooks (e.g. `useCurrentLocation` into `useCheckIn`),
location state causes stale closures inside `useCallback`. Fix with a ref:

```ts
// inside the merged hook
const locationRef = useRef<Coords | null>(null)
const [location, setLocation] = useState<Coords | null>(null)

// watcher writes both — ref for sync reads, state for UI
subscriberRef.current = await Location.watchPositionAsync(opts, (pos) => {
  const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
  locationRef.current = coords // always fresh, no closure issues
  setLocation(coords) // triggers re-render for UI consumers
})

// callback reads ref, not state — never stale
const handleAction = useCallback(async () => {
  const loc = locationRef.current // ← sync, always current
  if (!loc) {
    await enableLocation()
    return
  }
  // ...use loc
}, [enableLocation]) // no 'location' in deps array needed
```

**Why**: `useCallback` memoizes over a dependency array. If `location`
(state) is in that array, the callback re-creates on every GPS update.
`locationRef.current` reads the latest value without being a dependency.

---

## Pattern 4 — Notify parent via callback prop (not effect)

**Before**: effect watches internal state and calls a parent function

```ts
useEffect(() => {
  if (status === "success") {
    startLeaderboardAnimation()
  }
}, [status, startLeaderboardAnimation])
```

**After**: accept callback as an option; call it at the mutation site

```ts
// hook signature
interface UseCheckInOptions {
  onSuccess?: () => void
}

// inside handleCheckIn, at success:
setCheckInStatus("success")
options?.onSuccess?.() // ← immediate, in the same callstack

// consumer:
const { handleCheckIn } = useCheckIn({
  onSuccess: () => startLeaderboardAnimation(),
})
```

---

## The one useEffect that IS correct to keep

Cleanup-only effects for external subscriptions are legitimate:

```ts
useEffect(() => {
  return () => {
    subscriberRef.current?.remove()
    subscriberRef.current = null
  }
}, [])
```

This is the **only** acceptable empty-dep-array pattern for synchronizing
with external systems. Keep it. Everything else should be migrated.

---

## Checklist when reviewing a file

- [ ] Every `useEffect` with state in deps that _derives_ another state → `useMemo`
- [ ] Every `useEffect` that calls a function _because a user did something_ → move into handler
- [ ] Every `useEffect` that notifies a parent → inject callback, call at mutation site
- [ ] Every `useCallback` that reads state inside it → check if a `useRef` mirror is needed
- [ ] Are two hooks doing related work? → consider merging; expose location/state directly
- [ ] After refactor: does the consumer (component) have zero `useEffect` calls? ✓

---

## Output format

When performing a refactor, produce:

1. **Analysis** — list each `useEffect` found, classify it (cascade / derive /
   notify-parent / legitimate), state the replacement pattern
2. **Refactored hook** — complete file, no omissions
3. **Updated consumer** — show the component with zero effects and the new
   callback wiring
4. **What was kept** — explicitly call out any effects intentionally preserved
   and why

Do not leave `// TODO` comments. Deliver production-ready code.
