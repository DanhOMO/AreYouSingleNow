const { google } = require("googleapis");
const fs = require("fs");
const formidable = require("formidable");
const path = require("path");

const KEY_FILE_PATH = path.join(
  process.cwd(),
  "dating-app-drive-storage-b4c955288c63.json"
);

const FOLDER_ID = "1y5HMcH2ixlID5qdOl6rwJekt75xqTMrn";

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const driveService = google.drive({ version: "v3", auth });

exports.uploadImage = async (req, res) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!files.image) {
      return res
        .status(400)
        .json({ error: "Không tìm thấy file với tên 'image'" });
    }
    const file = files.image[0];

    const fileMetadata = {
      name: `${Date.now()}-${file.originalFilename}`,
      parents: [FOLDER_ID],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.filepath),
    };

    try {
      const uploaded = await driveService.files.create({
        resource: fileMetadata,
        media,
        fields: "id",
      });

      const fileId = uploaded.data.id;

      await driveService.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const viewLink = `https://drive.google.com/uc?id=${fileId}`;

      res.status(200).json({ success: true, url: viewLink });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message });
    }
  });
};
