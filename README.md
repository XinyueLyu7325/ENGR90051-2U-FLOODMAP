# floodmap

floodmap is a React prototype for a multilingual flood-response mobile flow. It combines a live-style flood map, nearby support locations, alert updates, evacuation routing, and household preparedness screens.

## Features

- Language selection with persisted preference
- Flood map with alert banner, point-of-interest pins, capacity details, and evacuation entry point
- Evacuation route view with ETA, blocked-road warnings, and arrival flow
- Flood simulation controls for rainfall, duration, river flow, and projection time
- Personal preparedness screen with household plan, buddy contact, drills, privacy, and notification settings
- Responsive mobile-first layout with wider desktop framing

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS 4
- Radix UI primitives
- Motion
- Lucide React

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Project Structure

```text
src/
  app/
    App.tsx
    components/
      screens/
      ui/
  styles/
```

## Notes

This project is a front-end prototype. Map geometry, alert data, evacuation routes, and service capacity values are static demo data stored in the application code.
