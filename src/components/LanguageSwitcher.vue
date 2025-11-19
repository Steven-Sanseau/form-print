<script setup>
import { useI18n } from "../i18n/index.js";
import Button from "./ui/Button.vue";

const { locale } = useI18n();

const toggleLanguage = () => {
  locale.value = locale.value === "en" ? "fr" : "en";
};
</script>

<template>
  <Button variant="ghost" size="sm" @click="toggleLanguage" class="print:hidden">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="mr-2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
    {{ locale === "en" ? "FR" : "EN" }}
  </Button>
</template>
