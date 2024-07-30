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

exports.handler = async function (event, context) {
  try {
    const drive = google.drive({ version: "v3", auth: jwtClient });
    const fileId = event.path.split("/").pop();
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    let data = "";
    response.data.on("data", (chunk) => {
      data += chunk;
    });
    response.data.on("end", () => {
      return {
        statusCode: 200,
        headers: { "Content-Type": "image/jpeg" },
        body: data,
        isBase64Encoded: true,
      };
    });
    response.data.on("error", (error) => {
      console.error("Error streaming photo:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Error streaming photo",
          details: error.message,
        }),
      };
    });
  } catch (error) {
    console.error("Error fetching photo:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Error fetching photo",
        details: error.message,
      }),
    };
  }
};
