const WishList = require('../schema/wishlist.schema');
const productColorModel = require("../models/productColor.model");
const toObjectId = require('../utils/toObjectId');
// Create a new wishlist item
exports.create = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        // Validate request
        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "userId and productId are required fields"
            });
        }

        // Check if wishlist item already exists for this user and product
        const existingWishListItem = await WishList.findOne({
            userId: userId,
            productId: productId
        });

        if (existingWishListItem) {
            return res.status(400).json({
                success: false,
                message: "This product is already in the wishlist"
            });
        }

        // Create new wishlist item
        const wishlistItem = new WishList({
            userId: userId,
            productId: productId
        });

        // Save wishlist item to database
        const savedItem = await wishlistItem.save();

        res.status(201).json({
            success: true,
            data: savedItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while creating the wishlist item"
        });
    }
};

// Get all wishlist items by userId
exports.getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        // Find all wishlist items for the specified userId
        const wishlistItems = await WishList.find({ userId: userId })
            .populate('productId') // Optional: populate product details
            .sort({ created_at: -1 }); // Sort by creation date, newest first

const productsWithImages = await Promise.all(
        wishlistItems.map(async (product) => {
          // Fetch colors associated with each product
          const colors = await productColorModel.getByProductId(toObjectId(product.productId._id));

          // If colors exist, assign the first color's main image, otherwise null
          const mainImage = colors && colors.length > 0 ? colors[0].main_img : null;

          // Return the product with the injected 'main_img' field
          return {
            ...product.toObject(), // Convert Mongoose Document to plain object
            main_img: mainImage,    // Inject the main image
          };
        })
    );

        res.status(200).json({
            success: true,
            count: productsWithImages.length,
            data: productsWithImages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while retrieving wishlist items"
        });
    }
};

// Delete a wishlist item
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        // Validate id
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Wishlist item ID is required"
            });
        }

        // Find and delete the wishlist item
        const deletedItem = await WishList.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Wishlist item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Wishlist item deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while deleting the wishlist item"
        });
    }
};