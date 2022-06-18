<script setup lang="ts">
import { useRoute } from "vue-router";
import { GetClipTitle, GetTS, GetEventTimeStamp } from "../utils/ClipUtils";
import type { ClipResponse } from "@/types";
import { API_ENDPOINT } from "@/utils/const";
</script>

<script lang="ts">
const POSSIBLE_CAMERAS = [
  "front",
  "right_repeater",
  "back",
  "left_repeater",
]
const DEFAULT_CAMERA = "front";

const CAMERA_LAYOUT = [
  -1, 0, -1,
  1, 2, 3,
]

export default {
  data() {
    return {
      id: "",
      videoSet: 0,
      maxVideoSet: 0,
      clipResponse: null as ClipResponse | null,
      eventTs: new Date(0) as Date | null,
      videoTime: 0,
    };
  },

  props: {},
  methods:{
    decreaseVideoSet(){
      if(this.videoSet > 0){
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

    getVideoElement(cameraId: string) : HTMLVideoElement | null {
      let cameraKey = `camera-${cameraId}`;
      if(!POSSIBLE_CAMERAS.includes(cameraId)){
        return null;
      }
      let videoRef = this.$refs[cameraKey] as Array<HTMLVideoElement>;
      return videoRef[0];
    },

    plus10s(){
      let refVideo = this.getVideoElement("front") as HTMLVideoElement;
      let currentTime = refVideo.currentTime;

      for(let camera of POSSIBLE_CAMERAS) {
          let video = this.getVideoElement(camera) as HTMLVideoElement;
          video.currentTime = currentTime + 10;
      }
    },

    minus10s(){
      let refVideo = this.getVideoElement("front") as HTMLVideoElement;
      let currentTime = refVideo.currentTime;

      for(let camera of POSSIBLE_CAMERAS) {
          let video = this.getVideoElement(camera) as HTMLVideoElement;
          video.currentTime = currentTime - 10;
      }
    },

    playAll(){
      for(let camera of POSSIBLE_CAMERAS) {
          let video = this.getVideoElement(camera) as HTMLVideoElement;
          video.play();
      }
    },

    pauseAll(){
      for(let camera of POSSIBLE_CAMERAS) {
          let video = this.getVideoElement(camera) as HTMLVideoElement;
          video.pause();
      }
    },

    reloadVideos(){
      for(let camera of POSSIBLE_CAMERAS) {
          let video = this.getVideoElement(camera) as HTMLVideoElement;
          video.load();
          video.play();
        }
    },

    updateTs(cameraId: string){
      if(cameraId == DEFAULT_CAMERA){
        let cameraVideo = this.getVideoElement(DEFAULT_CAMERA);
        this.videoTime = cameraVideo?.currentTime!;
      }
    },

    seeked(cameraId: string) {
      if(cameraId != DEFAULT_CAMERA){
        return;
      }
      let cameraVideo = this.getVideoElement(DEFAULT_CAMERA);
      // Seek all videos
      for(let camera of POSSIBLE_CAMERAS){
        let video = this.getVideoElement(camera) as HTMLVideoElement;
        if(camera == DEFAULT_CAMERA){
          // Do not seek twice
          continue;
        }
        video.currentTime = cameraVideo?.currentTime!;
      }
    },

    setEventTime(){
      // Given the Event Timestamp, we find the last clip that starts before that event, then we seek N seconds
      // (difference between event timestamp and clip start time)

      let lastKnownTS = GetTS(this.$data.clipResponse?.clipFiles[DEFAULT_CAMERA][0]!);
      let videoSetId = 0;

      for(let i=1; i<=this.$data.maxVideoSet; i++){
        let clipId = this.$data.clipResponse?.clipFiles[DEFAULT_CAMERA][i]!;
        let clipTS = GetTS(clipId);

        if(clipTS!.getTime() > this.eventTs!.getTime()){
          // Last known good clip is lastKnownTS
          break
        }
        lastKnownTS = clipTS;
        videoSetId = i;
      }

      let secDiff = Math.round( (this.eventTs!.getTime() - lastKnownTS!.getTime()) / 1000);
      secDiff -= 3;
      console.log(secDiff);
      this.$data.videoSet = videoSetId;
      this.reloadVideos();

      for(let camera of POSSIBLE_CAMERAS){
        let video = this.getVideoElement(camera) as HTMLVideoElement;
        video.currentTime = Math.max(secDiff, 0);
      }
    },
  },

  computed: {
    currentVideoTime(){
      if(this.clipResponse == null){
        return "";
      }
      let clipId = this.clipResponse?.clipFiles[DEFAULT_CAMERA][this.videoSet];
      let ts = GetTS(clipId);
      if(ts == null){
        return "";
      }

      let newDate = new Date(ts.getTime() + this.videoTime * 1000);
      return newDate.toString();
    }
  },

  async mounted() {
    const route = useRoute();
    this.$data.id = route.params.id as string;
    this.$data.clipResponse = (await (
      await fetch(`${API_ENDPOINT}/api/v1/clips/${this.$data.id}`)
    ).json()) as ClipResponse;
    console.log(this.$data.clipResponse.event.timestamp);
    this.eventTs = GetEventTimeStamp(this.$data.clipResponse.event.timestamp);
    console.log(this.eventTs);
    this.$data.maxVideoSet = this.clipResponse!.clipFiles[DEFAULT_CAMERA].length - 1;
  },
};
</script>

<template>
  <main>
    <h3>Viewing {{ GetClipTitle(id) }}</h3>

    <p>Event Timestamp: {{ eventTs }}</p>
    <p>Current Video Time: {{ currentVideoTime }}</p>
    <p>VideoSet: {{ videoSet }}</p>

    <button class="videoset-controller" @click="decreaseVideoSet">-</button>
    <button class="videoset-controller" @click="increaseVideoSet">+</button>

    <button class="videoset-controller" @click="minus10s">-10s</button>
    <button class="videoset-controller" @click="plus10s">+10s</button>
    <button class="videoset-controller" @click="playAll">PLAY</button>
    <button class="videoset-controller" @click="pauseAll">PAUSE</button>
    <button class="videoset-controller" @click="setEventTime">Set Event Time</button>

    <div class="camera-view-container" v-if="clipResponse != null">
      <div
        class="camera-view"
        v-for="camera in CAMERA_LAYOUT"
        v-bind:key="camera"
      >
        <video class="video-container" 
        :ref="`camera-${POSSIBLE_CAMERAS[camera]}`"
        controls v-if="camera != -1"
        v-on:timeupdate="updateTs(POSSIBLE_CAMERAS[camera])"
        v-on:seeked="seeked(POSSIBLE_CAMERAS[camera])"
        >
          <source
            :src="`${API_ENDPOINT}/api/v1/clips/${id}/${
              clipResponse.clipFiles[POSSIBLE_CAMERAS[camera]][videoSet]
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