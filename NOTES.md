Notes

What I completed:
- Car Inventory Grid: Fetches cars using the GetCars GraphQL query and displays them in a clean Material UI grid.
- Responsive Images: Uses HTML5 picture tags to automatically serve the right image for each screen size (Mobile for 639px and below, Tablet for 640px to 1023px, Desktop for 1024px and above).
- UI States: Handled loading state with skeleton placeholders, error state with an alert and Retry button, and empty state with a reset filters button.
- Add Vehicle: Form dialog submitting through the CreateCar mutation with validation for required fields and year boundaries.
- Search and Sort: Debounced search by model name, year filter dropdown, and sorting by Year, Model, or Make.
- Custom Hooks: useCars hook handles Apollo queries and mutations with cache updates. useCarFilters hook manages search, filter, and sort states.
- Full Test Suite: 8 test suites with 29 tests covering all components, hooks, validation rules, and integration tests against the mock API.

Decisions and Trade-offs:
- Bulletproof React Structure: Feature code is organized into api, components, hooks, pages, types, and utils folders for clean separation.
- Native HTML5 Picture Tag: Used native browser media queries for fast, flicker-free responsive image loading.
- Apollo Cache Updates: Used Apollo cache updates and query refetching so newly created cars show up immediately without refreshing the page.
- Client-Side Filtering and Debouncing: Kept search fast and smooth with a 200ms debounce.

What I left out and why:
- Dedicated Detail Page: Focused on making the main inventory list, creation form, and responsive images robust and fully tested first.
- Pagination: For small to medium fleets, client-side list rendering provides faster search and sorting without extra server roundtrips.

If I had another day:
1. Add a vehicle details route with photo gallery and edit/delete actions.
2. Add pagination or virtual scrolling for large inventory datasets.
3. Add a dark and light mode toggle.
4. Add end-to-end tests.

How to run it:
- npm install
- npm run dev (starts Vite dev server on port 3000)
- npm test (runs all 29 tests)
- npm run verify (runs lint, typecheck, tests, and production build)