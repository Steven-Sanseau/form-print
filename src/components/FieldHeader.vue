<script setup>
import { computed } from "vue";
import markdown from "../utils/markdown.js";

const props = defineProps({
  field: Object,
});
const required = computed(() => props.field.validations?.required);
const titleHTML = computed(() => markdown(props.field.title));
const descriptionHTML = computed(() =>
  markdown(props.field.properties.description)
);
</script>

<template>
  <div class="flex items-center gap-4">
    <a
      :name="field.ref"
      :href="`#${field.ref}`"
      class="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm font-semibold hover:bg-accent transition-colors shrink-0"
    >
      {{ field.shortName }}
    </a>
    <div class="flex-1">
      <h3 class="text-lg font-semibold leading-snug">
        <span v-html="titleHTML" />
        <span v-if="required" class="text-destructive ml-1">*</span>
      </h3>
      <p v-if="descriptionHTML" class="text-base text-muted-foreground mt-2" v-html="descriptionHTML" />
    </div>
  </div>
</template>
