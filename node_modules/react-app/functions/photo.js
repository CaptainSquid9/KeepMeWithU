const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Load service account credentials
const keyFile = path.resolve(
  __dirname,
  "../path/to/your/service-account-file.json"
);
const credentials = JSON.parse(fs.readFileSync(keyFile));

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
  } catch (error) {
    console.error("Error fetching photo:", error);
    return {
      statusCode: 500,
      body: "Error fetching photo",
    };
  }
};
