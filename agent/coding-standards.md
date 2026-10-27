# Coding Standards

Frontend conventions. The domain rules live in `agent/features/*.md`; this file
is about how code is written.

## The backend owns the math

The settlement forms are the reference: they send inputs (boxes, price,
expenses), ask a quote endpoint for the amounts through `usePaymentQuote`, and
show what comes back read-only. The price per box they start with is the one
the backend proposes.

- **Do not add a new calculation to the client.** A figure the backend does not
  return is a backend change, not a `useMemo`.
- Client-side derivations are limited to presentation: formatting, and summing
  values that are already final (a table footer, a selection total).
- A form that has to show an amount before saving asks the backend for it and
  disables its submit button until the figure on screen answers the current
  inputs (`isSettled`). It never sends a computed amount in the body.
- Business rules (stock limits, eligibility, validation that decides whether
  something can be saved) belong to the backend. A Yup schema may check the same
  rule for immediate feedback; the backend is the one that enforces it.
- Prices, rates and other configuration constants come from the API. Do not add
  another hardcoded one.

## One implementation per formula

- A formula lives in one function, in `utils/`. If the same calculation appears
  in two components, extract it before adding the third.
- The dashboard aggregates (boxes per day, totals per farm, producer vs. client
  totals) are computed inline in components today. Extract before reusing.

## Data fetching: react-query v3

- One hook per endpoint, in `hooks/<dominio>/` (`getX`, `createX`, `updateX`,
  `uploadX`). The file exports the plain request function and the `useX` hook.
- All requests go through the shared instance in `lib/axios.ts`. Do not call
  `fetch` with a hand-built `Authorization` header from a client component.
- List hooks return through `serializeQueryResult`, so `data` is already the
  response body, not the Axios response.
- **The live `QueryClient` is the one created in `components/Providers.tsx`**,
  with `staleTime: Infinity` and no automatic refetch. Nothing refreshes by
  itself: every mutation must invalidate the keys it affects (a key invalidated
  while its page is closed loads again when the page opens), including the
  `…Pending` lists that feed the sidebar badges. The `queryClient` exported from
  `lib/react-query.ts` is not mounted — get the client with `useQueryClient()`.
- The backend answers **200 with `[]` for an empty list**. Do not catch a 404
  in a list hook to return `[]`: it hides a mistyped route, which is how two
  hooks pointed at endpoints that never existed.
- The lists that grow with every shipment are paged and searched by the
  backend: exports, supply shipments, cutting sheets, producer payments and
  client payments. Their hooks use `usePagedList(key, url)`, which sends
  `page`, `pageSize` and `search`, reads `{ items, total }` and hands the table
  the options it needs (`...tableOptions` in `useMaterialReactTable`). Those
  tables do not sort: sorting one page in the browser would hide the rest. Do
  not look a row up in a paged list; ask for it by id.
- Every other list comes whole from the backend, which ignores `search`,
  `page` and `limit`; those tables paginate and filter in the browser.
- `usePagination()` returns a new `paginationParams` object on every render.
  Never list it as an effect dependency: an effect that invalidates a query on
  it refetches in a loop.

## Mutations

- Expose `mutation.mutateAsync` when the caller `await`s the mutation. `mutate`
  is fire-and-forget: it returns nothing and never throws, so a `try/catch`
  around it never runs.
- `mutation.mutate` is fine when the caller handles the outcome through
  `onSuccess` / `onError`.
- Error bodies arrive as `ServerErrorResponse` (`types/errorResponse.ts`). For a
  400 the readable detail is in `errors`, and `message` is a fixed generic
  string; for every other status the detail is in `message`. Show the one that
  carries the text: `serverErrorMessage(error)` (`utils/`) picks it.
- An error toast says what failed in its title (`No se pudo guardar`, `Error
  al importar`), never a status code, and carries `serverErrorMessage(error)`
  as its description.
- A request that never got an answer has no `error.response`: read it with
  `?.` (`error.response?.status`). Destructuring it crashes the handler and
  the user sees nothing.
