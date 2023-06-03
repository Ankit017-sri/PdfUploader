const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for saving
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF file uploaded" });
  }
  res.json({ message: "PDF uploaded successfully" });
});

router.get("/files/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ error: "File not found" });
    }

    res.sendFile(filePath);
  });
});

router.get("/files", (req, res) => {
  const uploadsPath = path.join(__dirname, "uploads");
  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch files" });
    }

    const fileList = files.map((file) => {
      const filePath = path.join(uploadsPath, file);
      const stats = fs.statSync(filePath);
      return {
        filename: file,
        size: stats.size,
      };
    });

    res.json({ files: fileList });
  });
});

router.delete("/files/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete file" });
    }

    res.json({ message: "File deleted successfully" });
  });
});

module.exports = router;

