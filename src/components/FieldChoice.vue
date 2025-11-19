<script setup>
import { computed } from "vue";
import markdown from "../utils/markdown.js";

const props = defineProps({
  choice: Object,
});

const html = computed(() => markdown(props.choice.label));
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      v-if="choice.shortName"
      class="inline-flex items-center justify-center rounded-md border bg-muted px-2.5 py-1.5 text-sm font-medium shrink-0"
    >
      {{ choice.shortName }}
    </div>
    <div class="text-base leading-relaxed flex-1" v-html="html" />
  </div>
</template>
