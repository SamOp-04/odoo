function calculateRentalPrice(product, startDate, endDate, durationType) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let duration, unitPrice;
  
  // Ensure rental_pricing exists
  if (!product.rental_pricing) {
    throw new Error(`Product ${product.name} does not have rental pricing configured`);
  }
  
  switch(durationType) {
    case 'hourly':
      duration = Math.ceil((end - start) / (1000 * 60 * 60));
      unitPrice = product.rental_pricing.hourly || 0;
      break;
      
    case 'daily':
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      unitPrice = product.rental_pricing.daily || 0;
      break;
      
    case 'weekly':
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
      unitPrice = product.rental_pricing.weekly || 0;
      break;
      
    case 'custom':
      const customDays = product.rental_pricing.custom?.period_days || 30;
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * customDays));
      unitPrice = product.rental_pricing.custom?.price || 0;
      break;
      
    default:
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      unitPrice = product.rental_pricing.daily || product.rental_pricing.weekly || 0;
  }
  
  // Ensure we have valid numbers
  if (isNaN(duration) || duration <= 0) {
    duration = 1;
  }
  
  if (isNaN(unitPrice) || unitPrice === undefined || unitPrice === null) {
    throw new Error(`No valid rental price found for ${product.name} with duration type ${durationType}`);
  }
  
  const subtotal = unitPrice * duration;
  const deposit = product.security_deposit || 0;
  
  return { 
    subtotal: subtotal || 0, 
    deposit: deposit || 0, 
    duration: duration || 1,
    unitPrice: unitPrice || 0
  };
}

function calculateLateFee(order, settings) {
  const expectedReturnDate = new Date(order.return_date);
  const actualReturnDate = order.actual_return_date ? 
    new Date(order.actual_return_date) : 
    new Date();
  
  if (actualReturnDate <= expectedReturnDate) {
    return 0;
  }
  
  const msPerDay = 1000 * 60 * 60 * 24;
  const lateDays = Math.ceil((actualReturnDate - expectedReturnDate) / msPerDay);
  
  const lateFeePerDay = settings?.late_fee_per_day || 100;
  
  return lateDays * lateFeePerDay;
}

module.exports = { calculateRentalPrice, calculateLateFee };