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
  <div class="flex items-start gap-3">
    <a
      :name="field.ref"
      :href="`#${field.ref}`"
      class="inline-flex items-center justify-center rounded-md border bg-background px-2 py-1 text-xs font-medium hover:bg-accent transition-colors"
    >
      {{ field.shortName }}
    </a>
    <div class="flex-1">
      <h3 class="font-semibold leading-tight">
        <span v-html="titleHTML" />
        <span v-if="required" class="text-destructive ml-1">*</span>
      </h3>
      <p v-if="descriptionHTML" class="text-sm text-muted-foreground mt-1" v-html="descriptionHTML" />
    </div>
  </div>
</template>
