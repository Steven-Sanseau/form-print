import { ref, computed } from "vue";

const translations = {
  en: {
    app: {
      title: "Typeform Overview",
    },
    loader: {
      title: "Load Typeform",
      urlLabel: "Typeform URL or ID",
      urlPlaceholder: "https://xxx.typeform.com/to/FormID or FormID",
      loadButton: "Load",
      loading: "Loading...",
      apiTokenSection: "API Token (optional - for private forms only)",
      apiTokenLabel: "Typeform Personal Access Token",
      apiTokenLink: "Get your token",
      apiTokenPlaceholder: "Only needed for private forms",
      or: "OR",
      uploadLabel: "Upload JSON file",
    },
    logic: {
      always: "Always",
      if: "If",
      and: "and",
      or: "or",
      this: "this",
      jumpTo: "Jump to",
      jumpToThankYou: "Jump to Thank you",
    },
    errors: {
      urlRequired: "Please enter a Typeform URL or ID",
      invalidUrl:
        "Invalid Typeform URL. Please use format: https://xxx.typeform.com/to/FormID",
      formNotFound: "Form not found. Please check the form ID or URL.",
      authRequired:
        "This form requires authentication. Please provide your Typeform Personal Access Token.",
      accessForbidden:
        "Access forbidden. This form may be private or you may need a valid API token.",
      networkError:
        "Network error. Please check your internet connection and try again.",
      fileError: "Error loading file",
    },
  },
  fr: {
    app: {
      title: "Aperçu Typeform",
    },
    loader: {
      title: "Charger un Typeform",
      urlLabel: "URL ou ID Typeform",
      urlPlaceholder: "https://xxx.typeform.com/to/FormID ou FormID",
      loadButton: "Charger",
      loading: "Chargement...",
      apiTokenSection: "Token API (optionnel - uniquement pour les formulaires privés)",
      apiTokenLabel: "Token d'accès personnel Typeform",
      apiTokenLink: "Obtenir votre token",
      apiTokenPlaceholder: "Nécessaire uniquement pour les formulaires privés",
      or: "OU",
      uploadLabel: "Télécharger un fichier JSON",
    },
    logic: {
      always: "Toujours",
      if: "Si",
      and: "et",
      or: "ou",
      this: "ceci",
      jumpTo: "Aller à",
      jumpToThankYou: "Aller à la page de remerciement",
    },
    errors: {
      urlRequired: "Veuillez entrer une URL ou un ID Typeform",
      invalidUrl:
        "URL Typeform invalide. Utilisez le format: https://xxx.typeform.com/to/FormID",
      formNotFound:
        "Formulaire introuvable. Vérifiez l'ID ou l'URL du formulaire.",
      authRequired:
        "Ce formulaire nécessite une authentification. Veuillez fournir votre token d'accès personnel Typeform.",
      accessForbidden:
        "Accès refusé. Ce formulaire est peut-être privé ou vous avez besoin d'un token API valide.",
      networkError:
        "Erreur réseau. Vérifiez votre connexion Internet et réessayez.",
      fileError: "Erreur lors du chargement du fichier",
    },
  },
};

// Get browser language or default to 'en'
const getBrowserLanguage = () => {
  const browserLang = navigator.language.split("-")[0];
  return translations[browserLang] ? browserLang : "en";
};

const currentLocale = ref(localStorage.getItem("locale") || getBrowserLanguage());

// Helper function to get translation directly (for use outside Vue components)
export function getTranslation(key) {
  const keys = key.split(".");
  let value = translations[currentLocale.value];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

export function useI18n() {
  const locale = computed({
    get: () => currentLocale.value,
    set: (value) => {
      currentLocale.value = value;
      localStorage.setItem("locale", value);
    },
  });

  const t = (key) => {
    return getTranslation(key);
  };

  return {
    locale,
    t,
  };
}
