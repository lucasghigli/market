import { PROMO_CODES } from '../config/promos';
import { deliveryService } from './deliveryService';
import { orderService } from './orderService';

const TAX_RATE = 0.08;

export const promoService = {
  normalizeCode(code) {
    return code.trim().toUpperCase();
  },

  getPromo(code) {
    const normalized = this.normalizeCode(code);
    return PROMO_CODES[normalized] || null;
  },

  isFirstOrderEligible(userId) {
    if (!userId) return false;
    const orders = orderService.getOrdersByUser(userId);
    return orders.filter((order) => order.status !== 'cancelled').length === 0;
  },

  validateCode(code, userId) {
    const promo = this.getPromo(code);
    if (!promo) {
      return { valid: false, message: 'Invalid promo code. Please check and try again.' };
    }

    if (promo.firstOrderOnly) {
      if (!userId) {
        return {
          valid: true,
          pending: true,
          promo,
          message: 'Code saved! Create a free account to redeem on your first order.',
        };
      }
      if (!this.isFirstOrderEligible(userId)) {
        return {
          valid: false,
          message: 'This offer is for new customers on their first order only.',
        };
      }
    }

    return { valid: true, promo, message: `${promo.label} applied successfully.` };
  },

  calculateDiscount(subtotal, promo) {
    if (!promo || subtotal <= 0) return 0;
    return Math.round(subtotal * (promo.percent / 100) * 100) / 100;
  },

  calculatePricing(subtotal, fulfillmentType, promo) {
    const discountAmount = this.calculateDiscount(subtotal, promo);
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const tax = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
    const deliveryFee = deliveryService.calculateDeliveryFee(subtotal, fulfillmentType);
    const total = Math.round((discountedSubtotal + tax + deliveryFee) * 100) / 100;

    return { discountAmount, discountedSubtotal, tax, deliveryFee, total };
  },
};
