import { config } from '@/stores/config';
import { MOCK_EVENTS, getMockClipResponse, getMockThumbnail } from '@/mock/mockData';
import type { ClipResponse } from '@/types';

interface ClipsListResponse {
    events: string[];
}

export async function fetchClips(): Promise<ClipsListResponse> {
    if (config.isDemoMode) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return { events: MOCK_EVENTS };
    }

    const response = await fetch(`${config.serverUrl}/api/v1/clips`);
    if (!response.ok) {
        throw new Error(`Failed to fetch clips: ${response.statusText}`);
    }
    return response.json();
}

export async function fetchClipDetails(clipId: string): Promise<ClipResponse> {
    if (config.isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 200));
        return getMockClipResponse(clipId);
    }

    const response = await fetch(`${config.serverUrl}/api/v1/clips/${clipId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch clip details: ${response.statusText}`);
    }
    return response.json();
}

export function getClipThumbnailUrl(clipId: string): string {
    if (config.isDemoMode) {
        return getMockThumbnail();
    }
    return `${config.serverUrl}/api/v1/clips/${clipId}/thumb`;
}

export function getClipVideoUrl(clipId: string, filename: string): string {
    if (config.isDemoMode) {
        // Return a placeholder - in demo mode we show a message instead of actual video
        return '';
    }
    return `${config.serverUrl}/api/v1/clips/${clipId}/${filename}`;
}

export async function testConnection(serverUrl: string): Promise<boolean> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${serverUrl}/api/v1/clips`, {
            method: 'GET',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch {
        return false;
    }
}
