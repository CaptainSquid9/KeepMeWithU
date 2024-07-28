const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Load service account credentials
const keyFile = "./mem2u-430622-19b5c17221bb.json";
const credentials = JSON.parse(fs.readFileSync(keyFile));

// Configure JWT client
const jwtClient = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/drive.readonly"]
);

// Enable CORS for all routes
app.use(cors());

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

// Route to get a random photo ID
app.get("/random-photo", async (req, res) => {
  try {
    const photoId = await fetchRandomPhoto();
    res.json({ photoId });
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).send("Error fetching photo");
  }
});

// Route to proxy the image content
app.get("/photo/:id", async (req, res) => {
  try {
    const drive = google.drive({ version: "v3", auth: jwtClient });
    const fileId = req.params.id;
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    response.data
      .on("end", () => {
        console.log("Done");
      })
      .on("error", (err) => {
        console.error("Error", err);
        res.status(500).send("Error fetching photo");
      })
      .pipe(res);
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).send("Error fetching photo");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
