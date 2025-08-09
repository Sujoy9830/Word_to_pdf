// backend/server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import puppeteer from "puppeteer";

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });

// POST /convert-docx
// Accepts multipart/form-data with single file field 'file'
app.post("/convert-docx", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const uploadedPath = req.file.path;
  const originalName = req.file.originalname || "document.docx";

  try {
    // Convert docx to HTML using mammoth
    const { value: html, messages } = await mammoth.convertToHtml({ path: uploadedPath });
    // Optional: wrap into a basic HTML document with simple styling
    const fullHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${originalName}</title>
          <style>
            /* Basic printable styles - adjust as needed */
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; padding: 40px; color: #111; line-height: 1.35; }
            img { max-width: 100%; height: auto; }
            p { margin: 0 0 10px; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Launch puppeteer and render PDF
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
    });
    await browser.close();

    // Send PDF back as attachment
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${path.parse(originalName).name}.pdf"`,
      "Content-Length": pdfBuffer.length,
    });
    return res.send(pdfBuffer);
  } catch (err) {
    console.error("Conversion error:", err);
    return res.status(500).json({ error: "Failed to convert file." });
  } finally {
    // Clean up uploaded file
    try { await fs.unlink(uploadedPath); } catch (e) { /* ignore */ }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));

