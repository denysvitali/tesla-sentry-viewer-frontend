<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { config } from '@/stores/config'
</script>

<template>
  <div class="home container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge badge badge-demo" v-if="config.isDemoMode">
          Demo Mode Active
        </div>
        <h1 class="hero-title">
          Tesla Sentry
          <span class="hero-title-accent">Viewer</span>
        </h1>
        <p class="hero-description">
          View and analyze your Tesla Sentry Mode recordings with a modern, 
          intuitive interface. Synchronized multi-camera playback, event timeline, 
          and more.
        </p>
        <div class="hero-actions">
          <RouterLink to="/clips" class="btn btn-primary btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            View Clips
          </RouterLink>
          <a 
            href="https://github.com/denysvitali/tesla-sentry-viewer" 
            target="_blank" 
            rel="noopener"
            class="btn btn-secondary btn-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Backend Setup
          </a>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="hero-camera-grid">
          <!-- Top row: Right, Rear, Left -->
          <div class="camera-cell camera-right">
            <span class="camera-label">Right</span>
          </div>
          <div class="camera-cell camera-back">
            <span class="camera-label">Rear</span>
          </div>
          <div class="camera-cell camera-left">
            <span class="camera-label">Left</span>
          </div>
          <!-- Bottom row: empty, Front, empty -->
          <div class="camera-cell camera-empty"></div>
          <div class="camera-cell camera-front">
            <span class="camera-label">Front</span>
          </div>
          <div class="camera-cell camera-empty"></div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2 class="section-title">Features</h2>
      <div class="features-grid">
        <div class="feature-card card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <h3 class="feature-title">Multi-Camera View</h3>
          <p class="feature-description">
            View all four camera angles simultaneously in a synchronized grid layout.
          </p>
        </div>

        <div class="feature-card card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h3 class="feature-title">Event Timeline</h3>
          <p class="feature-description">
            Jump directly to the moment that triggered the sentry event.
          </p>
        </div>

        <div class="feature-card card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <h3 class="feature-title">Synchronized Playback</h3>
          <p class="feature-description">
            Control all cameras at once with unified playback controls.
          </p>
        </div>

        <div class="feature-card card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <h3 class="feature-title">Easy Access</h3>
          <p class="feature-description">
            Simply plug in your Tesla USB drive and browse your recordings.
          </p>
        </div>
      </div>
    </section>

    <!-- Getting Started Section -->
    <section class="getting-started">
      <h2 class="section-title">Getting Started</h2>
      
      <div class="open-source-banner card">
        <div class="banner-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <div class="banner-text">
          <h3>Free & Open Source</h3>
          <p>Tesla Sentry Viewer is completely free to use and open source. No accounts, no subscriptions, no data collection.</p>
        </div>
      </div>

      <div class="steps-grid">
        <div class="step-card card">
          <div class="step-number">1</div>
          <h3>Set Up the Backend</h3>
          <p>
            This frontend requires the backend server to run locally on your computer. The backend reads your Tesla USB drive and serves the video files.
          </p>
          <a 
            href="https://github.com/denysvitali/tesla-sentry-viewer" 
            target="_blank" 
            rel="noopener"
            class="btn btn-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          </a>
        </div>

        <div class="step-card card">
          <div class="step-number">2</div>
          <h3>Start the Backend</h3>
          <p>
            Run the backend server and point it to the <code>SentryClips</code> or <code>SavedClips</code> directory on your Tesla USB drive.
          </p>
          <code class="code-block">tesla-sentry-viewer /path/to/TeslaCam/SentryClips</code>
        </div>

        <div class="step-card card">
          <div class="step-number">3</div>
          <h3>Configure the Frontend</h3>
          <p>
            Click the <strong>gear icon</strong> in the top right corner, enter your backend server URL (e.g., <code>http://localhost:8150</code>), and click Connect.
          </p>
        </div>
      </div>
    </section>

    <!-- Demo Mode Notice -->
    <section v-if="config.isDemoMode" class="demo-notice">
      <div class="demo-notice-content card">
        <div class="demo-notice-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </div>
        <div class="demo-notice-text">
          <h4>You're viewing demo data</h4>
          <p>
            Configure a backend server above to view your actual Tesla Sentry recordings.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding-bottom: var(--spacing-3xl);
}

/* Hero Section */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
  min-height: 60vh;
  padding: var(--spacing-2xl) 0;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    text-align: center;
    min-height: auto;
  }
}

.hero-content {
  animation: slideUp var(--transition-slow) ease-out;
}

.hero-badge {
  margin-bottom: var(--spacing-lg);
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-4xl);
  }
}

.hero-title-accent {
  color: var(--color-accent);
}

.hero-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 500px;
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 968px) {
    margin-left: auto;
    margin-right: auto;
  }
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  
  @media (max-width: 968px) {
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
}

/* Hero Visual */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn var(--transition-slow) ease-out 0.2s both;
  
  @media (max-width: 968px) {
    order: -1;
  }
}

.hero-camera-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 1fr;
  gap: var(--spacing-sm);
  width: 100%;
  max-width: 400px;
  aspect-ratio: 3/2;
}

.camera-cell {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-accent-muted) 0%, transparent 50%);
    opacity: 0.5;
  }
  
  &.camera-empty {
    background: transparent;
    border: none;
    
    &::before {
      display: none;
    }
  }
}

.camera-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 1;
}

/* Features Section */
.features {
  padding: var(--spacing-3xl) 0;
}

.section-title {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  padding: var(--spacing-xl);
  text-align: center;
}

.feature-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--spacing-md);
  color: var(--color-accent);
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.feature-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
}

.feature-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
}

/* Demo Notice */
.demo-notice {
  margin-top: var(--spacing-2xl);
}

.demo-notice-content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--color-accent-muted);
  border-color: var(--color-accent);
}

.demo-notice-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: var(--color-accent);
}

.demo-notice-text {
  h4 {
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-xs);
  }
  
  p {
    font-size: var(--font-size-sm);
    margin: 0;
    color: var(--color-text-secondary);
  }
}

/* Getting Started Section */
.getting-started {
  margin-bottom: var(--spacing-3xl);
}

.open-source-banner {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(14, 165, 233, 0.3);
  
  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
}

.banner-icon {
  flex-shrink: 0;
  
  svg {
    width: 40px;
    height: 40px;
    color: var(--color-text-primary);
  }
}

.banner-text {
  h3 {
    margin: 0 0 var(--spacing-xs);
    font-size: var(--font-size-lg);
  }
  
  p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
}

.step-card {
  padding: var(--spacing-xl);
  
  h3 {
    margin: 0 0 var(--spacing-sm);
    font-size: var(--font-size-lg);
  }
  
  p {
    margin: 0 0 var(--spacing-md);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    line-height: 1.6;
  }
  
  code {
    background: var(--color-bg-tertiary);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
  }
}

.step-number {
  width: 32px;
  height: 32px;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.code-block {
  display: block;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md) !important;
  background: var(--color-bg-tertiary) !important;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md) !important;
  font-family: 'SF Mono', 'Monaco', 'Menlo', monospace;
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
  overflow-x: auto;
}
</style>
