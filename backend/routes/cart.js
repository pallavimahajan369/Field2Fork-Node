const express = require("express");
const db = require("../db");
const util = require("../util");

const router = express.Router();

// GET all carts
router.get("/", (req, res) => {
  const statement = `SELECT * FROM cart`;
  db.pool.query(statement, (error, result) => {
    res.status(error ? 500 : 200).send(util.createResult(error, result));
  });
});

// GET items in a cart
router.get("/:cartId", (req, res) => {
  const { cartId } = req.params;
  const statement = `SELECT * FROM cart_items WHERE cart_id = ?`;

  db.pool.query(statement, [cartId], (error, result) => {
    if (error) {
      console.error("❌ Failed to fetch cart items:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ cartItems: result }); // ✅ match frontend expectations
    }
  });
});


// DELETE item from a cart
router.delete("/:cartId/items/:cartItemId", (req, res) => {
  const { cartId, cartItemId } = req.params;
  const statement = `DELETE FROM cart_items WHERE cart_id = ? AND cart_item_id = ?`;
  db.pool.query(statement, [cartId, cartItemId], (error, result) => {
    res.status(error ? 500 : 200).send(util.createResult(error, result));
  });
});

// ADD items to a cart (with transaction)
router.post("/add", async (req, res) => {
  const { userId, cartItems } = req.body;
  const connection = await db.pool.promise().getConnection();
  
  try {
    await connection.beginTransaction();

    // Check if user exists
    const [userRows] = await connection.query(`SELECT * FROM users WHERE user_id = ?`, [userId]);
    if (userRows.length === 0) {
      await connection.rollback();
      return res.status(404).send(util.createError("User not found"));
    }

    // Check if cart exists
    let [cartRows] = await connection.query(`SELECT * FROM cart WHERE user_id = ?`, [userId]);
    let cartId;

    if (cartRows.length === 0) {
      const [result] = await connection.query(`INSERT INTO cart (user_id) VALUES (?)`, [userId]);
      cartId = result.insertId;
    } else {
      cartId = cartRows[0].cart_id;
    }

    // Loop through cartItems
    for (const item of cartItems) {
      const { product_id, quantity } = item;

      // Check if product exists
      const [productRows] = await connection.query(`SELECT * FROM products WHERE product_id = ?`, [product_id]);
      if (productRows.length === 0) {
        await connection.rollback();
        return res.status(404).send(util.createError(`Product with id ${product_id} not found`));
      }

      const pricePerUnit = productRows[0].price_per_unit;
      const totalPrice = pricePerUnit * quantity;

      // Check if item already in cart
      const [existingItems] = await connection.query(
        `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`,
        [cartId, product_id]
      );

      if (existingItems.length > 0) {
        // Update quantity & price
        const newQuantity = existingItems[0].quantity + quantity;
        const updatedPrice = pricePerUnit * newQuantity;

        await connection.query(
          `UPDATE cart_items SET quantity = ?, price = ? WHERE cart_id = ? AND product_id = ?`,
          [newQuantity, updatedPrice, cartId, product_id]
        );
      } else {
        // Insert new item
        await connection.query(
          `INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
          [cartId, product_id, quantity, totalPrice]
        );
      }
    }

    await connection.commit();
    res.status(200).send(util.createResult(null, "Items added to cart successfully"));
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).send(util.createError("Failed to add items to cart"));
  } finally {
    connection.release();
  }
});

// ✅ GET cart by userId (to fetch cart_id for a user)
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const statement = `SELECT * FROM cart WHERE user_id = ?`;
  db.pool.query(statement, [userId], (error, result) => {
    if (error) {
      console.error("Error fetching cart for user:", error);
      return res.status(500).send(util.createError("Internal server error"));
    }

    if (result.length === 0) {
      return res.status(404).send(util.createError("No cart found for user"));
    }

    // Send the first (and only) cart for the user
    res.status(200).send(util.createResult(null, { cart: result[0] }));
  });
});
router.put('/update', async (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId || typeof quantity !== 'number') {
    return res.status(400).json({ message: "Invalid itemId or quantity" });
  }

  try {
    const cartItem = await CartItem.findByPk(itemId);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
