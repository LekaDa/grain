# ENGINEERING.md

Answers to the engineering questions about the migrated Food Log app.
The code review is in `CODE_REVIEW.md`;

---

## 1. Architecture

```
src/app/                 → screens (routing only, expo-router)
src/features/food-log/
  types / constants / scoring / nutrition   → pure domain logic
  hooks/useFoodLog + context                → feature state
  components/                               → UI pieces
src/services/            → API clients (Open Food Facts)
src/theme.ts             → design tokens + fonts
```

The original `FoodLog.jsx` is one ~300-line component mixing state, logic,
browser APIs, and markup. I split it into layers:

- **Pure logic** (`scoring.ts`, `nutrition.ts`): nothing platform-specific,
  ported verbatim, unit-testable in isolation.
- **Service layer** (`openFoodFacts.ts`): the only file that knows the OFF
  API. Throws a typed `ProductNotFoundError` so the UI can tell "not found"
  from "network error".
- **One state hook** (`useFoodLog`) shared via React context above the
  navigator — the scanner is a separate modal route and needs to write into
  the same state the log screen reads. No Redux/Zustand needed at this size.
- **Thin screens**: `index.tsx` and `scan.tsx` just compose components.

This paid off: the scanner, the scan-target UX, and a full rebrand each
landed without refactoring — the rebrand touched essentially one file
(`theme.ts`) because components use semantic tokens, not hex values.

## 2. Browser API migration

| Web API | RN replacement |
|---|---|
| `getUserMedia({ facingMode: "environment" })` | `expo-camera`: `<CameraView facing="back" />` + `useCameraPermissions()` |
| `<video>` + `srcObject` + `.play()` | `CameraView` renders its own native preview |
| `window.BarcodeDetector` + 500ms polling | `onBarcodeScanned` callback — native, no polling, no browser-support fallback needed |
| Barcode formats `ean_13, ean_8, upc_a, upc_e, code_128` | Same five, expo naming: `ean13, ean8, upc_a, upc_e, code128` |
| Manual `stream.getTracks().stop()` cleanup | Scanner is a modal route; camera is released on unmount |
| `position: fixed` fullscreen overlay | `fullScreenModal` route via expo-router |
| `File` / `<input type="file">` (R6 photo flow) | Would be `expo-image-picker`; R6 skipped (see Trade-offs) |
| `fetch` | Kept — RN ships fetch |

## 3. Key technical decisions

1. **Scanner as a modal route** — fullscreen takeover, native back gesture,
   automatic camera teardown, and `/scan?meal=Breakfast` deep-linking free.
2. **Permission flow in `useEffect`, never during render** (render-time
   requests loop), with three UI states: pending (spinner), denied but
   askable (rationale + button), permanently denied (open Settings).
3. **Ref lock against duplicate scans** — `onBarcodeScanned` fires many
   times per second; state can't gate it (fires again before re-render), a
   ref blocks synchronously. Detection also paused via
   `onBarcodeScanned={undefined}` while looking up.
4. **Explicit scanner state machine** (`scanning | looking-up | not-found |
   network-error`) instead of the web's message string + `setTimeout`
   resets — each state has its own UI and a user-controlled exit.
5. **Fixed a source bug**: `uid: Date.now()` collides for same-millisecond
   adds (remove then deletes both rows). Now timestamp + random suffix.
6. **Semantic theme tokens** instead of hex in components — proven when the
   rebrand became a one-file change.

### R4 — hardcoded API credentials (Must)

No part of the Nutritionix keys was copied into this project (the R6 feature
using them was skipped). The approach if the feature were built:

- **Minimum — env var + build-time injection**: keys in a git-ignored `.env`
  / EAS Secrets, injected via `app.config.ts` → `expo-constants`. Keeps
  secrets out of the repo, **but** anything bundled into an app binary is
  extractable — not enough for a paid API.
- **Real fix — proxied Edge Function**: a small server endpoint holds the
  keys; the app calls it with the user's own session token.

```
App ──(user JWT)──▶ Edge Function /food-search ──(x-app-id/x-app-key)──▶ Nutritionix
                      validate session · rate-limit · cache · trim response
```

  This allows key rotation without an app release, per-user rate limiting,
  and caching.
- Also: keys that were ever committed are burned — rotate them, and add
  secret scanning (gitleaks) to CI.

## 4. Trade-offs

- **R6 photo identification — dropped.** Secondary scope + the credential
  problem above. (The source doesn't do real image recognition anyway — it
  queries by *filename*.)
- **R7 Nutri-Score row — deprioritized**, but the data is already fetched
  and typed; it's one small component away. The added-sugars warning (core)
  did ship.
- **No persistence** — matches the source; production fix below.
- **ScrollView, not FlatList** — four fixed meal sections with small lists;
  virtualization buys nothing here. Would flip for a 200+ item list.
- **Context, not a state library** — one feature, one provider.
- **SVG added only when needed** — avoided at first (decorative ring), added
  when the brand's dial genuinely required an arc.

## 5. Third-party libraries

| Library | Why |
|---|---|
| `expo-camera` | Camera + permissions + native barcode detection; works in Expo Go (vision-camera would need a dev build — unjustified here) |
| `expo-router` | File-based navigation; easy modal presentation, typed routes |
| `react-native-svg` | The calorie dial's arc (dasharray/dashoffset) |
| `expo-font` + `@expo-google-fonts/*` | Brand fonts, loaded before first render |
| `react-native-safe-area-context` | Safe-area handling (from template) |

Deliberately not added: state managers, form libs, UI kits, axios.

## 6. Production readiness (shipping next week)

1. **Persistence** (AsyncStorage behind the hook; SQLite if history comes)
   plus a per-day date model.
2. **Resilience**: timeouts + retry on the OFF client, offline detection,
   cached lookups.
3. **Error reporting** (Sentry) + basic analytics.
4. **Tests in CI** (below).
5. **Accessibility audit**: focus order, contrast, dynamic type.
6. **Store readiness**: EAS profiles, icons/splash, permission strings.
7. **Data correctness**: serving-size picker (values are per-100g), input
   clamping on manual entry.
8. **Performance**: debounced search, FlatList for the 200+ food DB.

## 7. Testing

**Manual (done, on a physical Android device):** add/remove via search and
manual entry, totals + dial + jars update, over-goal banner; scan happy path
(Nutella `3017620422003` → NOVA 4 + sugar warning), not-found, airplane-mode
error, permission denied → Settings, cancel, re-scan.

**Automated (plan):**

- **Unit (Jest)**: `scoreIngredients` (early vs. late sugars, edge cases),
  totals reducer, search filter, OFF client with mocked fetch (found /
  not-found / HTTP error → correct typed errors).
- **Component (RN Testing Library)**: `useFoodLog` flows, modal confirm vs.
  chooser variants, banner appears only when over goal.
- **E2E (Maestro)**: add → totals change → remove → scan with a mocked OFF
  response. Real camera stays a manual device test.

## 8. Reflection — with one more week

1. Persistence + dates (history view).
2. R6 built properly: image capture through the Edge Function proxy.
3. R7 Nutri-Score row + serving-size selector.
4. Test suite + CI.
5. Polish: scan haptic, scan-line animation, list animations.
6. Extract `scoring`/`nutrition`/OFF client into a shared package so web and
   native use the same logic.
