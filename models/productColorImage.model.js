const ProductColorImage = require('../schema/productColorImage.schema');

// Create
exports.createProductColorImages = async (images) => {
    try {

        const savedImages = await ProductColorImage.insertMany(images);
        return savedImages;
    } catch (err) {
        throw Error('Error saving images: ' + err.message);
    }
};


// Read all
exports.getAll = async (colorId) => {
    try {
      // Use the correct query object to match the productId
      const images = await ProductColorImage.find({ colorId })
        .populate('colorId'); // Populate the related product details (if needed)
      
      return images;
    } catch (err) {
      throw new Error('Error fetching images: ' + err.message);
    }
  };
  

// Read by ID
exports.getById = async (id) => {
    try {
        const image = await ProductColorImage.findById(id).populate('colorId');
        if (!image) return res.status(404).json({ message: 'Product image not found' });
        return image;
    } catch (err) {
        throw Error('Error fetching image: ' + err.message);
    }
};

// Delete
exports.remove = async (id) => {
    try {
        const deletedImage = await ProductColorImage.findByIdAndDelete(id);
        if (!deletedImage) return res.status(404).json({ message: 'Product image not found' });
        return { message: 'Deleted successfully' };
    } catch (err) {
        console.error('Error deleting image:', err);
        throw Error('Error deleting image: ' + err.message);
}
}

exports.removeAll = async (colorId) => {
    try {
        const deletedImages = await ProductColorImage.deleteMany({ colorId });
        return { message: 'All images deleted successfully' };
    } catch (err) {
        console.error('Error deleting images:', err);
        throw Error('Error deleting images: ' + err.message);
    }
}
