function calculateRentalPrice(product, startDate, endDate, durationType) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let duration, unitPrice;
  
  switch(durationType) {
    case 'hourly':
      duration = Math.ceil((end - start) / (1000 * 60 * 60));
      unitPrice = product.rental_pricing.hourly;
      break;
      
    case 'daily':
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      unitPrice = product.rental_pricing.daily;
      break;
      
    case 'weekly':
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 7));
      unitPrice = product.rental_pricing.weekly;
      break;
      
    case 'custom':
      const customDays = product.rental_pricing.custom.period_days;
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * customDays));
      unitPrice = product.rental_pricing.custom.price;
      break;
      
    default:
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      unitPrice = product.rental_pricing.daily;
  }
  
  const subtotal = unitPrice * duration;
  const deposit = product.security_deposit;
  
  return { 
    subtotal, 
    deposit, 
    duration,
    unitPrice
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