const { google } = require("googleapis");
const fs = require("fs");

// Load service account credentials
const keyFile = "mem2u-430622-19b5c17221bb.json";
const credentials = JSON.parse(fs.readFileSync(keyFile));

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
  try {
    const photoId = await fetchRandomPhoto();
    if (photoId) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow requests from any origin
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
