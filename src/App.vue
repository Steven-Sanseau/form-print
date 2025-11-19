<script setup>
import { ref, onMounted } from "vue";
import processData from "./utils/processData.js";
import readAsText from "./utils/readAsText.js";
import parseTypeformUrl from "./utils/parseTypeformUrl.js";
import fetchTypeform from "./utils/fetchTypeform.js";
import FormField from "./components/FormField.vue";
import LanguageSwitcher from "./components/LanguageSwitcher.vue";
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
    <header class="print:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold tracking-tight">{{ t("app.title") }}</h1>
        <LanguageSwitcher />
      </div>
    </header>

    <main class="container mx-auto px-4 py-6 max-w-5xl">
      <!-- Loader Card -->
      <Card class="print:hidden mb-6 p-6">
        <h2 class="text-lg font-semibold mb-4">{{ t("loader.title") }}</h2>

        <!-- Error Alert -->
        <Alert v-if="errorMessage" variant="destructive" class="mb-4">
          <div class="flex items-start gap-2">
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
              class="mt-0.5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </Alert>

        <!-- Load from URL -->
        <div class="space-y-2 mb-4">
          <label class="text-sm font-medium leading-none">
            {{ t("loader.urlLabel") }}
          </label>
          <div class="flex gap-2">
            <Input
              v-model="typeformUrl"
              :placeholder="t('loader.urlPlaceholder')"
              :disabled="isLoading"
              @keyup.enter="loadFromUrl"
              class="flex-1"
            />
            <Button @click="loadFromUrl" :disabled="isLoading">
              {{ isLoading ? t("loader.loading") : t("loader.loadButton") }}
            </Button>
          </div>
        </div>

        <!-- API Token (collapsible) -->
        <details class="mb-4 group">
          <summary
            class="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors list-none flex items-center gap-2"
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
              class="transition-transform group-open:rotate-90"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {{ t("loader.apiTokenSection") }}
          </summary>
          <div class="mt-3 space-y-2 pl-6">
            <label class="text-sm text-muted-foreground">
              {{ t("loader.apiTokenLabel") }}
              <a
                href="https://www.typeform.com/help/a/create-api-tokens-360035144552/"
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
            />
          </div>
        </details>

        <!-- Separator -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-card px-2 text-muted-foreground">
              {{ t("loader.or") }}
            </span>
          </div>
        </div>

        <!-- Upload JSON file -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none">
            {{ t("loader.uploadLabel") }}
          </label>
          <Input type="file" @change="onFileChange" accept=".json" />
        </div>
      </Card>

      <!-- Form Content -->
      <div class="space-y-4">
        <h2 class="text-3xl font-bold tracking-tight print:text-2xl">
          {{ data.title }}
        </h2>
        <FormField v-for="field of data.fields" :key="field.ref" :field="field" />
      </div>
    </main>
  </div>
</template>
