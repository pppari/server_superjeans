const express = require('express');
const router = express.Router();
const controller = require('../controllers/promotionImage.controller');
const upload = require('../middlewares/promotionImage'); // renamed

// POST /promotion-images
router.post('/', upload.single('image'), controller.create);

router.get('/', controller.getAll);

// DELETE /promotion-images/:id
router.delete('/:id', controller.remove);

module.exports = router;
