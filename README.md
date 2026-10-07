# grain. — Food Log (React Web → React Native migration)

Migration of the provided `FoodLog.jsx` React Web component into a React
Native app built with **Expo SDK 57** + **TypeScript** + **expo-router**.

All core scope is implemented: food search, manual entry, per-meal logging,
nutrition totals vs. goals, barcode scanning with the Open Food Facts lookup
flow, NOVA score display, and the added-sugars ingredient scoring — with the
browser-specific APIs replaced by native equivalents.

> The brief notes pixel-perfect UI is not evaluated, so the app applies a
> custom brand identity ("grain." — earthy palette, Fraunces + IBM Plex
> typography, ledger-style layout) rather than replicating the web styles.
> All functional behavior from the source is preserved unless listed under
> **Intentional deviations** below.

---

## Setup

Prerequisites: Node 18+, npm, and the **Expo Go** app on a physical device
(the barcode scanner needs a real camera).

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS). Everything
in this project — including `expo-camera` — runs in **Expo Go**; no dev build
is required. If a native module outside Expo Go's runtime were needed (e.g.
ML Kit for photo food recognition), the approach would be an EAS development
build (`npx expo run:android` / EAS Build), noted here per the brief.

Useful test barcode: `3017620422003` (Nutella — reliable Open Food Facts hit,
NOVA 4, early added sugars).

---

## Folder structure

```
src/
  app/                       # expo-router screens (routing layer only)
    _layout.tsx              #   root Stack + font loading + FoodLogProvider
    index.tsx                #   "Today's plate" — the food log screen
    scan.tsx                 #   fullscreen-modal barcode scanner
  features/food-log/         # the migrated feature
    types.ts                 #   domain types (Food, Meals, ScannedProduct…)
    constants.ts             #   FOOD_DB, NOVA_INFO, ADDED_SUGARS, meals
    scoring.ts               #   scoreIngredients — ported verbatim from web
    nutrition.ts             #   totals reducer, search filter (pure logic)
    context.tsx              #   FoodLogProvider (shared state across routes)
    hooks/useFoodLog.ts      #   all feature state + actions
    components/              #   presentational pieces
      CalorieDial.tsx        #   SVG daily dial
      MacroJars.tsx          #   protein/carbs/fat fill jars
      MealSection.tsx        #   ledger-style meal card
      FoodPicker.tsx         #   search / category chips / manual entry
      ScannedProductModal.tsx#   post-scan confirmation popup
      OverGoalBanner.tsx     #   pinned alert when any goal is exceeded
      Card.tsx               #   design-system card stand-in
  services/
    openFoodFacts.ts         #   OFF API client (the only file that knows it)
  theme.ts                   #   brand tokens, fonts, status-color logic
```

Rationale: screens route, the hook owns state, pure logic and the API client
are isolated and unit-testable. See `ENGINEERING.md` for the full discussion.

## Libraries used

| Library | Why |
|---|---|
| `expo-camera` | Replaces `getUserMedia` + `<video>` + `window.BarcodeDetector` (camera preview, permissions, native barcode detection). Works in Expo Go. |
| `expo-router` | File-based navigation; the scanner is a `fullScreenModal` route (replaces the web `position: fixed` overlay). |
| `react-native-svg` | The brand's calorie dial needs a real arc (dasharray/dashoffset). Added only when the design required it. |
| `expo-font` + `@expo-google-fonts/{fraunces,ibm-plex-sans,ibm-plex-mono}` | Brand typography, loaded before first render (splash held). |
| `react-native-safe-area-context` | Notch/status-bar safe layout (ships with the template). |

## Assumptions (documented per the brief)

- **Category filter**: the web source held `catFilt` state but its trimmed
  JSX never rendered a control for it — assumed it was meant to be
  user-facing and surfaced it as filter chips.
- **`isPremium` / `onUpgrade` props**: unused in the provided source render;
  not carried over. `macroGoals` is supported by the hook (defaults to the
  source's 2000/150/225/65).
- **Scanned nutrition is per-100g** (that's what OFF's `*_100g` fields mean);
  the modal labels it "PER 100G" — the web source added the values silently.
- **Meal names are fixed** (Breakfast/Lunch/Dinner/Snacks), same as source.

## Intentional deviations from the web source (improvements)

- **One-tap scan confirm**: scanning from inside a meal section asks
  "✓ Add to Breakfast" instead of making the user re-choose the meal; a
  header quick-scan button keeps the original four-meal chooser.
- **Scan result is a popup modal**, not content injected above the page.
- **Explicit scanner state machine** (`scanning / looking-up / not-found /
  network-error`) with a "Scan again" action, instead of the web's message
  string + `setTimeout` resets.
- **`uid` fix**: web used `Date.now()` as the food uid — two adds in the same
  millisecond collide and `removeFood` deletes both. Now uid = timestamp +
  random suffix.
- **Pinned over-goal alert** banner (new UX, derived from existing state).

## Skipped stretch scope (with reasoning)

- **R6 — photo food identification**: skipped. It is flagged secondary, and
  it depends on Nutritionix credentials that must not be embedded in the app
  (R4). The credential-handling approach is written up in `ENGINEERING.md`
  (env var + build-time injection at minimum; a proxied Edge Function as the
  real fix). No part of `x-app-id`/`x-app-key` was copied into this project.
- **R7 — sugar report / Nutri-Score badge row**: partially covered — the
  early-added-sugars warning ships (it's core scoring); the Nutri-Score badge
  row was deprioritized for time. The API client already fetches
  `nutriscore_grade` and total sugars, so the row is a small component away.

## Known limitations

- **No persistence** — the log resets on app reload (source behaved the same;
  production plan in `ENGINEERING.md`).
- **No date/history concept** — "today" only, like the source.
- `FOOD_DB` has the 5 sample entries from the brief (production has 200+ —
  at that size the search list should become a `FlatList` with debounced
  input).
- No automated tests are included in the time box; the testing strategy is in
  `ENGINEERING.md`.
- Tested on a physical Android device via Expo Go; iOS is expected to work
  (all libraries are cross-platform) but was not device-tested.

## Other docs

- `ENGINEERING.md` — answers to the engineering questions (incl. R4).
- `CODE_REVIEW.md` — Task 2 review.
- `NOTES.md` — plain-language summary of how the build went.