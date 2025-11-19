<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "default",
    validator: (value) => ["default", "destructive"].includes(value),
  },
});

const classes = computed(() => {
  const baseClasses = "relative w-full rounded-lg border p-4";

  const variantClasses = {
    default: "bg-background text-foreground",
    destructive:
      "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
  };

  return `${baseClasses} ${variantClasses[props.variant]}`;
});
</script>

<template>
  <div :class="classes" role="alert">
    <slot />
  </div>
</template>
