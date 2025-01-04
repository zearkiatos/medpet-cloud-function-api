const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const storage = admin.storage();

exports.generateUploadUrl = functions.https.onRequest(async (req, res) => {
  try {
    const fileName = req.body.fileName;
    const contentType = req.body.contentType;
    const bucket = storage.bucket();

    const file = bucket.file(fileName);
    const expires = Date.now() + 15 * 60 * 1000;

    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: expires,
      contentType: contentType,
    });

    res.status(200).send({uploadUrl: url});
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).send("Error generating signed URL");
  }
});
