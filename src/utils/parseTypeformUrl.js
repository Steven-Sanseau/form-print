/**
 * Extract Typeform ID from various Typeform URL formats
 * @param {string} url - Typeform URL
 * @returns {string|null} - Extracted form ID or null
 *
 * Examples:
 * - https://4xmr70ckan3.typeform.com/to/Gjl34w73 -> Gjl34w73
 * - https://form.typeform.com/to/Gjl34w73 -> Gjl34w73
 * - Gjl34w73 -> Gjl34w73
 */
export default function parseTypeformUrl(url) {
  if (!url) return null;

  // Remove whitespace
  url = url.trim();

  // If it's already just an ID (alphanumeric string without slashes)
  if (/^[a-zA-Z0-9]+$/.test(url)) {
    return url;
  }

  // Try to match /to/{id} pattern
  const toMatch = url.match(/\/to\/([a-zA-Z0-9]+)/);
  if (toMatch) {
    return toMatch[1];
  }

  // Try to match /forms/{id} pattern (API URL)
  const formsMatch = url.match(/\/forms\/([a-zA-Z0-9]+)/);
  if (formsMatch) {
    return formsMatch[1];
  }

  return null;
}
