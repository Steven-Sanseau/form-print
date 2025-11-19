<script setup>
import { computed } from "vue";
import markdown from "../utils/markdown.js";

const props = defineProps({
  choice: Object,
});

const html = computed(() => markdown(props.choice.label));
</script>

<template>
  <div class="flex items-start gap-2">
    <div
      v-if="choice.shortName"
      class="inline-flex items-center justify-center rounded border bg-muted px-2 py-0.5 text-xs font-medium"
    >
      {{ choice.shortName }}
    </div>
    <div class="text-sm" v-html="html" />
  </div>
</template>
