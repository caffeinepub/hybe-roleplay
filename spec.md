# Hybe Roleplay

## Current State
Dashboard has 6 main panels (Creators, Audition, Elements, Events, Channel, Highlights) with a GreetingCarousel above them and a header with an Admin button.

## Requested Changes (Diff)

### Add
- A `GamesPanel` component: displays all games in a list of curved, frosted glass cards with subtle white glow. Each card shows thumbnail + name. Tapping the thumbnail opens the attached link. Empty placeholder when no games exist. Admin controls (PIN `hybe2024`) to add/edit/delete games (thumbnail upload, name, link).
- A "Games" button in the Dashboard, positioned above the hero text and panels but below the header. Styled curved, frosted glass with subtle white glow. Clicking it opens the GamesPanel overlay.

### Modify
- Dashboard: add Games button between the header and hero text sections.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/components/GamesPanel.tsx` with:
   - Local state for games list (stored in localStorage for persistence)
   - Games list view: curved frosted glass cards, thumbnail + name, tap thumbnail opens link in new tab
   - Empty state: cinematic "no games yet" placeholder
   - Admin section (PIN `hybe2024`): add/edit/delete games; each game has thumbnail (image upload), name, link
   - Styling: curved borders, frosted glass backdrop, subtle white glow (box-shadow with white)
   - Back button to return to dashboard
2. Update `Dashboard.tsx`: add `showGames` state, a curved frosted glass "Games" button between header and hero text, render GamesPanel when active.
