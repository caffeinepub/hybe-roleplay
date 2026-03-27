# Hybe Roleplay

## Current State
The app uses localStorage for all data: audition responses, vacancy/group state, and rules. This means:
- Responses submitted by users are only visible in the submitter's browser -- admins on other devices cannot see them.
- Vacancy changes made by admins are not visible to other users/friends.
- The Elements panel is currently one of five main panels on the homescreen.

## Requested Changes (Diff)

### Add
- Motoko backend APIs for:
  - Submitting audition responses (stored centrally)
  - Fetching all audition responses (admin)
  - Deleting a response by ID (admin)
  - Storing and fetching vacancy groups/members state
  - Storing and fetching audition rules (admin-editable)

### Modify
- AuditionFlow.tsx: replace localStorage reads/writes for responses, vacancy groups, and rules with backend actor calls
- PanelView.tsx / Dashboard.tsx: remove Elements panel from the panel list

### Remove
- Elements panel from the main homescreen panel list
- ElementsPanel.tsx references from the panel router/view

## Implementation Plan
1. Generate Motoko backend with: submitResponse, getResponses, deleteResponse, setGroups, getGroups, setRules, getRules
2. Update AuditionFlow.tsx to call backend for responses, vacancy groups, and rules (keep localStorage only as cache fallback)
3. Remove Elements from the panels array in PanelView.tsx and Dashboard.tsx
4. Validate and deploy
