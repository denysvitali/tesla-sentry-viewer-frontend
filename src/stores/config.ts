import { reactive, readonly } from 'vue';

export interface AppConfig {
    serverUrl: string;
    isDemoMode: boolean;
    isConfigured: boolean;
}

const STORAGE_KEY = 'tesla-sentry-config';

function loadFromStorage(): Partial<AppConfig> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load config from storage:', e);
    }
    return {};
}

function saveToStorage(config: AppConfig) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            serverUrl: config.serverUrl,
            isDemoMode: config.isDemoMode,
            isConfigured: config.isConfigured,
        }));
    } catch (e) {
        console.error('Failed to save config to storage:', e);
    }
}

const stored = loadFromStorage();

const state = reactive<AppConfig>({
    serverUrl: stored.serverUrl || '',
    isDemoMode: stored.isDemoMode ?? true,
    isConfigured: stored.isConfigured ?? false,
});

export function setServerUrl(url: string) {
    state.serverUrl = url;
    state.isDemoMode = false;
    state.isConfigured = true;
    saveToStorage(state);
}

export function enableDemoMode() {
    state.serverUrl = '';
    state.isDemoMode = true;
    state.isConfigured = true;
    saveToStorage(state);
}

export function resetConfig() {
    state.serverUrl = '';
    state.isDemoMode = true;
    state.isConfigured = false;
    localStorage.removeItem(STORAGE_KEY);
}

export function getApiEndpoint(): string {
    if (state.isDemoMode) {
        return '__DEMO__';
    }
    return state.serverUrl;
}

export const config = readonly(state);
