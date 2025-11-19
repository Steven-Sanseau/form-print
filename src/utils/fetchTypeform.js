/**
 * Fetch Typeform data from the API via Netlify Function proxy
 * This avoids CORS issues by making requests server-side
 * @param {string} formId - Typeform form ID
 * @param {string} apiToken - Typeform Personal Access Token (optional for public forms)
 * @returns {Promise<Object>} - Typeform form data
 * @throws {Error} - If fetch fails
 */
export default async function fetchTypeform(formId, apiToken = null) {
  if (!formId) {
    throw new Error("Form ID is required");
  }

  // Use Netlify Function as proxy to avoid CORS issues
  const params = new URLSearchParams({ formId });
  if (apiToken) {
    params.append("token", apiToken);
  }

  const url = `/.netlify/functions/typeform-proxy?${params}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error(
          "This form requires authentication. Please provide your Typeform Personal Access Token."
        );
      }
      if (response.status === 403) {
        throw new Error(
          "Access forbidden. This form may be private or you may need a valid API token."
        );
      }
      if (response.status === 404) {
        throw new Error("Form not found. Please check the form ID or URL.");
      }
      throw new Error(
        errorData.error || `Failed to fetch form: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message.includes("fetch")) {
      throw new Error(
        "Network error. Please check your internet connection and try again."
      );
    }
    throw error;
  }
}
