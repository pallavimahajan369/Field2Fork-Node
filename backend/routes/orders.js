const express = require('express');
const db = require('../db');
const util = require('../util');

const router = express.Router();

// Define valid order statuses
const validStatuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'CONFIRMED', 'FAILED'];

// GET all orders
router.get("/", (req, res) => {
  const statement = `
    SELECT order_id, order_date, total_amount, order_status FROM orders
  `;
  db.pool.query(statement, (error, result) => {
    if (error) {
      res.send(util.createError("No orders found"));
    } else {
      res.send(util.createResult(null, result));
    }
  });
});

// GET orders by user ID
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;
  const statement = `
    SELECT order_id, order_date, total_amount, order_status FROM orders WHERE user_id = ?
  `;
  db.pool.query(statement, [userId], (error, result) => {
    if (error) {
      res.send(util.createError("No orders found"));
    } else {
      res.send(util.createResult(null, result));
    }
  });
});

// GET all order items
router.get('/items', (req, res) => {
  const query = `
    SELECT * FROM order_items
  `;
  db.pool.query(query, (error, results) => {
    if (error) {
      res.send(util.createError('Failed to fetch order items'));
    } else {
      res.send(util.createResult(null, results));
    }
  });
});

// GET order items by order ID
router.get('/:orderId/items', (req, res) => {
  const { orderId } = req.params;
  const query = `
    SELECT * FROM order_items WHERE order_id = ?
  `;
  db.pool.query(query, [orderId], (error, results) => {
    if (error) {
      res.send(util.createError('Failed to fetch order items'));
    } else if (results.length === 0) {
      res.send(util.createError(`No items found for order ID ${orderId}`));
    } else {
      res.send(util.createResult(null, results));
    }
  });
});

// POST place a new order
router.post("/", async (req, res) => {
  const { user_id } = req.user || {};
  const { orderItems } = req.body;

  if (!user_id || !Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json(util.createError("Invalid request"));
  }

  const connection = await db.pool.getConnection();
  await connection.beginTransaction();

  try {
    const orderStatus = "PENDING";
    const order_date = new Date();
    const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    let totalAmount = 0;

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_status, order_date, delivery_date, total_amount) VALUES (?, ?, ?, ?, ?)`,
      [user_id, orderStatus, order_date, deliveryDate, 0]
    );

    const order_id = orderResult.insertId;

    for (const item of orderItems) {
      const [productRows] = await connection.execute(
        `SELECT price_per_unit FROM products WHERE product_id = ?`,
        [item.productId]
      );

      if (productRows.length === 0) {
        throw new Error(`Product not found with ID ${item.productId}`);
      }

      const product = productRows[0];
      const itemTotal = product.price_per_unit * item.quantity;
      totalAmount += itemTotal;

      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [order_id, item.productId, item.quantity, itemTotal]
      );
    }

    await connection.execute(
      `UPDATE orders SET total_amount = ? WHERE order_id = ?`,
      [totalAmount, order_id]
    );

    await connection.commit();
    res.send(util.createResult("Order Placed Successfully", { order_id }));
  } catch (error) {
    await connection.rollback();
    console.error("Order Failed:", error);
    res.send(util.createError("Order Failed", error.message));
  } finally {
    connection.release();
  }
});

// PATCH update order status
router.patch('/:orderId/status', async (req, res) => {
  const { orderId } = req.params;
  let { newStatus } = req.body;

  if (!newStatus || typeof newStatus !== 'string') {
    return res.send(util.createError("New status is required"));
  }

  newStatus = newStatus.trim().toUpperCase();

  if (!validStatuses.includes(newStatus)) {
    return res.send(util.createError(`Invalid status. Allowed: ${validStatuses.join(', ')}`));
  }

  try {
    const [result] = await db.pool.query(
      `UPDATE orders SET order_status = ? WHERE order_id = ?`,
      [newStatus, orderId]
    );

    if (result.affectedRows === 0) {
      return res.send(util.createError("Order not found"));
    }

    res.send(util.createResult("Order status updated successfully"));
  } catch (err) {
    console.error(err.message);
    res.send(util.createError("Something went wrong while updating status"));
  }
});

module.exports = router;
