import type { ClipResponse, SentryEvent } from '@/types';

// Mock events representing sample Tesla Sentry clips
export const MOCK_EVENTS: string[] = [
    '2024-03-15_14-30-22',
    '2024-03-14_09-15-45',
    '2024-03-12_22-45-10',
    '2024-03-10_16-20-33',
    '2024-03-08_11-55-18',
    '2024-03-05_08-10-42',
];

export const MOCK_EVENT_DETAILS: Record<string, SentryEvent> = {
    '2024-03-15_14-30-22': {
        timestamp: '2024-03-15T14:30:22',
        city: 'San Francisco',
        est_lat: '37.7749',
        est_lon: '-122.4194',
        reason: 'user_interaction_honk',
        camera: 'front',
    },
    '2024-03-14_09-15-45': {
        timestamp: '2024-03-14T09:15:45',
        city: 'Palo Alto',
        est_lat: '37.4419',
        est_lon: '-122.1430',
        reason: 'sentry_aware_object_detection',
        camera: 'left_repeater',
    },
    '2024-03-12_22-45-10': {
        timestamp: '2024-03-12T22:45:10',
        city: 'Mountain View',
        est_lat: '37.3861',
        est_lon: '-122.0839',
        reason: 'sentry_aware_object_detection',
        camera: 'right_repeater',
    },
    '2024-03-10_16-20-33': {
        timestamp: '2024-03-10T16:20:33',
        city: 'Cupertino',
        est_lat: '37.3230',
        est_lon: '-122.0322',
        reason: 'user_interaction_honk',
        camera: 'front',
    },
    '2024-03-08_11-55-18': {
        timestamp: '2024-03-08T11:55:18',
        city: 'Sunnyvale',
        est_lat: '37.3688',
        est_lon: '-122.0363',
        reason: 'sentry_aware_object_detection',
        camera: 'back',
    },
    '2024-03-05_08-10-42': {
        timestamp: '2024-03-05T08:10:42',
        city: 'San Jose',
        est_lat: '37.3382',
        est_lon: '-121.8863',
        reason: 'user_interaction_honk',
        camera: 'front',
    },
};

const CAMERAS = ['front', 'right_repeater', 'back', 'left_repeater'];

function generateMockClipFiles(eventId: string): Record<string, string[]> {
    const files: Record<string, string[]> = {};

    for (const camera of CAMERAS) {
        files[camera] = [
            `${eventId}-${camera}.mp4`,
            `${eventId.replace(/(\d{2})$/, (m) => String(parseInt(m) + 1).padStart(2, '0'))}-${camera}.mp4`,
        ];
    }

    return files;
}

export function getMockClipResponse(eventId: string): ClipResponse {
    const event = MOCK_EVENT_DETAILS[eventId] || {
        timestamp: eventId.replace('_', 'T').replace(/-/g, ':').slice(0, 19),
        city: 'Unknown',
        est_lat: '0',
        est_lon: '0',
        reason: 'unknown',
        camera: 'front',
    };

    return {
        event,
        clipFiles: generateMockClipFiles(eventId),
    };
}

// Generate a placeholder thumbnail data URL
export function getMockThumbnail(): string {
    // Return an SVG data URL as placeholder
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="320" height="240" fill="url(#grad)"/>
      <circle cx="160" cy="100" r="30" fill="none" stroke="#3b82f6" stroke-width="3"/>
      <path d="M160 75 L160 125 M135 100 L185 100" stroke="#3b82f6" stroke-width="2"/>
      <text x="160" y="170" text-anchor="middle" fill="#94a3b8" font-family="system-ui" font-size="14">Demo Clip</text>
      <text x="160" y="190" text-anchor="middle" fill="#64748b" font-family="system-ui" font-size="11">Sentry Mode Recording</text>
    </svg>
  `;
    return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
}

// Generate a placeholder video data URL (1x1 transparent mp4 would be better but this works for demo)
export function getMockVideoUrl(): string {
    // Return a simple placeholder - in a real demo we could use actual sample videos
    return 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAA';
}
