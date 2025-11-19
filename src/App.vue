<script setup>
import { ref, onMounted } from "vue";
import processData from "./utils/processData.js";
import readAsText from "./utils/readAsText.js";
import parseTypeformUrl from "./utils/parseTypeformUrl.js";
import fetchTypeform from "./utils/fetchTypeform.js";
import FormField from "./components/FormField.vue";
import LanguageSwitcher from "./components/LanguageSwitcher.vue";
import PrintButton from "./components/PrintButton.vue";
import Button from "./components/ui/Button.vue";
import Input from "./components/ui/Input.vue";
import Card from "./components/ui/Card.vue";
import Alert from "./components/ui/Alert.vue";
import { useI18n } from "./i18n/index.js";
import exampleData from "../data/XrH6qm0B - Example typeform.json";

const { t } = useI18n();

const data = ref(processData(exampleData));
const typeformUrl = ref("");
const apiToken = ref("");
const isLoading = ref(false);
const errorMessage = ref("");

// Load API token from environment or localStorage
onMounted(() => {
  const envToken = import.meta.env.VITE_TYPEFORM_TOKEN;
  const savedToken = localStorage.getItem("typeform_api_token");
  apiToken.value = envToken || savedToken || "";
});

function updateTitle() {
  document.title = data.value.title;
}

async function onFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    errorMessage.value = "";
    const rawData = await readAsText(file);
    const json = JSON.parse(rawData);
    data.value = processData(json);
    updateTitle();
  } catch (error) {
    errorMessage.value = `${t("errors.fileError")}: ${error.message}`;
  }
}

async function loadFromUrl() {
  errorMessage.value = "";

  if (!typeformUrl.value.trim()) {
    errorMessage.value = t("errors.urlRequired");
    return;
  }

  const formId = parseTypeformUrl(typeformUrl.value);

  if (!formId) {
    errorMessage.value = t("errors.invalidUrl");
    return;
  }

  isLoading.value = true;

  try {
    // Save token to localStorage for future use if provided
    if (apiToken.value.trim()) {
      localStorage.setItem("typeform_api_token", apiToken.value);
    }

    // Try to fetch with or without token (public forms don't need token)
    const json = await fetchTypeform(formId, apiToken.value.trim() || null);
    data.value = processData(json);
    updateTitle();
    typeformUrl.value = ""; // Clear input after successful load
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="print:hidden border-b">
      <div class="container mx-auto px-6 py-5 flex items-center justify-between">
        <h1 class="text-3xl font-bold">{{ t("app.title") }}</h1>
        <LanguageSwitcher />
      </div>
    </header>

    <main class="container mx-auto px-6 py-8 max-w-6xl">
      <!-- Loader Section -->
      <div class="print:hidden mb-8 p-8 rounded-lg border bg-card shadow-sm">
        <h2 class="text-2xl font-semibold mb-6">{{ t("loader.title") }}</h2>

        <!-- Error Alert -->
        <div
          v-if="errorMessage"
          class="mb-6 p-4 bg-destructive/10 border border-destructive/50 text-destructive rounded-lg"
        >
          {{ errorMessage }}
        </div>

        <!-- Load from URL -->
        <div class="mb-6">
          <label class="block text-base font-medium mb-3">
            {{ t("loader.urlLabel") }}
          </label>
          <div class="flex gap-3">
            <Input
              v-model="typeformUrl"
              :placeholder="t('loader.urlPlaceholder')"
              :disabled="isLoading"
              @keyup.enter="loadFromUrl"
              class="flex-1 text-base h-12"
            />
            <Button @click="loadFromUrl" :disabled="isLoading" size="lg">
              {{ isLoading ? t("loader.loading") : t("loader.loadButton") }}
            </Button>
          </div>
        </div>

        <!-- API Token (collapsible) -->
        <details class="mb-6">
          <summary class="cursor-pointer text-base font-medium text-muted-foreground hover:text-foreground mb-3">
            {{ t("loader.apiTokenSection") }}
          </summary>
          <div class="mt-4 pl-4 border-l-2 border-border">
            <label class="block text-sm text-muted-foreground mb-3">
              {{ t("loader.apiTokenLabel") }}
              <a
                href="https://help.typeform.com/hc/en-us/articles/13599952215572-Typeform-API-personal-access-token"
                target="_blank"
                class="text-primary hover:underline ml-1"
              >
                ({{ t("loader.apiTokenLink") }})
              </a>
            </label>
            <Input
              v-model="apiToken"
              type="password"
              :placeholder="t('loader.apiTokenPlaceholder')"
              class="text-base h-12"
            />
          </div>
        </details>

        <!-- Separator -->
        <div class="relative my-8">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-sm uppercase">
            <span class="bg-card px-3 text-muted-foreground font-medium">
              {{ t("loader.or") }}
            </span>
          </div>
        </div>

        <!-- Upload JSON file -->
        <div>
          <label class="block text-base font-medium mb-3">
            {{ t("loader.uploadLabel") }}
          </label>
          <Input type="file" @change="onFileChange" accept=".json" class="text-base h-12" />
        </div>
      </div>

      <!-- Form Content -->
      <div class="space-y-6">
        <h2 class="text-4xl font-bold tracking-tight print:text-2xl mb-2">
          {{ data.title }}
        </h2>
        <FormField v-for="field of data.fields" :key="field.ref" :field="field" />
      </div>
    </main>

    <!-- Print Button -->
    <PrintButton />
  </div>
</template>
