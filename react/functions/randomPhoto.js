const { google } = require("googleapis");

// Load service account credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Configure JWT client
const jwtClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/drive.readonly"]
);

// Function to fetch a random photo
async function fetchRandomPhoto() {
  const drive = google.drive({ version: "v3", auth: jwtClient });
  const response = await drive.files.list({
    q: "mimeType contains 'image/'",
    fields: "files(id, name)",
  });
  const files = response.data.files;
  if (files.length > 0) {
    const randomIndex = Math.floor(Math.random() * files.length);
    return files[randomIndex].id;
  }
  return null;
}

exports.handler = async function (event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: "",
    };
  }

  try {
    const photoId = await fetchRandomPhoto();
    if (photoId) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ photoId }),
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: "No photos found",
      };
    }
  } catch (error) {
    console.error("Error fetching photo:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        error: "Error fetching photo",
        details: error.message,
      }),
    };
  }
};
