// routes/product-image.js
const express = require("express");
const multer = require("multer");
const db = require("../db");
const util = require("../util");

const router = express.Router();

// Store image in memory buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// POST /product-images/upload
router.post("/upload", upload.single("image"), (req, res) => {
  const { productId } = req.body;

  // Validate file and productId
  if (!req.file || !productId) {
    return res
      .status(400)
      .send(util.createResult("Missing image or productId", null));
  }

  const imageData = req.file.buffer;
  const mimeType = req.file.mimetype;

  // Optional: Validate productId is numeric
  if (!/^\d+$/.test(productId)) {
    return res
      .status(400)
      .send(util.createResult("Invalid productId format", null));
  }

  const statement = `
    INSERT INTO product_images (image_data, product_id, mime_type)
    VALUES (?, ?, ?)
  `;

  db.pool.query(
    statement,
    [imageData, productId, mimeType],
    (error, result) => {
      if (error) {
        console.error("Error inserting image:", error);
      }
      res.send(util.createResult(error, result));
    }
  );
});


router.get("/image/:imageId", (req, res) => {
  const { imageId } = req.params;

  const statement = `
    SELECT image_data, mime_type FROM product_images WHERE image_id = ?
  `;

  db.pool.query(statement, [imageId], (error, results) => {
    if (error || results.length === 0) {
      return res.status(404).send("Image not found");
    }

    const { image_data, mime_type } = results[0];
    res.set("Content-Type", mime_type || "image/jpeg"); // fallback
    res.send(image_data);
  });
});

// GET /product-images/product/:productId
router.get("/product/:productId", (req, res) => {
  const { productId } = req.params;

  const statement = `
    SELECT image_id FROM product_images WHERE product_id = ?
  `;

  db.pool.query(statement, [productId], (error, results) => {
    res.send(util.createResult(error, results));
  });
});

// DELETE /product-images/:imageId
router.delete("/:imageId", (req, res) => {
  const { imageId } = req.params;

  const statement = `
    DELETE FROM product_images WHERE image_id = ?
  `;

  db.pool.query(statement, [imageId], (error, result) => {
  if (error) return res.send(util.createResult(error, null));
  if (result.affectedRows === 0) {
    return res.status(404).send(util.createResult("Image not found", null));
  }
  res.send(util.createResult(null, result));
});

});

module.exports = router;