- On a `401`, send the user to `/api/auth/signout`.

## Forms

- Formik + Yup. The schema and the initial values live next to the form, in
  `components/<dominio>/schemas/` when they are shared.
- Reuse the field components in `components/ui/form/` (`InputFieldText`,
  `InputFieldNumber`, `InputFieldDayDate`, `InputFieldSelector`, …) and the
  `SelectX` / `XSelectBase` pairs of each domain instead of wiring a new input.
- Submit logic that is more than a single call goes in a `useSubmitX` hook under
  `components/<dominio>/hooks/`.
- A field never resets itself on mount: a form can arrive prefilled (edit,
  duplicate, a copied box brand). An N/A switch acts only when it flips, through
  `useBanChange` (`components/ui/form/`).
- A required select with a single option picks it (`BusinessSelectBase`,
  `BoxBrandSelectBase` do).
- A long form renders `<UnsavedChangesGuard isDirty={dirty && !isSubmitting} />`
  inside its `<Form>`. Formik's `dirty` alone is not enough: some forms change
  their own values on mount, so the guard also waits for a user edit.
- The "He revisado los datos" checkbox is kept only on the steps that move
  stock or money: supply shipment, cutting sheet, validated costs, producer and
  client payments, stock adjustment and initial stock. Catalog and export forms
  do not ask for it.

## Pages

- `app/dashboard/**/page.tsx` is a thin client component that renders one
  component from `components/` and is exported wrapped in `IsOnboarding(...)`.
- A new section needs its entry in `components/ui/sidenav/navMenus.ts` and, if
  it is a new top-level group, in `SideNavItems.ts` with its `allowedRoles`.
- A catalog that is set up once becomes a tab of an existing entry
  (`LOGISTICS_TABS`, `QUALITY_CATALOG_TABS`, rendered by `SectionTabs`), not a
  new menu row. The entry lists every route it covers in `match`.
- The backend decides who writes: a role outside an area gets a 403 whose
  message names the area, and `serverErrorMessage` shows it. The web only hides
  what a role cannot do, with the same split: the menu through `allowedRoles`,
  a step's action through `seesQueue` (`utils/workQueueAccess.ts`). An action
  shown outside the menu (the export page, *Lo que falta*) goes through it.

## UI

- Chakra UI is the base. MUI is present only as the engine of Material React
  Table, bridged through `THEME_ID` in `Providers.tsx`. Do not build layout with
  MUI components. Date inputs are `InputFieldDayDate` and
  `InputFieldDayDateTime` (`components/ui/form/`), typed as `DD/MM/AAAA`.
- Tables use Material React Table, always with `localization:
  MRT_Localization_ES`.
- Text on screen is in sentence case: titles, menu entries, breadcrumbs, column
  headers, labels, buttons and toasts capitalize only the first word and proper
  names (*Agregar cuenta bancaria*, *Código Agrocalidad*). Acronyms stay as
  they are (RUC, AUCP, DAE, SPOT). A value that is stored or sent to the
  backend keeps its exact text, even when it is also shown.
- A `chakra-react-select` on a page rendered on the server (the onboarding)
  takes `instanceId={name}`: react-select numbers its instances with a
  counter, and the ids would not match when the page hydrates.
- The page header keeps its actions on the title's row, also on a phone, where
  the list pages turn them into icon buttons (`PageHeader`).
- A screen that waits, finds nothing or fails uses `LoadingState`,
  `EmptyState` and `ErrorState` (`components/ui/states/`). `ErrorState` shows
  `serverErrorMessage` and a *Reintentar* button wired to the query's
  `refetch`; a raw status code or an English message never reaches the user.
  `serverErrorMessage` already turns a request without an answer, a timeout
  and Nest's default 500 into Spanish.
