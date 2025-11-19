<script setup>
import { ref, onMounted } from "vue";
import processData from "./utils/processData.js";
import readAsText from "./utils/readAsText.js";
import parseTypeformUrl from "./utils/parseTypeformUrl.js";
import fetchTypeform from "./utils/fetchTypeform.js";
import FormField from "./components/FormField.vue";
import exampleData from "../data/XrH6qm0B - Example typeform.json";

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
    errorMessage.value = `Error loading file: ${error.message}`;
  }
}

async function loadFromUrl() {
  errorMessage.value = "";

  if (!typeformUrl.value.trim()) {
    errorMessage.value = "Please enter a Typeform URL or ID";
    return;
  }

  const formId = parseTypeformUrl(typeformUrl.value);

  if (!formId) {
    errorMessage.value = "Invalid Typeform URL. Please use format: https://xxx.typeform.com/to/FormID";
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
  <div class="print:hidden m-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h2 class="text-lg font-semibold mb-4">Load Typeform</h2>

    <!-- Error message -->
    <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
      {{ errorMessage }}
    </div>

    <!-- Load from URL -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Typeform URL or ID
      </label>
      <div class="flex gap-2">
        <input
          v-model="typeformUrl"
          type="text"
          placeholder="https://xxx.typeform.com/to/FormID or FormID"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="loadFromUrl"
          :disabled="isLoading"
        />
        <button
          @click="loadFromUrl"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? "Loading..." : "Load" }}
        </button>
      </div>
    </div>

    <!-- API Token input (optional for private forms) -->
    <details class="mb-4">
      <summary class="cursor-pointer text-sm font-medium text-gray-700 mb-2">
        API Token (optional - only for private forms)
      </summary>
      <div class="mt-2">
        <label class="block text-sm text-gray-600 mb-2">
          Typeform Personal Access Token
          <a
            href="https://www.typeform.com/help/a/create-api-tokens-360035144552/"
            target="_blank"
            class="text-blue-600 hover:underline ml-1"
          >
            (Get your token)
          </a>
        </label>
        <input
          v-model="apiToken"
          type="password"
          placeholder="Only needed for private forms"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </details>

    <!-- Separator -->
    <div class="flex items-center my-4">
      <div class="flex-1 border-t border-gray-300"></div>
      <span class="px-3 text-gray-500 text-sm">OR</span>
      <div class="flex-1 border-t border-gray-300"></div>
    </div>

    <!-- Upload JSON file -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Upload JSON file
      </label>
      <input
        type="file"
        @change="onFileChange"
        accept=".json"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  <!-- Form title and content -->
  <div class="m-3">
    <h1 class="text-2xl font-bold mb-4">{{ data.title }}</h1>
  </div>

  <FormField v-for="field of data.fields" :key="field.ref" :field="field" />
</template>
