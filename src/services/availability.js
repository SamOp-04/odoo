const Product = require('../models/Product');
const Reservation = require('../models/Reservation');

async function checkAvailability(productId, variantId, quantity, startDate, endDate) {
  try {
    const product = await Product.findById(productId);
    if (!product) return false;
    
    let totalQuantity;
    if (variantId) {
      const variant = product.variants.id(variantId);
      if (!variant) return false;
      totalQuantity = variant.quantity;
    } else {
      totalQuantity = product.quantity_on_hand;
    }
    
    const overlappingReservations = await Reservation.find({
      product_id: productId,
      variant_id: variantId || null,
      status: 'active',
      $or: [
        {
          start_date: { $lte: startDate },
          end_date: { $gte: startDate }
        },
        {
          start_date: { $lte: endDate },
          end_date: { $gte: endDate }
        },
        {
          start_date: { $gte: startDate },
          end_date: { $lte: endDate }
        }
      ]
    });
    
    const reservedQuantity = overlappingReservations.reduce(
      (sum, res) => sum + res.quantity_reserved, 
      0
    );
    
    const availableQuantity = totalQuantity - reservedQuantity;
    
    return {
      available: availableQuantity >= quantity,
      availableQuantity,
      totalQuantity,
      reservedQuantity
    };
    
  } catch (error) {
    console.error('Availability check error:', error);
    return false;
  }
}

module.exports = { checkAvailability };