- Chakra UI v3, with the brand system in `theme/system.ts` (values from
  `design-system.md`). Use the semantic tokens — `bg.canvas`, `bg.panel`,
  `bg.subtle`, `fg`, `fg.muted`, `fg.heading`, `border`, `green.solid`,
  `green.fg`, `green.subtle` — and the radii `l1`/`l2`/`l3`. They already
  switch with the color mode: do not reach for `useColorModeValue`, a
  `_dark` override or a hex literal when a token exists. A value the system
  lacks goes to `design-system.md` first.
- Draw a border with `borderWidth` (and `borderColor` if it is not the
  default). The `border='1px solid'` shorthand resets the color to the text
  color.
- Chakra runs with `disableLayers` (`theme/system.ts`): server-rendered styles
  could land ahead of the layer order and lose to the reset. Global CSS
  (`app/globals.css`) targets tags only, so any component class beats it.
- v3 components are compound: `Field.Root` with `Field.Label` and
  `Field.ErrorText`, `Dialog.*`, `Menu.*`, `Tabs.*`, `NativeSelect.*`. A
  label or error text outside a `Field.Root` uses `FormLabel`,
  `FormErrorText` or `FormHelperText` (`components/ui/form/FormLabel.tsx`);
  a `Field` part without its root throws at runtime.
- An input with an adornment uses `InputGroup` with `startElement` /
  `endElement` around a single input. A link styled as a button or a Chakra
  `Link` uses `asChild` with Next's `Link` inside, carrying the `href`.
- Toasts go through `toaster.create({ type, title, description })`
  (`components/ui/toaster.tsx`), not a hook. `useDisclosure` returns `open`;
  the props are `colorPalette`, `loading` and `disabled`.
- A page is a `PageLayout` (a list: its card goes inside) or a `CardPage` (a
  form or a detail: the content goes in one card), from
  `components/ui/page/PageLayout.tsx`. They draw the header and the width:
  `narrow` for a form, `wide` for anything with a table. A list's table goes
  straight into its card: the page title already names it. A page does not build
  its own wrapper or set `minH='100vh'`: the scroll area under the app bar is
  shorter than the viewport, so the page would always scroll.
- UI copy is in Spanish and addresses the user as *tú*: "Selecciona la
  finca", not "Seleccione". A validation message talks about the field
  ("Debe ser mayor que 0") or tells the user what to do ("Selecciona al
  menos un puerto"). A submit button says what it does ("Crear finca",
  "Registrar pago"), never "Enviar".
- A form section opens with `FormSectionTitle` (`FormSubsectionTitle` below
  it), and the submit goes in `FormActions` (`components/ui/form/FormSection.tsx`),
  which stays in view at the bottom of a long form. The review checkbox goes in
  its `start`. Do not draw a section with a `Heading` and a `Separator`.
- A chart takes its series colors from `CHART_SERIES`
  (`theme/chartColors.ts`), in order, and styles recharts' axes, grid and
  legend with tokens through CSS on its classes (`fg.muted`, `border`). A new
  series color is checked with the palette validator in both modes and added
  to `design-system.md` first.
- Material React Table follows the color mode through `brandMuiTheme`
  (`theme/muiTheme/`): table colors change there, not per table.
