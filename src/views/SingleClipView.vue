<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { GetClipTitle, GetTS, GetEventTimeStamp } from "../utils/ClipUtils";
import type { ClipResponse } from "@/types";
import { fetchClipDetails, getClipVideoUrl } from "@/services/api";
import { config } from "@/stores/config";
</script>

<script lang="ts">
const POSSIBLE_CAMERAS = [
  "front",
  "right_repeater",
  "back",
  "left_repeater",
];
const CAMERA_NAMES: Record<string, string> = {
  front: "Front",
  right_repeater: "Right",
  back: "Rear",
  left_repeater: "Left",
};
const DEFAULT_CAMERA = "front";

// Layout: Right-Rear-Left on top, Front centered on bottom
// This creates a logical 360° view matching car perspective
const CAMERA_LAYOUT = [
  1, 2, 3,    // right_repeater, back, left_repeater
  -1, 0, -1,  // empty, front, empty
];

export default {
  data() {
    return {
      id: "",
      videoSet: 0,
      maxVideoSet: 0,
      clipResponse: null as ClipResponse | null,
      eventTs: new Date(0) as Date | null,
      videoTime: 0,
      isLoading: true,
      error: "",
      isPlaying: false,
      isDemoMode: config.isDemoMode,
    };
  },

  props: {},
  methods: {
    goBack() {
      this.$router.push('/clips');
    },
    
    decreaseVideoSet() {
      if (this.videoSet > 0) {
        this.$data.videoSet--;
        this.reloadVideos();
      }
    },
    increaseVideoSet() {
      if (this.$data.videoSet < this.$data.maxVideoSet) {
        this.$data.videoSet++;
        this.reloadVideos();
      }
    },

    getVideoElement(cameraId: string): HTMLVideoElement | null {
      let cameraKey = `camera-${cameraId}`;
      if (!POSSIBLE_CAMERAS.includes(cameraId)) {
        return null;
      }
      let videoRef = this.$refs[cameraKey] as Array<HTMLVideoElement>;
      return videoRef?.[0] || null;
    },

    plus10s() {
      let refVideo = this.getVideoElement("front") as HTMLVideoElement;
      if (!refVideo) return;
      let currentTime = refVideo.currentTime;

      for (let camera of POSSIBLE_CAMERAS) {
        let video = this.getVideoElement(camera) as HTMLVideoElement;
        if (video) video.currentTime = currentTime + 10;
      }
    },

    minus10s() {
      let refVideo = this.getVideoElement("front") as HTMLVideoElement;
      if (!refVideo) return;
      let currentTime = refVideo.currentTime;

      for (let camera of POSSIBLE_CAMERAS) {
        let video = this.getVideoElement(camera) as HTMLVideoElement;
        if (video) video.currentTime = currentTime - 10;
      }
    },

    playAll() {
      this.isPlaying = true;
      for (let camera of POSSIBLE_CAMERAS) {
        let video = this.getVideoElement(camera) as HTMLVideoElement;
        if (video) video.play();
      }
    },

    pauseAll() {
      this.isPlaying = false;
      for (let camera of POSSIBLE_CAMERAS) {
        let video = this.getVideoElement(camera) as HTMLVideoElement;
        if (video) video.pause();
      }
    },

    onVideoPlay() {
      this.isPlaying = true;
    },

    onVideoPause() {
      // Check if all videos are paused
      const allPaused = POSSIBLE_CAMERAS.every(camera => {
        const video = this.getVideoElement(camera);
        return !video || video.paused;
      });
      if (allPaused) {
        this.isPlaying = false;
      }
    },

    reloadVideos() {
      for (let camera of POSSIBLE_CAMERAS) {
        let video = this.getVideoElement(camera) as HTMLVideoElement;
        if (video) {
          video.load();
          if (this.isPlaying) video.play();
        }
      }
    },

    updateTs(cameraId: string) {
      if (cameraId == DEFAULT_CAMERA) {
        let cameraVideo = this.getVideoElement(DEFAULT_CAMERA);
        this.videoTime = cameraVideo?.currentTime || 0;
      }
    },

    seeked(cameraId: string) {
      if (cameraId != DEFAULT_CAMERA) {
        return;
      }
      let cameraVideo = this.getVideoElement(DEFAULT_CAMERA);
      for (let camera of POSSIBLE_CAMERAS) {
        let video = this.getVideoElement(camera) as HTMLVideoElement;
        if (camera == DEFAULT_CAMERA) {
          continue;
        }
        if (video && cameraVideo) {
          video.currentTime = cameraVideo.currentTime;
        }
      }
    },

    setEventTime() {
      if (!this.$data.clipResponse) return;
      
      let lastKnownTS = GetTS(this.$data.clipResponse?.clipFiles[DEFAULT_CAMERA][0]!);
      let videoSetId = 0;

      for (let i = 1; i <= this.$data.maxVideoSet; i++) {
        let clipId = this.$data.clipResponse?.clipFiles[DEFAULT_CAMERA][i]!;
        let clipTS = GetTS(clipId);

        if (clipTS!.getTime() > this.eventTs!.getTime()) {
          break;
        }
        lastKnownTS = clipTS;
        videoSetId = i;
      }

      let secDiff = Math.round((this.eventTs!.getTime() - lastKnownTS!.getTime()) / 1000);
      secDiff -= 3;
      this.$data.videoSet = videoSetId;
      this.reloadVideos();

      for (let camera of POSSIBLE_CAMERAS) {
        let video = this.getVideoElement(camera) as HTMLVideoElement;
        if (video) video.currentTime = Math.max(secDiff, 0);
      }
    },
    
    getVideoSrc(camera: string): string {
      if (!this.clipResponse) return '';
      const filename = this.clipResponse.clipFiles[camera]?.[this.videoSet];
      if (!filename) return '';
      return getClipVideoUrl(this.id, filename);
    },
    
    getCameraName(index: number): string {
      const camera = POSSIBLE_CAMERAS[index];
      return CAMERA_NAMES[camera] || camera;
    },
  },

  computed: {
    currentVideoTime() {
      if (this.clipResponse == null) {
        return "--:--:--";
      }
      let clipId = this.clipResponse?.clipFiles[DEFAULT_CAMERA][this.videoSet];
      let ts = GetTS(clipId);
      if (ts == null) {
        return "--:--:--";
      }

      // Calculate actual clock time by adding video position to clip start time
      let currentTime = new Date(ts.getTime() + this.videoTime * 1000);
      // Return just the time portion (HH:MM:SS)
      return currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      });
    },
    
    eventInfo() {
      if (!this.clipResponse?.event) return null;
      return this.clipResponse.event;
    },
  },

  async mounted() {
    const route = useRoute();
    this.$data.id = route.params.id as string;
    this.isLoading = true;
    
    try {
      this.$data.clipResponse = await fetchClipDetails(this.$data.id);
      this.eventTs = GetEventTimeStamp(this.$data.clipResponse.event.timestamp);
      this.$data.maxVideoSet = this.clipResponse!.clipFiles[DEFAULT_CAMERA].length - 1;
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Failed to load clip';
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<template>
  <div class="single-clip container">
    <!-- Header -->
    <header class="clip-header">
      <button class="btn btn-ghost" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Clips
      </button>
      
      <h1 class="clip-title">{{ GetClipTitle(id) }}</h1>
      
      <span v-if="isDemoMode" class="badge badge-demo">Demo Mode</span>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading clip...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      <h3>Failed to Load Clip</h3>
      <p>{{ error }}</p>
      <button class="btn btn-primary" @click="goBack">Go Back</button>
    </div>

    <!-- Demo Mode Notice -->
    <div v-else-if="isDemoMode" class="demo-player">
      <div class="demo-notice card">
        <div class="demo-camera-grid">
          <div v-for="(camera, index) in CAMERA_LAYOUT" :key="index" class="demo-camera-cell">
            <template v-if="camera !== -1">
              <div class="demo-camera-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <span>{{ getCameraName(camera) }}</span>
              </div>
            </template>
          </div>
        </div>
        
        <div class="demo-info">
          <h3>Demo Mode Preview</h3>
          <p>
            Video playback is not available in demo mode. Connect to a 
            <a href="https://github.com/denysvitali/tesla-sentry-viewer" target="_blank">backend server</a>
            to view actual recordings.
          </p>
          
          <!-- Event Details -->
          <div v-if="eventInfo" class="event-details">
            <h4>Event Information</h4>
            <dl class="event-grid">
              <dt>Timestamp</dt>
              <dd>{{ eventTs?.toLocaleString() }}</dd>
              <dt>Location</dt>
              <dd>{{ eventInfo.city || 'Unknown' }}</dd>
              <dt>Reason</dt>
              <dd>{{ eventInfo.reason?.replace(/_/g, ' ') || 'Unknown' }}</dd>
              <dt>Triggered Camera</dt>
              <dd>{{ CAMERA_NAMES[eventInfo.camera] || eventInfo.camera }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Actual Video Player -->
    <template v-else>
      <!-- Camera Grid -->
      <div class="camera-view-container" v-if="clipResponse != null">
        <div
          class="camera-view"
          v-for="(camera, index) in CAMERA_LAYOUT"
          :key="index"
          :class="{ 'camera-empty': camera === -1 }"
        >
          <template v-if="camera !== -1">
            <div class="camera-wrapper">
              <div class="camera-label" :class="`camera-${POSSIBLE_CAMERAS[camera]}`">
                <span class="camera-indicator"></span>
                {{ getCameraName(camera) }}
              </div>
              <video
                class="video-container"
                :ref="`camera-${POSSIBLE_CAMERAS[camera]}`"
                @timeupdate="updateTs(POSSIBLE_CAMERAS[camera])"
                @seeked="seeked(POSSIBLE_CAMERAS[camera])"
                @play="onVideoPlay"
                @pause="onVideoPause"
              >
                <source :src="getVideoSrc(POSSIBLE_CAMERAS[camera])" />
              </video>
            </div>
          </template>
        </div>
      </div>

      <!-- Floating Control Bar -->
      <div class="control-bar glass">
        <!-- Left: Time Display -->
        <div class="control-bar-section control-bar-time">
          <div class="time-display">
            <span class="time-value">{{ currentVideoTime }}</span>
          </div>
        </div>

        <!-- Center: Playback Controls -->
        <div class="control-bar-section control-bar-playback">
          <button class="control-btn" @click="decreaseVideoSet" :disabled="videoSet === 0" title="Previous Segment">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          
          <button class="control-btn" @click="minus10s" title="Back 10 seconds">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 4v6h6"/>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            <span class="control-btn-label">10</span>
          </button>

          <button class="control-btn control-btn-play" @click="isPlaying ? pauseAll() : playAll()">
            <svg v-if="!isPlaying" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          </button>

          <button class="control-btn" @click="plus10s" title="Forward 10 seconds">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            <span class="control-btn-label">10</span>
          </button>

          <button class="control-btn" @click="increaseVideoSet" :disabled="videoSet >= maxVideoSet" title="Next Segment">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        <!-- Right: Segment & Event -->
        <div class="control-bar-section control-bar-actions">
          <div class="segment-display">
            <span class="segment-current">{{ videoSet + 1 }}</span>
            <span class="segment-separator">/</span>
            <span class="segment-total">{{ maxVideoSet + 1 }}</span>
          </div>
          
          <button class="control-btn control-btn-event" @click="setEventTime" title="Jump to Event">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>Event</span>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.single-clip {
  animation: fadeIn var(--transition-base) ease-out;
}

/* Header */
.clip-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.clip-title {
  flex: 1;
  font-size: var(--font-size-2xl);
  margin: 0;
  
  @media (max-width: 640px) {
    order: 3;
    flex-basis: 100%;
    margin-top: var(--spacing-sm);
  }
}

/* Loading & Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: var(--spacing-3xl);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  margin: 0 auto var(--spacing-lg);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  width: 64px;
  height: 64px;
  color: var(--color-error);
  margin: 0 auto var(--spacing-lg);
}

/* Event Bar */
.event-bar {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.event-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.event-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-value {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

/* Video Controls */
.video-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.segment-indicator {
  padding: 0 var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Camera Grid */
.camera-view-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: 100px; /* Space for floating control bar */
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.camera-view {
  position: relative;
  
  &.camera-empty {
    /* Keep the grid cell but make it invisible */
    visibility: hidden;
    pointer-events: none;
  }
}

.camera-wrapper {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-secondary);
  
  &:hover .camera-label {
    opacity: 1;
  }
}

.camera-label {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: opacity var(--transition-fast);
  
  .camera-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-accent);
  }
  
  &.camera-front .camera-indicator { background: #3b82f6; }
  &.camera-back .camera-indicator { background: #f59e0b; }
  &.camera-left_repeater .camera-indicator { background: #10b981; }
  &.camera-right_repeater .camera-indicator { background: #8b5cf6; }
}

.video-container {
  display: block;
  width: 100%;
  border-radius: var(--radius-md);
  background: #000;
}

/* Floating Control Bar */
.control-bar {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-dropdown);
  max-width: 800px;
  width: calc(100% - var(--spacing-xl) * 2);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
}

.control-bar-section {
  display: flex;
  align-items: center;
}

/* Left Section: Time */
.control-bar-time {
  flex: 1;
  justify-content: flex-start;
  min-width: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
}

/* Center Section: Playback */
.control-bar-playback {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  justify-content: center;
  flex: 0 0 auto;
}

/* Right Section: Actions */
.control-bar-actions {
  flex: 1;
  justify-content: flex-end;
  gap: var(--spacing-md);
  min-width: 0;
  
  @media (max-width: 768px) {
    margin-left: auto;
    flex: 0 0 auto;
  }
}

.time-display {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-md);
}

.time-value {
  font-family: 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
  font-variant-numeric: tabular-nums;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}



.control-bar-actions {
  @media (max-width: 768px) {
    margin-left: auto;
  }
}

/* Control Buttons */
/* Control Buttons */
.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  
  &:hover:not(:disabled) {
    background: var(--color-bg-card-hover);
    border-color: var(--color-border-hover);
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .control-btn-label {
    position: absolute;
    bottom: -4px;
    right: -4px;
    font-size: 9px;
    font-weight: 700;
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
    padding: 2px 4px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }
}

.control-btn-play {
  width: 56px;
  height: 56px;
  background: var(--color-accent);
  border: none;
  
  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
    box-shadow: var(--shadow-glow);
  }
  
  svg {
    margin-left: 2px;
  }
}

.control-btn-event {
  width: auto;
  padding: 0 var(--spacing-md);
  gap: var(--spacing-xs);
  background: var(--color-accent-muted);
  border-color: var(--color-accent);
  color: var(--color-accent);
  
  span {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
  }
  
  &:hover:not(:disabled) {
    background: var(--color-accent);
    color: white;
  }
}

.segment-display {
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-family: 'SF Mono', 'Monaco', monospace;
  font-size: var(--font-size-sm);
  background: var(--color-bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
}

.segment-current {
  font-weight: 700;
  color: var(--color-text-primary);
}

.segment-separator {
  color: var(--color-text-muted);
}

.segment-total {
  color: var(--color-text-muted);
}

/* Demo Player */
.demo-player {
  margin-top: var(--spacing-xl);
}

.demo-notice {
  padding: var(--spacing-xl);
}

.demo-camera-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.demo-camera-cell {
  min-height: 80px;
}

.demo-camera-placeholder {
  height: 100%;
  min-height: 120px;
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-text-muted);
  
  svg {
    width: 32px;
    height: 32px;
  }
  
  span {
    font-size: var(--font-size-sm);
    font-weight: 500;
  }
}

.demo-info {
  text-align: center;
  
  h3 {
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    max-width: 500px;
    margin: 0 auto var(--spacing-xl);
  }
}

.event-details {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-xl);
  text-align: left;
  
  h4 {
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-base);
  }
}

.event-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--spacing-sm) var(--spacing-lg);
  
  dt {
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
  }
  
  dd {
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    margin: 0;
    text-transform: capitalize;
  }
}
</style>