import { PROMOTIONS } from '../config/promotions';
import { orderService } from './orderService';

export const promoService = {
  normalizeCode(code) {
    return code.trim().toUpperCase();
  },

  findPromotion(code) {
    return PROMOTIONS[this.normalizeCode(code)] || null;
  },

  validateCode(code, userId) {
    const promo = this.findPromotion(code);
    if (!promo) {
      return { valid: false, message: 'Invalid promo code. Please check and try again.' };
    }

    if (promo.firstOrderOnly && userId) {
      const priorOrders = orderService.getOrdersByUser(userId);
      if (priorOrders.length > 0) {
        return { valid: false, message: 'This offer is only valid on your first order.' };
      }
    }

    return { valid: true, promo };
  },

  calculateDiscount(code, subtotal) {
    const promo = this.findPromotion(code);
    if (!promo || subtotal <= 0) return 0;
    return Math.round(subtotal * (promo.percentOff / 100) * 100) / 100;
  },
};
