<script setup>
import { ref } from "vue";
import { useI18n } from "../i18n/index.js";
import Button from "./ui/Button.vue";
import Alert from "./ui/Alert.vue";

const { t, locale } = useI18n();
const showInstructions = ref(false);

const printDocument = () => {
  showInstructions.value = true;
  // Small delay to show instructions before print dialog
  setTimeout(() => {
    window.print();
  }, 100);
};
</script>

<template>
  <div class="print:hidden fixed bottom-4 right-4 z-50">
    <!-- Print Instructions Alert -->
    <div
      v-if="showInstructions"
      class="mb-4 max-w-md animate-in slide-in-from-bottom"
    >
      <Alert class="bg-background border-primary">
        <div class="flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mt-0.5 text-primary"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <div class="flex-1 text-sm">
            <p class="font-semibold mb-1">
              {{ locale === 'fr' ? 'Conseil d\'impression' : 'Print Tip' }}
            </p>
            <p class="text-muted-foreground">
              {{
                locale === 'fr'
                  ? 'Décochez "En-têtes et pieds de page" dans les paramètres d\'impression pour supprimer la date et l\'URL.'
                  : 'Uncheck "Headers and footers" in print settings to remove date and URL.'
              }}
            </p>
          </div>
          <button
            @click="showInstructions = false"
            class="text-muted-foreground hover:text-foreground"
          >
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
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </Alert>
    </div>

    <!-- Print Button -->
    <Button @click="printDocument" size="lg" class="shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mr-2"
      >
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      {{ locale === 'fr' ? 'Imprimer / PDF' : 'Print / PDF' }}
    </Button>
  </div>
</template>

<style scoped>
@keyframes slide-in-from-bottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-in {
  animation: slide-in-from-bottom 0.3s ease-out;
}
</style>
