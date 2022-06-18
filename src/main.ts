import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

declare global {
    interface Window {
        $config: Config
    }
}

interface Config {
    backendEndpoint: string
}


const app = createApp(App)

let start = async () => {
    try {
        let res = await fetch("/config.json");
        let config = await res.json();
        window.$config = config;
    } catch (err) {
        console.error(`Unable to get config: ${err}`)
    }
    app.use(router)
    app.mount('#app')
}


start();