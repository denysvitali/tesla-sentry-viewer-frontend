<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { config, enableDemoMode, setServerUrl, resetConfig } from './stores/config'
import { ref, computed } from 'vue'
import { testConnection } from './services/api'

const showSettings = ref(false)
const serverUrlInput = ref('')
const isTestingConnection = ref(false)
const connectionError = ref('')

const statusText = computed(() => {
  if (config.isDemoMode) return 'Demo Mode'
  return 'Connected'
})

const openSettings = () => {
  serverUrlInput.value = config.serverUrl
  connectionError.value = ''
  showSettings.value = true
}

const closeSettings = () => {
  showSettings.value = false
}

const handleDemoMode = () => {
  enableDemoMode()
  closeSettings()
}

const handleConnect = async () => {
  if (!serverUrlInput.value.trim()) {
    connectionError.value = 'Please enter a server URL'
    return
  }

  // Clean up URL
  let url = serverUrlInput.value.trim()
  if (url.endsWith('/')) {
    url = url.slice(0, -1)
  }

  isTestingConnection.value = true
  connectionError.value = ''

  const success = await testConnection(url)

  isTestingConnection.value = false

  if (success) {
    setServerUrl(url)
    closeSettings()
    // Reload to apply new config
    window.location.reload()
  } else {
    connectionError.value = 'Could not connect to server. Please check the URL.'
  }
}

const handleReset = () => {
  resetConfig()
  window.location.reload()
}
</script>

<template>
  <div class="app-container">
    <!-- Navigation -->
    <header class="header glass">
      <div class="header-content container">
        <div class="logo">
          <RouterLink to="/" class="logo-link">
            <svg class="logo-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span class="logo-text">Tesla Sentry Viewer</span>
          </RouterLink>
        </div>

        <nav class="nav">
          <RouterLink to="/" class="nav-link">Home</RouterLink>
          <RouterLink to="/clips" class="nav-link">Clips</RouterLink>
        </nav>

        <div class="header-actions">
          <span class="status-badge badge" :class="config.isDemoMode ? 'badge-demo' : 'badge-success'">
            {{ statusText }}
          </span>
          <button class="btn btn-ghost btn-icon" @click="openSettings" title="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p class="footer-text">
          Tesla Sentry Viewer &copy; {{ new Date().getFullYear() }}
          <span class="separator">•</span>
          <a href="https://github.com/denysvitali/tesla-sentry-viewer-frontend" target="_blank" rel="noopener">
            GitHub
          </a>
        </p>
      </div>
    </footer>

    <!-- Settings Modal -->
    <Teleport to="body">
      <div v-if="showSettings" class="modal-overlay" @click.self="closeSettings">
        <div class="modal animate-slide-up">
          <div class="modal-header">
            <h3>Settings</h3>
            <button class="btn btn-ghost btn-icon" @click="closeSettings">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Server URL</label>
              <input
                v-model="serverUrlInput"
                type="url"
                class="input"
                placeholder="http://localhost:8150"
                @keyup.enter="handleConnect"
              />
              <p v-if="connectionError" class="form-error">{{ connectionError }}</p>
            </div>

            <div class="modal-actions">
              <button 
                class="btn btn-primary" 
                @click="handleConnect"
                :disabled="isTestingConnection"
              >
                {{ isTestingConnection ? 'Testing...' : 'Connect' }}
              </button>
              <button class="btn btn-secondary" @click="handleDemoMode">
                Use Demo Mode
              </button>
            </div>

            <div class="modal-divider">
              <span>or</span>
            </div>

            <button class="btn btn-ghost" @click="handleReset" style="width: 100%;">
              Reset Configuration
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss">
@import '@/assets/base.css';

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-dropdown);
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: var(--font-size-lg);
  
  &:hover {
    color: var(--color-text-primary);
  }
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: var(--color-accent);
}

.logo-text {
  @media (max-width: 640px) {
    display: none;
  }
}

.nav {
  display: flex;
  gap: var(--spacing-xl);
}

.nav-link {
  color: var(--color-text-secondary);
  font-weight: 500;
  padding: var(--spacing-sm) 0;
  position: relative;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--color-text-primary);
  }
  
  &.router-link-active {
    color: var(--color-text-primary);
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-accent);
      border-radius: var(--radius-full);
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.status-badge {
  @media (max-width: 480px) {
    display: none;
  }
}

/* Main Content */
.main-content {
  flex: 1;
  padding: var(--spacing-2xl) 0;
}

/* Footer */
.footer {
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg) 0;
  margin-top: auto;
}

.footer-text {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
  
  a {
    color: var(--color-text-secondary);
    
    &:hover {
      color: var(--color-text-primary);
    }
  }
}

.separator {
  margin: 0 var(--spacing-sm);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-lg);
}

.modal {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  
  h3 {
    margin: 0;
    font-size: var(--font-size-xl);
  }
}

.modal-body {
  padding: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.form-error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-sm);
  margin-bottom: 0;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  
  .btn {
    flex: 1;
  }
}

.modal-divider {
  display: flex;
  align-items: center;
  margin: var(--spacing-lg) 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }
  
  span {
    padding: 0 var(--spacing-md);
  }
}
</style>