- Read-only data in a detail goes in `DetailFields` with one `DetailField`
  per value (`components/ui/DetailFields.tsx`, on Chakra's `DataList`): the
  label small above the value, in as many columns as fit, and "—" when the
  value is empty. A group inside a section opens with `DetailSubtitle`, and
  each of several records (a farm, a contact, an account) goes in a
  `DetailItem`. Not `<strong>Label:</strong> value`.
- A row's detail panel wraps its content in `TableDetailPanel`
  (`components/ui/`): it stays as wide as the visible table while the table
  scrolls sideways (`cqw` against the table container). Its background and
  padding come from `brandMuiTheme`: do not set `muiDetailPanelProps`, and do
  not pass a pixel width down to a table or a detail. A nested table uses
  `layoutMode: 'grid'` so its columns fill the panel.
- A list of pending items is a `PendingTable` (`components/ui/`): sortable,
  searchable, with its action column pinned right so it stays in view on a
  phone. A pending item that asks before opening uses `OpenWithConfirmation`.
  Acting on several rows at once goes through `BatchActionBar`: it confirms in
  a modal, sends only the ids, reports which rows failed and why, and keeps
  those selected.

## Dates

- Every date a user sees is `DD/MM/AAAA`, zero-padded. A native
  `<input type="date">` follows the browser language and
  `toLocaleDateString()` drops the zeros: neither is used. A date field uses
  `InputFieldDayDate`, and a date shown in a table or a detail goes through
  `formatDayMonthYear` (`utils/dayMonthYear.ts`), or `formatDayMonthYearTime`
  with its time.
- A date field holds **local midnight as an ISO string**: `InputFieldDayDate`
  builds the date with `parseDayMonthYear`. Build dates through it; a bare
  `new Date('2025-06-02')` is UTC midnight and lands on the previous day in
  Ecuador.
- A date with a time (the export's cut-off) uses `InputFieldDayDateTime`:
  `DD/MM/AAAA` plus `HH:mm`, held as the ISO string of that moment in local
  time, and shown with `formatDayMonthYearTime`. A native `datetime-local`
  input is not used: its wrapper shifted the hour.
- While a day is half typed, `InputFieldDayDate` and `InputFieldDayDateTime`
  hold the marker `INVALID_DAY_DATE`, not a date. Anything derived from the
  field (the export's week and its grid) waits for a complete one.
- The week of an export comes from `getWeekInfo()` (`utils/getWeekInfo.ts`):
  ISO week, Monday to Sunday.

## TypeScript

- Path alias `@/*` → `src/*`. Prefer it over long relative imports.
- Response and entity types live in `types/`, one folder or file per domain.
- `no-explicit-any` and missing return types are lint warnings. Do not add a
  file-level `eslint-disable` to silence them in new files.

## Secrets and logging

- Never commit an `.env*` file or a secret. `NEXTAUTH_SECRET` comes from the
  environment, never from a literal.
- No `console.log` in new code. Never log the session, a token or a response
  that contains them.
- A browser error worth knowing about goes through `reportClientError`
  (`lib/error-reporter.ts`), which is what makes it visible in Vercel. The one
  `console.error` in the codebase is the server route that writes those lines.

## Comments

- **Write comments in English**, regardless of the language used in docs.
- Write the **minimum** number of comments. Default to none.
- Never describe _what_ the code does or narrate its steps — the code says it.
- Comment only a non-obvious **why**: a decision, a workaround, an external
  constraint, or something easy to break by accident.
- Prefer a clear name over a comment. When in doubt, no comment.

## Testing

- Vitest, files named `*.spec.ts` next to what they test. Import `describe`,
  `it` and `expect` from `vitest`: there are no globals.
- What is covered today is pure helpers in `utils/`. A new pure helper, or a
  function that builds a request body, ships with its spec.
- Expected values are calculated by hand, never pasted from a run. A test name
  is a sentence in Spanish that states the rule.
- Components have no unit tests. Screens have a smoke test: `npm run smoke`
  (Playwright, `smoke/`) signs in and opens every page of `app/dashboard/`
  without a dynamic segment, against a running web and backend. A page fails
  if it throws, logs an error to the console, gets a 4xx or 5xx from a data
  request or shows the error boundary. A new page is covered without touching
  it; a page that needs an id in the URL is not.
- The smoke test proves a screen opens, not that its flow works. For a change
  in a screen, run it and say how the flow was exercised.

## Agent documentation

- `agent/features/*.md` and `agent/project-overview.md` — **Spanish**. They
  describe how a module works _today_: models, rules, formulas, file map. Never
  a changelog: no "antes de esto…", no "se corrigió", no references to a PR or a
  past bug.
- `coding-standards.md` — **English**.
- Cross-cutting rules about _how code must be written_ belong here, not in a
  feature doc. If a rule applies to more than one module, it goes here.
- This repository is public. Docs describe the web client; they do not list
  weaknesses of the backend.
