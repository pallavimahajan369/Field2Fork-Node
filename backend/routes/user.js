const express = require("express");
const db = require("../db");
const util = require("../util");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const config = require("../config");

const router = express.Router();

router.post("/buyers/register", (req, res) => {
  const { username, email, contact_number, address, password } = req.body;

  if (!username || !email || !contact_number || !address || !password) {
    return res.send(util.createError("Please fill all required fields"));
  }

  const encryptedPassword = String(crypto.MD5(password));
  const statement = `
    INSERT INTO users 
    (username, email, contact_number, address, password, location, role, total_reviews, active_status, rating) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.pool.execute(
    statement,
    [
      username,
      email,
      contact_number,
      address,
      encryptedPassword,
      address,         // setting location = address
      "BUYER",         // role
      0,               // total_reviews
      1,               // active_status
      0.0              // rating
    ],
    (error, result) => {
      if (!error) {
        res.send(util.createResult(null, result));
      } else {
        res.send(util.createError("Registration failed", error));
      }
    }
  );
});


// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const statement = `SELECT user_id,username,  contact_number, address,  role, total_reviews,active_status from users WHERE email =? AND password=?
//     `;
//   const encryptedPassword = String(crypto.MD5(password));

//   db.pool.query(statement, [email, encryptedPassword], (error, user) => {
//     if (error) {
//       res.send(util.createError(error));
//     } else {
//       if (user.length == 0) {
//         res.send(util.createError("user does not exist"));
//       } else {
//         const {
//           user_id,
//           username,
//           contact_number,
//           address,
//           role,
//           total_reviews,
//           active_status,
//         } = user[0];

//         // check if the user is active
//         if (active_status) {
//           // create a payload
//           const payload = {
//             user_id,
//             username,
//             email,
//             address,
//             role,
//             total_reviews,
//           };

//           // create a token
//           const token = jwt.sign(payload, config.secret);

//           res.send(
//             util.createSuccess({
//               token,
//               username,
//               contact_number,
//               address,
//               role,
//               total_reviews,
//             })
//           );
//         } else {
//           // user is not active
//           res.send(
//             util.createError(
//               "You can not login as your account is not active. Please contact administrator."
//             )
//           );
//         }
//       }
//     }
//   });
// });
router.post("/sellers/register", (req, res) => {
  console.log("Incoming data:", req.body);
  const { username, email, password, location, contact_number } = req.body;

  const encryptedPassword = String(crypto.MD5(password));
  const defaultAddress = null;
  const defaultReviews = 0;
  const defaultRole = "SELLER";


  const statement = `
    INSERT INTO users 
    (username, email, contact_number, address, password, location, role, total_reviews) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.pool.execute(
    statement,
    [
      username,
      email,
      contact_number,
      defaultAddress,
      encryptedPassword,
      location,
      defaultRole,
      defaultReviews,
    ],
    (error, result) => {
      if (!error) {
        res.send(util.createResult(error, result));
        console.log("Received body:", req.body);

      } else {
        console.error("SQL Error:", error); // Log it for debugging
        res.send(util.createError(error)); // Send meaningful message
      }
    }
    
  );
});

router.get("/", (req, res) => {
  const statement = `select user_id,username,email,role,total_reviews,active_status from users where active_status=1`;

  db.pool.query(statement, (error, result) => {
    res.send(util.createResult(error, result));
  });
});

router.put("/buyers/:buyerId", (req, res) => {
  const { username, contact_number, address } = req.body;
  const { buyerId } = req.params;

  const statement = `
    UPDATE users 
    SET username = ?, contact_number = ?, address = ?
    WHERE user_id = ?
  `;

  db.pool.execute(
    statement,
    [username, contact_number, address, buyerId],
    (error, result) => {
      res.send(util.createResult(error, result));
    }
  );
});

router.put("/sellers/:sellerId", (req, res) => {
  const { username, contact_number, address } = req.body;
  const { sellerId } = req.params;

  const statement = `
    UPDATE users 
    SET username = ?, contact_number = ?, location = ?
    WHERE user_id = ?
  `;

  db.pool.execute(
    statement,
    [username, contact_number, location, sellerId],
    (error, result) => {
      res.send(util.createResult(error, result));
    }
  );
});

router.get("/sellers/:user_id", (req, res) => {
  const { user_id } = req.params;

  const statement = `select  username, email, contact_number, location, rating
  from users where user_id=? and role="SELLER"
  `;
  db.pool.query(statement, [user_id], (error, result) => {
    if (error) {
      res.send(util.createError(error));
    } else if (result.length == 0) {
      res.send(util.createError("Seller not found"));
    } else {
      res.send(util.createResult(null, result[0])); // send single object
    }
  });
});

router.get("/buyers/:user_id", (req, res) => {
  const { user_id } = req.params;

  const statement = `
    SELECT user_id, username, email, address,contact_number
FROM users 
    WHERE user_id = ? AND role = "BUYER"
  `;

  db.pool.query(statement, [user_id], (error, result) => {
    if (error) {
      res.send(util.createError("Database query failed", error));
    } else if (result.length === 0) {
      res.send(util.createError("Buyer not found"));
    } else {
      res.send(util.createResult(null, result[0])); // Send the first result if found
    }
  });
});

router.get("/buyers/before/:firstId", (req, res) => {
  const { firstId } = req.params;
  const statement = `
  SELECT user_id, username, email, address,contact_number
FROM users
WHERE role = 'BUYER' AND user_id < ?
ORDER BY user_id 
LIMIT 10;

  `;
  db.pool.query(statement, [firstId], (error, result) => {
    if (error) {
      res.send(util.createError("buyers not found ", error));
    } else {
      res.send(util.createResult(error, result));
    }
  });
});

router.get("/buyers/after/:lastId", (req, res) => {
  const { lastId } = req.params;
  const statement = `
  SELECT user_id, username, email, address ,contact_number
FROM users
WHERE role = 'BUYER' AND user_id > ?
ORDER BY user_id 
LIMIT 10;

  `;
  db.pool.query(statement, [lastId], (error, result) => {
    if (error) {
      res.send(util.createError("buyers not found ", error));
    } else {
      res.send(util.createResult(error, result));
    }
  });
});

router.get("/sellers/before/:firstId", (req, res) => {
  const { firstId } = req.params;
  const statement = `
  SELECT user_id, username, email, location,rating ,contact_number
FROM users
WHERE role = 'SELLER' AND user_id < ?
ORDER BY user_id 
LIMIT 10;

  `;
  db.pool.query(statement, [firstId], (error, result) => {
    if (error) {
      res.send(util.createError("buyers not found ", error));
    } else {
      res.send(util.createResult(error, result));
    }
  });
});

router.get("/sellers/after/:lastId", (req, res) => {
  const { lastId } = req.params;
  const statement = `
  SELECT user_id, username, email, location ,rating,contact_number
FROM users
WHERE role = 'SELLER' AND user_id > ?
ORDER BY user_id 
LIMIT 10;

  `;
  db.pool.query(statement, [lastId], (error, result) => {
    if (error) {
      res.send(util.createError("buyers not found ", error));
    } else {
      res.send(util.createResult(error, result));
    }
  });
});

router.patch("/sellers/:buyerId/rate", (req, res) => {
  const { buyerId } = req.params;
  const { rating } = req.body;

  // Validate rating range before running the query
  if (rating < 1.0 || rating > 5.0) {
    return res.send(util.createError("Rating must be between 1.0 and 5.0"));
  }

  const statement = `
    UPDATE Users
    SET rating = ?
    WHERE user_id = ? AND role != 'seller'
  `;

  db.pool.query(statement, [rating, buyerId], (error, items) => {
    if (error) {
      res.send(util.createError("Failed to update rating", error));
    } else {
      res.send(util.createResult(null, items));
    }
  });
});

router.patch("/:userId", (req, res) => {
  const { userId } = req.params;

  const statement = `
    UPDATE Users
    SET active_status = 0
    WHERE user_id = ?
  `;
  db.pool.query(statement, [userId], (error, items) => {
    if (error) {
      res.send(util.createError("Failed to delete user"));
    } else {
      res.send(util.createResult(error, items));
    }
  });
});

router.patch("/:userId/restore", (req, res) => {
  const { userId } = req.params;

  const statement = `
    UPDATE Users
    SET active_status = 1
    WHERE user_id = ?
  `;
  db.pool.query(statement, [userId], (error, items) => {
    if (error) {
      res.send(util.createError("Failed to restore user"));
    } else {
      res.send(util.createResult(error, items));
    }
  });
});
module.exports = router;
