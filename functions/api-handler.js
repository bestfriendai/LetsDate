exports.handler = async (event, context) => {
  // Set CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };

  // Handle OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: ""
    };
  }

  // Handle POST request
  if (event.httpMethod === "POST") {
    try {
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Internal Server Error" })
      };
    }
  }

  // Handle other HTTP methods
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method Not Allowed" })
  };
};
