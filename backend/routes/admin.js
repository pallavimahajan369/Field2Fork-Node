const express = require('express');
const db = require('../db');
const util = require('../util');
const router = express.Router();

router.get('/dashboard-stats', (req, res) => {
  const stats = {};

  db.pool.query(`SELECT COUNT(*) AS totalUsers FROM users WHERE role != 'ADMIN'`, (err, userRows) => {
    if (err) return res.send(util.createError(err));
    stats.totalUsers = userRows[0].totalUsers;

    db.pool.query(`SELECT COUNT(*) AS totalBuyers FROM users WHERE role = 'BUYER'`, (err, buyerRows) => {
      if (err) return res.send(util.createError(err));
      stats.totalBuyers = buyerRows[0].totalBuyers;

      db.pool.query(`SELECT COUNT(*) AS totalSellers FROM users WHERE role = 'SELLER'`, (err, sellerRows) => {
        if (err) return res.send(util.createError(err));
        stats.totalSellers = sellerRows[0].totalSellers;

        db.pool.query(`SELECT COUNT(*) AS totalProducts FROM products`, (err, productRows) => {
          if (err) return res.send(util.createError(err));
          stats.totalProducts = productRows[0].totalProducts;

          db.pool.query(`SELECT COUNT(*) AS totalOrders FROM orders`, (err, orderRows) => {
            if (err) return res.send(util.createError(err));
            stats.totalOrders = orderRows[0].totalOrders;

            db.pool.query(
              `SELECT COUNT(*) AS successfulTransactions FROM payments WHERE payment_status = 'SUCCESS'`,
              (err, paymentRows) => {
                if (err) return res.send(util.createError(err));
                stats.successfulTransactions = paymentRows[0].successfulTransactions;

                // ✅ New queries for activity stats (pie chart)
                db.pool.query(`
                  SELECT 
                    (SELECT COUNT(*) FROM users WHERE role != 'ADMIN' AND active_status = 1) AS activeUsers,
                    (SELECT COUNT(*) FROM users WHERE role != 'ADMIN' AND active_status = 0) AS inactiveUsers,
                    (SELECT COUNT(*) FROM users WHERE role = 'BUYER' AND active_status = 1) AS activeBuyers,
                    (SELECT COUNT(*) FROM users WHERE role = 'BUYER' AND active_status = 0) AS inactiveBuyers,
                    (SELECT COUNT(*) FROM users WHERE role = 'SELLER' AND active_status = 1) AS activeSellers,
                    (SELECT COUNT(*) FROM users WHERE role = 'SELLER' AND active_status = 0) AS inactiveSellers,
                    (SELECT COUNT(*) FROM products WHERE active_status = 1) AS activeProducts,
                    (SELECT COUNT(*) FROM products WHERE active_status = 0) AS inactiveProducts
                `, (err, activityRows) => {
                  if (err) return res.send(util.createError(err));
                  
                  const activity = activityRows[0];
                  stats.activeUsers = activity.activeUsers;
                  stats.inactiveUsers = activity.inactiveUsers;
                  stats.activeBuyers = activity.activeBuyers;
                  stats.inactiveBuyers = activity.inactiveBuyers;
                  stats.activeSellers = activity.activeSellers;
                  stats.inactiveSellers = activity.inactiveSellers;
                  stats.activeProducts = activity.activeProducts;
                  stats.inactiveProducts = activity.inactiveProducts;

                  res.send(util.createResult(null, stats));
                });
              }
            );
          });
        });
      });
    });
  });
});

module.exports = router;
