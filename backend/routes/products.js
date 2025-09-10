const express = require("express");
const util = require("../util");
const db = require("../db");

const router = express.Router();

// Allowed categories
const allowedCategories = [
  "FRUITS",
  "VEGETABLES",
  "GRAINS_PULSES",
  "DAIRY_PRODUCTS",
  "MEAT_POULTRY",
  "SEAFOOD",
  "EGGS",
  "HERBS_SPICES",
  "HONEY_SWEETENERS",
  "NUTS_SEEDS",
  "BEVERAGES",
  "ORGANIC_SPECIALTY_FOODS",
  "BAKERY_HOMEMADE_GOODS",
  "OILS_CONDIMENTS",
  "HANDMADE_ARTISAN_PRODUCTS",
];

// Allowed product status (enum values)
const allowedStatus = ["LOW_STOCK", "IN_STOCK", "OUT_OF_STOCK"];

// Add a new product
router.post("/add", (req, res) => {
  const {
    name,
    description,
    price_per_unit,
    stock_quantity,
    status,
    category,
  } = req.body;
  const user_id = req.body.user_id;
  console.log("Received body:", req.body);

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      status: "error",
      error: `Invalid category. Must be one of: ${allowedCategories.join(
        ", "
      )}`,
    });
  }

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      status: "error",
      error: `Invalid status. Must be one of: ${allowedStatus.join(", ")}`,
    });
  }

  const statement = `
    INSERT INTO products (name, description, price_per_unit, stock_quantity, status, category, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.pool.execute(
    statement,
    [
      name,
      description,
      price_per_unit,
      stock_quantity,
      status,
      category,
      user_id,
    ],
    (error, result) => {
      if (error) {
        console.error("DB Error:", error);
        res.status(500).send(util.createError("Product not added", error));
      } else {
        res.status(201).send(util.createResult(null, result));
        console.log("Returning products:", result);
      }
    }
  );
});

router.get("/categories", (req, res) => {
  const statement = `
    SELECT DISTINCT category FROM products WHERE category IS NOT NULL
  `;
  db.pool.query(statement, (error, result) => {
    if (error) {
      res.status(500).send(util.createError("Database query failed", error));
    } else if (result.length === 0) {
      res.status(404).send(util.createError("No categories found"));
    } else {
      res.status(200).json({
        status: "success",
        data: result,
      });
    }
  });
}) ;

// Get a product by product_id
router.get("/:product_id", (req, res) => {
  const { product_id } = req.params;

  const statement = `
    SELECT 
      product_id as id,
      name,
      description,
      price_per_unit as pricePerUnit,
      stock_quantity as stockQuantity,
      status,
      category,
      user_id
    FROM products WHERE product_id = ?
  `;

  db.pool.query(statement, [product_id], (error, result) => {
    if (error) {
      res.status(500).send(util.createError("Database query error", error));
    } else if (result.length === 0) {
      res.status(404).send("No such product with given Id");
    } else {
      res.status(200).send(util.createSuccess(result[0]));
    }
  });
});

// Update product details
router.put("/:product_id", (req, res) => {
  const { product_id } = req.params;
  const {
    name,
    description,
    price_per_unit,
    stock_quantity,
    status,
    category,
  } = req.body;

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      status: "error",
      error: `Invalid category. Must be one of: ${allowedCategories.join(
        ", "
      )}`,
    });
  }

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({
      status: "error",
      error: `Invalid status. Must be one of: ${allowedStatus.join(", ")}`,
    });
  }

  const statement = `
    UPDATE products 
    SET name=?, description=?, price_per_unit=?, stock_quantity=?, status=?, category=?
    WHERE product_id=?
  `;

  db.pool.execute(
    statement,
    [
      name,
      description,
      price_per_unit,
      stock_quantity,
      status,
      category,
      product_id,
    ],
    (error, result) => {
      if (error) {
        res
          .status(500)
          .send(util.createError("Failed to update product", error));
      } else {
        res.status(200).send(util.createResult(null, result));
      }
    }
  );
});

router.put("/restore/:productId", (req, res) => {
  const { productId } = req.params;
  const sql = `UPDATE products SET active_status = 1 WHERE product_id = ?`;

  db.pool.query(sql, [productId], (err, result) => {
    res.send(util.createResult(err, result));
  });
});

// Get all products
router.get("/", (req, res) => {
  const statement = `
    SELECT product_id, name, description, price_per_unit, stock_quantity, status, category, active_status
    FROM products
  `;
  db.pool.query(statement, (error, result) => {
    if (error) {
      res.status(500).send(util.createError("Product not found", error));
    } else {
      res.status(200).send(util.createResult(null, result)); // ✅ Fix here
    }
  });
});

// Get products by sellerId
router.get("/seller/:sellerId", (req, res) => {
  const { sellerId } = req.params;
  const statement = `
    SELECT product_id, name, description, price_per_unit, stock_quantity, status, category, active_status 
    FROM products WHERE user_id = ?
  `;
  db.pool.query(statement, [sellerId], (error, result) => {
    if (error) {
      res.status(500).send(util.createError("Database query failed", error));
    } else if (result.length === 0) {
      res
        .status(404)
        .send(util.createError("No products found for this seller"));
    } else {
      res.status(200).send(util.createResult(null, result));
    }
  });
});

// Get products by category
router.get("/category/:category", (req, res) => {
  const { category } = req.params;

  const statement = `
    SELECT product_id, name, description, price_per_unit, stock_quantity, status 
    FROM products WHERE category = ?
  `;
  db.pool.query(statement, [category], (error, result) => {
    if (error) {
      res.status(500).send(util.createError("Database query failed", error));
    } else if (result.length === 0) {
      res
        .status(404)
        .send(util.createError("No products found in this category"));
    } else {
      res.status(200).send(util.createResult(null, result));
    }
  });
});

// Mark a product as deleted (soft delete)
router.patch("/:productId", (req, res) => {
  const { productId } = req.params;
  const statement = `
    UPDATE products SET active_status = 0 WHERE product_id = ?
  `;
  db.pool.query(statement, [productId], (error, items) => {
    if (error) {
      res.status(500).send(util.createError("Failed to delete product", error));
    } else {
      res.status(200).send(util.createResult(null, items));
    }
  });
});

// Restore a deleted product (soft delete restore)
// router.patch("/:productId/restore", (req, res) => {
//   const { productId } = req.params;
//   const statement = `
//     UPDATE products SET active_status = 1 WHERE product_id = ?
//   `;
//   db.pool.query(statement, [productId], (error, items) => {
//     if (error) {
//       res
//         .status(500)
//         .send(util.createError("Failed to restore product", error));
//     } else {
//       res.status(200).send(util.createResult(null, items));
//     }
//   });
// });

module.exports = router;
