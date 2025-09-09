const express = require("express");
const util = require("./util");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const config = require("./config");
const app = express();
const path = require("path");


app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // If using cookies or auth headers
  optionsSuccessStatus: 200, // For legacy browsers (204 might confuse them)
}));



// Static file serving (for uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(express.json()); // convert user data in json formate...

// app.use((req, res, next) => {
//   if (
//     req.url == "/user/buyer/register" ||
//     req.url == "/user/login" ||
//     req.url == "/user/seller/register" ||
//     req.url == "/admin/login"
//   ) {
//     next();
//   } else {
//     const token = req.headers["token"];

//     if (!token) {
//       res.send(util.createError("missing token"));
//     } else {
//       try {
//         const payload = jwt.verify(token, config.secret);
//         req.user = payload;
//         next();
//       } catch (ex) {
//         res.send(util.createError("invalid token"));
//       }
//     }
//   }
// });

const userRouter = require("./routes/user");
const productRouter = require("./routes/products");
const reviewsRouter = require("./routes/reviews");
const ordersRouter = require("./routes/orders");
const  sales_reportRouter = require("./routes/sales-report");
const  product_imageRouter = require("./routes/product-image");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/cart");
const adminRouter = require("./routes/admin");


app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/reviews", reviewsRouter);
app.use("/orders", ordersRouter);
app.use("/cart", cartRouter);
app.use("/sales-report", sales_reportRouter);
app.use("/product-images", product_imageRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);


app.listen(4000, "0.0.0.0", () => {
  console.log("server connected...");
});
