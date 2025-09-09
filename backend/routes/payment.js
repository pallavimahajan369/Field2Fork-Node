// const express = require("express");
// const router = express.Router();
// const db = require("../db");
// const util = require("../util");
// const Razorpay = require("razorpay");
// const crypto = require("crypto");

// const razorpay = new Razorpay({
//   key_id: process.env.KEY_ID,
//   key_secret: process.env.KEY_SECRET,
// });

// // Get payment by ID
// router.get("/payment/:id", async (req, res) => {
//   const paymentId = req.params.id;
//   try {
//     const [rows] = await db.pool.query("SELECT * FROM payments WHERE payment_id = ?", [paymentId]);

//     if (rows.length === 0) {
//       return res.status(404).send(util.createResult("Payment not found", null));
//     }

//     return res.send(util.createResult(null, rows[0]));
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send(util.createResult("Failed to fetch payment", null));
//   }
// });

// // Process a payment
// router.post("/payment", async (req, res) => {
//   const {
//     amount,
//     orderId,
//     razorpayPaymentId,
//     razorpayOrderId,
//     razorpaySignature,
//     paymentStatus,
//     paymentMethod,
//   } = req.body;

//   const conn = await db.pool.getConnection();

//   try {
//     await conn.beginTransaction();

//     // Fetch order
//     const [orders] = await conn.query("SELECT * FROM orders WHERE order_id = ?", [orderId]);
//     if (orders.length === 0) {
//       await conn.rollback();
//       return res.status(404).send(util.createResult("Order not found", null));
//     }

//     // Validate Razorpay signature if payment is successful
//     if (paymentStatus.toUpperCase() === "SUCCESS") {
//       const generatedSignature = crypto
//         .createHmac("sha256", process.env.KEY_SECRET)
//         .update(razorpayOrderId + "|" + razorpayPaymentId)
//         .digest("hex");

//       if (generatedSignature !== razorpaySignature) {
//         await conn.rollback();
//         return res.status(400).send(util.createResult("Invalid Razorpay signature", null));
//       }

//       // Update order status to 'CONFIRMED'
//       await conn.query("UPDATE orders SET order_status = 'CONFIRMED' WHERE order_id = ?", [orderId]);

//       // Clear cart items
//       await conn.query(
//         `DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = (SELECT user_id FROM orders WHERE order_id = ?))`,
//         [orderId]
//       );
//     } else {
//       // If payment failed, set order status to 'FAILED'
//       await conn.query("UPDATE orders SET order_status = 'FAILED' WHERE order_id = ?", [orderId]);
//     }

//     // Insert payment record
//     const paymentDate = new Date();
//     const [result] = await conn.query(
//       `INSERT INTO payments (amount, payment_method, payment_status, payment_date, razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id)
//        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//       [amount, paymentMethod, paymentStatus, paymentDate, razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId]
//     );

//     // Commit transaction
//     await conn.commit();

//     const paymentRecord = {
//       payment_id: result.insertId,
//       amount,
//       payment_method: paymentMethod,
//       payment_status: paymentStatus,
//       payment_date: paymentDate,
//       razorpay_order_id: razorpayOrderId,
//       razorpay_payment_id: razorpayPaymentId,
//       razorpay_signature: razorpaySignature,
//       order_id: orderId,
//     };

//     return res.send(util.createResult(null, paymentRecord));

//   } catch (err) {
//     console.error("Error processing payment:", err);
//     await conn.rollback();
//     return res.status(500).send(util.createResult("Failed to process payment", null));
//   } finally {
//     conn.release();
//   }
// });

// module.exports = router;

