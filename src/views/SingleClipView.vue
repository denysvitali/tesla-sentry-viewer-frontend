<script setup lang="ts">
import { useRoute } from "vue-router";
import { GetClipTitle, GetTS } from "../utils/ClipUtils";
import type { ClipResponse } from "@/types";
import { API_ENDPOINT } from "@/utils/const";
</script>

<script lang="ts">
export default {
  data() {
    return {
      id: "",
      videoSet: 0,
      maxVideoSet: 0,
      clipResponse: null as ClipResponse | null,
    };
  },

  props: {},
  methods:{
    decreaseVideoSet(){
      if(this.$data.videoSet > 0){
        this.$data.videoSet--;
        this.reloadVideos();
      }
    },
    increaseVideoSet(){
      if(this.$data.videoSet < this.$data.maxVideoSet){
        this.$data.videoSet++;
        this.reloadVideos();
      }
    },

    plus10s(){
      let refVideo = this.$refs['camera-front'][0] as HTMLVideoElement;
      let currentTime = refVideo.currentTime;

      for(let camera of Object.keys(this.$data.clipResponse?.clipFiles)){
          let video = this.$refs['camera-' + camera][0] as HTMLVideoElement;
          video.currentTime = currentTime + 10;
      }
    },

    minus10s(){
      let refVideo = this.$refs['camera-front'][0] as HTMLVideoElement;
      let currentTime = refVideo.currentTime;

      for(let camera of Object.keys(this.$data.clipResponse?.clipFiles)){
          let video = this.$refs['camera-' + camera][0] as HTMLVideoElement;
          video.currentTime = currentTime - 10;
      }
    },

    playAll(){
      for(let camera of Object.keys(this.$data.clipResponse?.clipFiles)){
          let video = this.$refs['camera-' + camera][0] as HTMLVideoElement;
          video.play();
      }
    },

    reloadVideos(){
      for(let camera of Object.keys(this.$data.clipResponse?.clipFiles)){
          let video = this.$refs['camera-' + camera][0] as HTMLVideoElement;
          video.load();
          video.play();
        }
    }
  },

  async mounted() {
    const route = useRoute();
    this.$data.id = route.params.id as string;
    this.$data.clipResponse = (await (
      await fetch(`${API_ENDPOINT}/api/v1/clips/${this.$data.id}`)
    ).json()) as ClipResponse;
    this.$data.event_ts = GetTS(this.$data.id);
    this.$data.maxVideoSet = this.clipResponse?.clipFiles["front"].length - 1;
  },
};
</script>

<template>
  <main>
    <h3>Viewing {{ GetClipTitle(id) }}</h3>

    <p>Timestamp: <span class="timestamp">XXX</span></p>
    <p>VideoSet: {{ videoSet }}</p>

    <button class="videoset-controller" @click="decreaseVideoSet">-</button>
    <button class="videoset-controller" @click="increaseVideoSet">+</button>

    <button class="videoset-controller" @click="minus10s">-10s</button>
    <button class="videoset-controller" @click="plus10s">+10s</button>
    <button class="videoset-controller" @click="playAll">PLAY</button>

    <div class="camera-view-container" v-if="clipResponse != null">
      <div
        class="camera-view"
        v-for="camera in [
          'left_repeater',
          'front',
          'right_repeater',
          '',
          'back',
          '',
        ]"
        v-bind:key="camera"
      >
        <video class="video-container" 
        :ref="'camera-' + camera"
        controls v-if="camera != ''">
          <source
            :src="`${API_ENDPOINT}/api/v1/clips/${id}/${
              clipResponse.clipFiles[camera][videoSet]
            }`"
          />
        </video>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>

button.videoset-controller {
  padding: 10px;
}
.camera-view-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;

  .video-container {
    display: block;
    width: 100%;
  }
}
</style>