# Fast Listing Summary

This document captures the fast-listing pattern used by the student reference and the join-applications implementation we built to match it.

## Core Pattern

- A list page loads initial filters on the server.
- The page fetches initial data for the first render.
- A client table component owns the interactive UI.
- URL search params are the source of truth for paging and filters.
- A dedicated parser normalizes raw query params into typed list input.
- A query-key serializer keeps cache keys stable.
- A hook manages cursor paging, prefetching, and filter updates.
- The list renders in both table and grid/card form.
- Filters appear in a slide-over sheet.
- Active filters appear as removable tags.
- Pagination includes first, previous, next, last, and page-size controls.
- The table supports hover prefetch and row navigation to the detail view.

## Join Applications Implementation

### Routing

- Admin list route: `/admin/join-applications`
- Admin detail route: `/admin/join-applications/[applicationId]`
- API route for client fetching: `/api/admin/join-applications`

### Data Source

- The fast list reads from a projection table:
  - `join_application_list_item`
- The projection is synced from application and member mutations.
- This keeps the list denormalized and fast to query.

### Join Application List Fields

- Applicant name
- Email
- Phone number
- Location
- Application type
- Application status
- Consent state
- Program member linkage
- Member role
- Member status
- Member current step
- Search text
- Payload snapshot

### Fast List Behaviors

- Search by applicant text and indexed projection search text.
- Filter by application type.
- Filter by status.
- Cursor pagination.
- Page-size switching.
- Summary counters at the top of the page.
- Table and grid views.
- Row click navigation to detail.
- Hover prefetch for detail pages.
- Filter tags with clear-all support.
- "Last page" navigation with an offset fallback on the projection dataset.

### Shared Table Pieces

Reusable shared table code now lives under:

- `components/shared/table`

Included pieces:

- toolbar
- filter tags
- pagination
- loading skeleton
- column header helper
- column visibility helper
- bulk actions bar
- selection column helper
- CSV and Excel export helpers
- base filter dialog
- base delete dialog

### Client Infrastructure

- React Query provider is mounted in the app shell.
- The list hook uses React Query plus `nuqs` for URL state.
- The API route returns the same data shape used by the client hook.

## Reference Pattern Checklist

- Server page bootstrap
- Input parser
- Query-key serializer
- List hook
- Projection-backed query
- Summary counts
- Search
- Filters
- Cursor pagination
- Page size control
- Table view
- Card/grid view
- Filter sheet
- Filter tags
- Row navigation
- Hover prefetch
- Shared table primitives

## What Was Kept Flexible

- The list is not hard-coded to one business object shape.
- The projection approach can be reused for other admin tables.
- The shared table layer is now available for future fast-list screens.
- The pagination and filter patterns can be copied to new lists with only field-specific changes.

## Notes

- The student reference uses many entity-specific filters such as campus, level, intake, session, and verification flags.
- Those fields do not apply to join applications, so the join-applications list uses the same fast-list structure but with join-specific filters and columns.
- Full repo typecheck still has unrelated legacy errors outside the join-applications fast list.
