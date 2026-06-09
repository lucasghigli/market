import { deliveryService } from '../services/deliveryService';

const TAX_RATE = 0.08;

export function calculateOrderTotals({ subtotal, fulfillmentType = 'delivery', discount = 0 }) {
  const safeDiscount = Math.min(Math.max(discount, 0), subtotal);
  const discountedSubtotal = subtotal - safeDiscount;
  const tax = discountedSubtotal * TAX_RATE;
  const deliveryFee = deliveryService.calculateDeliveryFee(subtotal, fulfillmentType);
  const total = discountedSubtotal + tax + deliveryFee;

  return {
    subtotal,
    discount: safeDiscount,
    discountedSubtotal,
    tax,
    deliveryFee,
    total,
  };
}
