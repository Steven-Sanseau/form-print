/**
 * Netlify Function to proxy Typeform API requests
 * This bypasses CORS restrictions by making requests server-side
 */

export async function handler(event) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Get form ID from query parameters
  const formId = event.queryStringParameters?.formId;

  if (!formId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'formId parameter is required' }),
    };
  }

  // Get optional API token from query or header
  const apiToken =
    event.queryStringParameters?.token ||
    event.headers['x-typeform-token'];

  const url = `https://api.typeform.com/forms/${formId}`;

  const headers = {};
  if (apiToken) {
    headers.Authorization = `Bearer ${apiToken}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: `Typeform API error: ${response.statusText}`,
          details: errorBody,
        }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, x-typeform-token',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch from Typeform API',
        message: error.message,
      }),
    };
  }
}
