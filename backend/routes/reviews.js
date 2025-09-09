const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require("../util");

// Get all reviews
router.get("/", (req, res) => {
  const statement = `
    SELECT 
      r.review_id,
      r.review_text,
      r.rating,
      r.review_date,
      p.name AS product_name,
      u.username AS reviewer
    FROM reviews r
    LEFT JOIN products p ON r.product_id = p.product_id
    LEFT JOIN users u ON r.user_id = u.user_id;
  `;

  db.pool.query(statement, (error, result) => {
    if (error) {
      res.send(util.createError("No reviews found"));
    } else {
      res.send(util.createResult(error, result));
    }
  });
});

// Get reviews by product ID
router.get("/:product_id", (req, res) => {
  const { product_id } = req.params;

  const statement = `
    SELECT 
      r.review_id AS id,
      r.review_text AS reviewText,
      r.rating,
      r.review_date AS reviewDate,
      p.name AS productName,
      u.username AS reviewer
    FROM reviews r
    LEFT JOIN products p ON r.product_id = p.product_id
    LEFT JOIN users u ON r.user_id = u.user_id
    WHERE r.product_id = ?;
  `;

  db.pool.query(statement, [product_id], (error, result) => {
    if (error) {
      console.error("Database error:", error);
      return res.send(util.createError("Database query failed", error));
    }

    if (result.length === 0) {
      return res.send(util.createError("No reviews found"));
    }

    res.send(util.createResult(null, result));
  });
});

// Delete review by ID
router.delete("/:reviewId", (req, res) => {
  const { reviewId } = req.params;

  const statement = `
    DELETE FROM reviews WHERE review_id = ?;
  `;

  db.pool.query(statement, [reviewId], (error, result) => {
    if (error) {
      console.error("DB error:", error);
      res.send(util.createError("Failed to delete review", error));
    } else if (result.affectedRows === 0) {
      res.send(util.createError("No review found with the given ID"));
    } else {
      res.send(util.createResult(
        null,
        `Review with ID ${reviewId} deleted successfully`
      ));
    }
  });
});

// Add a new review
router.post("/", (req, res) => {
  const { userId, productId, rating, reviewText } = req.body;

  // Check if user and product exist
  const checkUser = `
    SELECT * FROM users WHERE user_id = ?;
  `;
  db.pool.query(checkUser, [userId], (error, userResult) => {
    if (error || userResult.length === 0) {
      return res.send(util.createError("User not found"));
    }

    const checkProduct = `
      SELECT * FROM products WHERE product_id = ?;
    `;
    db.pool.query(checkProduct, [productId], (error, productResult) => {
      if (error || productResult.length === 0) {
        return res.send(util.createError("Product not found"));
      }

      const insertReview = `
        INSERT INTO reviews (user_id, product_id, rating, review_text)
        VALUES (?, ?, ?, ?);
      `;
      db.pool.query(insertReview, [userId, productId, rating, reviewText], (error, result) => {
        if (error) {
          return res.send(util.createError("Failed to add review"));
        }
        res.send(util.createResult(
          null,
          `Added new review with ID ${result.insertId}`
        ));
      });
    });
  });
});

module.exports = router;
