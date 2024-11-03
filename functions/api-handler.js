exports.handler = async (event, context) => {
  // Log incoming request
  console.log('Incoming request:', {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers,
    body: event.body
  });

  // Set CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };

  // Handle OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 204,
      headers,
      body: ""
    };
  }

  // Handle POST request
  if (event.httpMethod === "POST") {
    try {
      console.log('Handling POST request');
      // Process the POST request here
      // For example:
      // const body = JSON.parse(event.body);
      // const result = await processRequest(body);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "POST request processed successfully" })
      };
    } catch (error) {
      console.error('Error processing POST request:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Internal Server Error" })
      };
    }
  }

  // Handle other HTTP methods
  console.log('Handling unsupported method:', event.httpMethod);
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method Not Allowed" })
  };
};
