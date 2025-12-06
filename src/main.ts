import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { config, enableDemoMode } from './stores/config'

declare global {
    interface Window {
        $config: Config
    }
}

interface Config {
    backendEndpoint: string
}

const app = createApp(App)

const start = async () => {
    // Check if we have a stored configuration
    if (!config.isConfigured) {
        // Default to demo mode for GitHub Pages deployment
        enableDemoMode();
    }

    // For backwards compatibility, also try to load config.json
    // This allows existing deployments to continue working
    if (!config.isDemoMode && !config.serverUrl) {
        try {
            const res = await fetch(import.meta.env.BASE_URL + 'config.json');
            if (res.ok) {
                const configData = await res.json();
                if (configData.backendEndpoint) {
                    window.$config = configData;
                }
            }
        } catch (err) {
            console.log('No config.json found, using stored configuration');
        }
    }

    app.use(router)
    app.mount('#app')
}

start();