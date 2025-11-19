<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "default",
    validator: (value) => ["default", "secondary", "outline", "ghost"].includes(value),
  },
  size: {
    type: String,
    default: "default",
    validator: (value) => ["default", "sm", "lg"].includes(value),
  },
  disabled: Boolean,
});

const classes = computed(() => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizeClasses = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  };

  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]}`;
});
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <slot />
  </button>
</template>
