const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Get the Koyeb backend URL from the environment variables
  const KOYEB_BACKEND_URL = process.env.KOYEB_BACKEND_URL;

  // Get the path and query parameters from the incoming request
  const path = event.path.replace('/.netlify/functions/proxy', '');
  const queryString = event.queryStringParameters ? `?${new URLSearchParams(event.queryStringParameters).toString()}` : '';
  const fullUrl = `${KOYEB_BACKEND_URL}/api${path}${queryString}`;

  try {
    const response = await fetch(fullUrl, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
      },
      body: event.body,
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to proxy request to the backend.' }),
    };
  }
};
