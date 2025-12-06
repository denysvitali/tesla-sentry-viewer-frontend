<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { GetClipTitle } from '../utils/ClipUtils';
import { fetchClips, getClipThumbnailUrl } from '@/services/api';
import { config } from '@/stores/config';

export default defineComponent({
  setup() {
    const loading = ref(true);
    const error = ref('');
    const sentryEvents = ref<string[]>([]);

    const loadClips = async () => {
      loading.value = true;
      error.value = '';
      try {
        const result = await fetchClips();
        sentryEvents.value = result.events || [];
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load clips';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadClips();
    });

    return {
      loading,
      error,
      sentryEvents,
      config,
      loadClips,
    };
  },
  methods: {
    getTitle(clip_id: string): string {
      return GetClipTitle(clip_id);
    },
    getThumbnail(clip_id: string): string {
      return getClipThumbnailUrl(clip_id);
    },
    getEventReason(clip_id: string): string {
      // Extract reason from clip ID or return generic
      if (clip_id.includes('honk')) return 'Honk';
      if (clip_id.includes('object')) return 'Object Detected';
      return 'Sentry Event';
    },
  },
});
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="clips-grid">
    <div v-for="i in 6" :key="i" class="clip-card card skeleton-card">
      <div class="skeleton clip-thumb-skeleton"></div>
      <div class="clip-info">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-subtitle"></div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="error-state">
    <div class="error-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    </div>
    <h3>Unable to Load Clips</h3>
    <p>{{ error }}</p>
    <button class="btn btn-primary" @click="loadClips">
      Try Again
    </button>
  </div>

  <!-- Empty State -->
  <div v-else-if="!sentryEvents || sentryEvents.length === 0" class="empty-state">
    <div class="empty-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
      </svg>
    </div>
    <h3>No Clips Found</h3>
    <p>{{ config.isDemoMode ? 'Demo mode has no clips to display.' : 'No Sentry Mode recordings found on your drive.' }}</p>
  </div>

  <!-- Clips Grid -->
  <div v-else class="clips-grid">
    <router-link
      :to="`/clips/${clip}`"
      v-for="clip of sentryEvents"
      :key="clip"
      class="clip-card card"
    >
      <div class="clip-thumb-container">
        <img
          class="clip-thumb"
          :src="getThumbnail(clip)"
          :alt="getTitle(clip)"
          loading="lazy"
        />
        <div class="clip-overlay">
          <div class="play-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
        <span v-if="config.isDemoMode" class="demo-badge badge badge-demo">Demo</span>
      </div>
      <div class="clip-info">
        <h4 class="clip-title">{{ getTitle(clip) }}</h4>
        <p class="clip-id">{{ clip }}</p>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.clips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.clip-card {
  display: block;
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  transition: all var(--transition-base);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    
    .clip-overlay {
      opacity: 1;
    }
    
    .clip-thumb {
      transform: scale(1.05);
    }
  }
}

.clip-thumb-container {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/9;
  background: var(--color-bg-tertiary);
}

.clip-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.clip-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.play-button {
  width: 64px;
  height: 64px;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
    margin-left: 4px;
  }
}

.demo-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
}

.clip-info {
  padding: var(--spacing-md);
}

.clip-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
}

.clip-id {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
  font-family: monospace;
}

/* Skeleton Loading */
.skeleton-card {
  pointer-events: none;
}

.clip-thumb-skeleton {
  aspect-ratio: 16/9;
}

.skeleton-title {
  height: 20px;
  margin-bottom: var(--spacing-sm);
}

.skeleton-subtitle {
  height: 16px;
  width: 70%;
}

/* Empty & Error States */
.empty-state,
.error-state {
  text-align: center;
  padding: var(--spacing-3xl);
  
  h3 {
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    max-width: 400px;
    margin: 0 auto var(--spacing-lg);
  }
}

.empty-icon,
.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-lg);
  color: var(--color-text-muted);
  
  svg {
    width: 100%;
    height: 100%;
  }
}

.error-icon {
  color: var(--color-error);
}
</style>