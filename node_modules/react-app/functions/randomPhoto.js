const { google } = require("googleapis");
const stream = require("stream");

// Load service account credentials from environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Configure JWT client
const jwtClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/drive.readonly"]
);

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
    const fileId = await fetchRandomPhoto();
    if (!fileId) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "No photos found" }),
      };
    }

    const drive = google.drive({ version: "v3", auth: jwtClient });
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    const bufferStream = new stream.PassThrough();
    response.data.pipe(bufferStream);

    let chunks = [];
    bufferStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    return new Promise((resolve, reject) => {
      bufferStream.on("end", () => {
        const responseBuffer = Buffer.concat(chunks);
        resolve({
          statusCode: 200,
          headers: {
            "Content-Type": "image/jpeg", // Adjust the content type as needed
            "Access-Control-Allow-Origin": "*",
          },
          body: responseBuffer.toString("base64"),
          isBase64Encoded: true,
        });
      });

      bufferStream.on("error", (err) => {
        console.error("Error", err);
        resolve({
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
          body: "Error fetching photo",
        });
      });
    });
  } catch (error) {
    console.error("Error fetching photo:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: "Error fetching photo",
    };
  }
};
