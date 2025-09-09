const express = require("express");
const router = express.Router();
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const db = require("../db");
const util = require("../util");
const config = require("../config");

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const encryptedPassword = String(crypto.MD5(password));

  const statement = `
    SELECT user_id, username, email, contact_number, address, role, total_reviews, active_status 
    FROM users 
    WHERE email = ? AND password = ?
  `;

  db.pool.query(statement, [email, encryptedPassword], (error, users) => {
    if (error) {
      return res.send(util.createError("Login failed", error));
    }

    if (users.length === 0) {
      return res.send(util.createError("Invalid email or password"));
    }

    const user = users[0];

    if (!user.active_status) {
      return res.send(util.createError("Your account is inactive. Contact admin."));
    }

    const payload = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.secret);

    res.send(util.createSuccess({
      token,
      ...payload,
      contact_number: user.contact_number,
      address: user.address,
      total_reviews: user.total_reviews,
    }));
  });
});


module.exports = router;
