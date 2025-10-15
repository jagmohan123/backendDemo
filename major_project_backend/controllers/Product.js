// Step 1: Import dependencies and models
const Product = require("../modals/ProductModal.js");
const Category = require("../modals/CategoryModal.js");
const UploadProductImage = require("../utils/UploadImage.js");

/* 
----------------------------------------------------
  ✅ CREATE PRODUCT
----------------------------------------------------
*/
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      productPrice,
      productQuantity,
      productDesc,
      productCategoryId,
    } = req.body;

    // Step 1️⃣: Validate required fields
    if (
      !productName ||
      !productPrice ||
      !productQuantity ||
      !productDesc ||
      !productCategoryId
    ) {
      return res.status(400).json({
        success: false,
        message: "All product fields are required.",
      });
    }

    // Step 2️⃣: Validate product image
    if (!req.files || !req.files.productImage) {
      return res.status(400).json({
        success: false,
        message: "Product image is required.",
      });
    }

    // Step 3️⃣: Check for existing product name
    const isProductNameExist = await Product.findOne({
      productName: productName.toLowerCase(),
    });
    if (isProductNameExist) {
      return res.status(409).json({
        success: false,
        message: "Product with this name already exists. Please use a different name.",
      });
    }

    // Step 4️⃣: Verify category existence
    const categoryExists = await Category.findById(productCategoryId);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Invalid category ID. Please select a valid category.",
      });
    }

    // Step 5️⃣: Upload product image to Cloudinary
    const { productImage } = req.files;
    const imageUrl = await UploadProductImage(productImage.tempFilePath);

    // Step 6️⃣: Create new product entry
    const productData = await Product.create({
      productName: productName.toLowerCase(),
      productPrice,
      productQuantity,
      productDesc,
      productImage: imageUrl.secure_url,
      productCategoryId,
    });

    // Step 7️⃣: Return success response
    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: productData,
    });
  } catch (error) {
    console.error("❌ Error in createProduct controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating product.",
      error: error.message,
    });
  }
};

/* 
----------------------------------------------------
  ✅ GET ALL PRODUCTS
----------------------------------------------------
*/
exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in the database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All products fetched successfully.",
      data: products,
    });
  } catch (error) {
    console.error("❌ Error in getAllProduct controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching products.",
      error: error.message,
    });
  }
};

/* 
----------------------------------------------------
  ✅ GET PRODUCTS BY CATEGORY
----------------------------------------------------
*/
exports.getCategorizedProduct = async (req, res) => {
  try {
    const { cId } = req.params;

    if (!cId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required.",
      });
    }

    const products = await Product.find({ productCategoryId: cId });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category-wise products fetched successfully.",
      data: products,
    });
  } catch (error) {
    console.error("❌ Error in getCategorizedProduct controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching category products.",
      error: error.message,
    });
  }
};

/* 
----------------------------------------------------
  ✅ GET SINGLE PRODUCT BY ID
----------------------------------------------------
*/
exports.getSingleProduct = async (req, res) => {
  try {
    const { pId } = req.params;

    if (!pId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await Product.findById(pId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No product found with the provided ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product details fetched successfully.",
      data: product,
    });
  } catch (error) {
    console.error("❌ Error in getSingleProduct controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching single product.",
      error: error.message,
    });
  }
};

/* 
----------------------------------------------------
  ✅ DELETE SINGLE PRODUCT
----------------------------------------------------
*/
exports.deleteSingleProduct = async (req, res) => {
  try {
    const { pId } = req.params;

    if (!pId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required for deletion.",
      });
    }

    const product = await Product.findById(pId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the database.",
      });
    }

    await Product.findByIdAndDelete(pId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      deletedProduct: product,
    });
  } catch (error) {
    console.error("❌ Error in deleteSingleProduct controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting product.",
      error: error.message,
    });
  }
};

/* 
----------------------------------------------------
  ✅ UPDATE SINGLE PRODUCT
----------------------------------------------------
*/
exports.updateSingleProduct = async (req, res) => {
  try {
    const { pId } = req.params;
    const {
      productName,
      productPrice,
      productQuantity,
      productDesc,
      productCategoryId,
    } = req.body;

    // Step 1️⃣: Validate Product ID
    if (!pId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required for update.",
      });
    }

    // Step 2️⃣: Find product by ID
    const existingProduct = await Product.findById(pId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Step 3️⃣: Upload new image if provided
    let productImageUrl = existingProduct.productImage;
    if (req.files && req.files.productImage) {
      const imageUpload = await UploadProductImage(req.files.productImage.tempFilePath);
      productImageUrl = imageUpload.secure_url;
    }

    // Step 4️⃣: Update product
    await Product.findByIdAndUpdate(
      pId,
      {
        productName: productName || existingProduct.productName,
        productPrice: productPrice || existingProduct.productPrice,
        productQuantity: productQuantity || existingProduct.productQuantity,
        productDesc: productDesc || existingProduct.productDesc,
        productCategoryId: productCategoryId || existingProduct.productCategoryId,
        productImage: productImageUrl,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product details updated successfully.",
    });
  } catch (error) {
    console.error("❌ Error in updateSingleProduct controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating product.",
      error: error.message,
    });
  }
};
