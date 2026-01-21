// reviewRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/review.controller");

router.post("/", controller.createReview);

router.get("/", controller.getAllReviews);

router.get("/:id", controller.getReviewById);

router.get("/product/:productId", controller.getReviewsByProductId);

router.get("/user/:userId", controller.getReviewsByUserId);

router.get("/product/:productId/average", controller.getProductAverageScore);

router.put("/:id", controller.updateReview);

router.delete("/:id", controller.deleteReview);

router.delete("/:id/permanent", controller.permanentDeleteReview);

module.exports = router;
