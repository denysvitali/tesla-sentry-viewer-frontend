<script lang="ts">
import { defineComponent } from "vue";
import { GetClipTitle } from '../utils/ClipUtils';
import { API_ENDPOINT } from '@/utils/const';

export default defineComponent({
  setup() {},
  async mounted() {
    let result = await (await fetch(`${API_ENDPOINT}/api/v1/clips`)).json();
    this.loading = false;
    this.sentryEvents = result.events;
  },
  data() {
    return {
      loading: true,
      sentryEvents: [] as Array<string>,
      apiEndpoint: API_ENDPOINT,
    };
  },
  methods: {
    getTitle(clip_id: string): string {
      return GetClipTitle(clip_id)
    },
  },
});
</script>

<template>
  <div class="clips">
    <router-link
      :to="`/clips/${clip}`"
      v-for="clip of sentryEvents"
      v-bind:key="clip"
    >
      <div class="clip">
        <img
          class="clip-thumb"
          :src="apiEndpoint + '/api/v1/clips/' + clip + '/thumb'"
        />
        <div class="clip-info">
          <h4 class="clip-title">{{ getTitle(clip) }}</h4>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.clips {
  .clip {
    display: flex;
    flex-direction: row;
    row-gap: 5px;
    column-gap: 10px;
    margin: 8px;

    .clip-thumb {
      width: 200px;
      height: 150px;
    }

    .clip-title {
      font-weight: bold;
    }
  }
}
</style>