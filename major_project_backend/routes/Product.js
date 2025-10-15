// routes/Product.js

const express = require("express");
const router = express.Router();

// ✅ Import all Product Controller functions
const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteSingleProduct,
  updateSingleProduct,
  getCategorizedProduct,
} = require("../controllers/Product.js");

/* ------------------------------------------------------------
   ✅ PRODUCT ROUTES (CRUD)
-------------------------------------------------------------*/

// 🟢 Create a new product
// Method: POST
// URL: /api/v1/product/create
router.post("/create", createProduct);

// 🔵 Get all products
// Method: GET
// URL: /api/v1/product/all
router.get("/all", getAllProduct);

// 🟣 Get all products belonging to a specific category
// Method: GET
// URL: /api/v1/product/category/:cId
router.get("/category/:cId", getCategorizedProduct);

// 🟠 Get a single product by ID
// Method: GET
// URL: /api/v1/product/:pId
router.get("/:pId", getSingleProduct);

// 🔴 Delete a product by ID
// Method: DELETE
// URL: /api/v1/product/:pId
router.delete("/delete/:pId", deleteSingleProduct);

// 🟡 Update product details by ID
// Method: PUT
// URL: /api/v1/product/:pId
router.put("/update/:pId", updateSingleProduct);

/* ------------------------------------------------------------
   ✅ EXPORT ROUTER
-------------------------------------------------------------*/
module.exports = router;
