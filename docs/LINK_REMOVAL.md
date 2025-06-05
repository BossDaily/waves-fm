# Link Removal System

This system automatically removes unwanted `<a>` tags with specific hrefs from your application. It's designed to prevent unwanted links from appearing in your app, whether they're injected by third-party scripts or added accidentally during development.

## Components

### 1. Client-Side Protection (`linkRemover.ts`)

**Location**: `src/lib/utils/linkRemover.ts`

A TypeScript utility that:
- Monitors the DOM using MutationObserver
- Removes links with the target href immediately when detected
- Runs periodic scans every 5 seconds as a fallback
- Provides start/stop controls

**Usage**:
```ts
import { linkRemover } from '$lib/utils/linkRemover';

// Start monitoring (default target: "https://neat.firecms.co")
linkRemover.start();

// Stop monitoring
linkRemover.stop();

// Change target
linkRemover.setTargetHref("https://example.com");
```

### 2. Debug Component (`LinkGuard.svelte`)

**Location**: `src/lib/components/LinkGuard.svelte`

A Svelte component that provides:
- Visual monitoring of link removal activity
- Manual scan controls
- Start/stop toggles
- Removal statistics

**Props**:
- `targetHref` (string): The href to target (default: "https://neat.firecms.co")
- `checkInterval` (number): Check interval in ms (default: 1000)
- `showLogs` (boolean): Show debug UI (default: false)

### 3. Standalone Script (`remove-links.js`)

**Location**: `scripts/remove-links.js`

A Node.js script for batch processing files:
- Scans HTML, Svelte, Vue, JSX, and TSX files
- Removes links using regex patterns
- Provides summary statistics

**Usage**:
```bash
# Remove default target links
npm run remove-links

# Remove custom target links
npm run remove-links:custom "https://example.com"

# Direct usage
node scripts/remove-links.js "https://example.com"
```

## Current Integration

The system is currently integrated into your app:

1. **Global Protection**: Activated in `+layout.svelte` - runs on all pages
2. **Debug Interface**: Available on `/waves` page - press `L` to toggle
3. **Color Debug**: Press `D` on `/waves` page (existing feature)

## Keyboard Shortcuts

When on the `/waves` page:
- `D` - Toggle color debug panel
- `L` - Toggle link guard debug panel

## Monitoring

The LinkGuard debug panel shows:
- Current status (Active/Inactive)
- Number of links removed
- Target href being monitored
- Manual control buttons

## Customization

To target different hrefs, modify the default in:
- `linkRemover.ts` - Line 8: Change constructor default
- `LinkGuard.svelte` - Line 9: Change component prop default
- `remove-links.js` - Line 9: Change script default

## Performance Notes

- Uses efficient MutationObserver for real-time monitoring
- Periodic fallback scans every 5 seconds
- Debug UI only renders when explicitly enabled
- No performance impact when not debugging

## Security

This system helps protect against:
- Unwanted affiliate links
- Malicious link injection
- Accidental marketing links in development
- Third-party script link pollution
