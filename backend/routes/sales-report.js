// backend/routes/salesReport.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const util = require("../util");

router.get("/:user_id", async (req, res) => {
  // console.log(user_id);
  const { user_id } = req.params;

  const getOrderItemsQuery = `
    SELECT 
      oi.order_item_id,
      oi.quantity,
      oi.price,
      p.product_id,
      p.name AS product_name,
      o.order_id
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE p.user_id = ?
  `;

  try {
    db.pool.query(getOrderItemsQuery, [user_id], (error, results) => {
      if (error) {
        return res.send(util.createError("Error fetching order items", error));
      }

      if (!results.length) {
        return res.send(util.createResult(null, {
          totalOrders: 0,
          totalRevenue: 0,
          totalItemsSold: 0,
          productSales: []
        }));
      }

      const totalItemsSold = results.reduce((sum, item) => sum + item.quantity, 0);
      const totalRevenue = results.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const uniqueOrderIds = new Set(results.map(item => item.order_id));
      const totalOrders = uniqueOrderIds.size;

      const productSalesMap = new Map();

      for (const item of results) {
        const productId = item.product_id;
        if (!productSalesMap.has(productId)) {
          productSalesMap.set(productId, {
            productId,
            productName: item.product_name,
            orderCount: new Set([item.order_id]),
            itemsSold: item.quantity,
            revenue: item.price * item.quantity
          });
        } else {
          const data = productSalesMap.get(productId);
          data.orderCount.add(item.order_id);
          data.itemsSold += item.quantity;
          data.revenue += item.price * item.quantity;
        }
      }

      const productSales = Array.from(productSalesMap.values()).map(ps => ({
        productId: ps.productId,
        productName: ps.productName,
        orderCount: ps.orderCount.size,
        itemsSold: ps.itemsSold,
        revenue: ps.revenue
      }));

      const report = {
        totalOrders,
        totalRevenue,
        totalItemsSold,
        productSales
      };

      res.send(util.createResult(null, report));
    });
  } catch (err) {
    res.send(util.createError("Unexpected error", err));
  }
});

module.exports = router;
