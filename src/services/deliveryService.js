import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  STORE,
} from '../config/store';
import { formatPrice } from '../utils/currency';

export { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD };

export const STORE_LOCATION = {
  name: STORE.name,
  address: STORE.address,
  city: `${STORE.zip} ${STORE.city}`,
  zip: STORE.province,
  hours: STORE.hours,
  phone: STORE.phone,
  email: STORE.email,
  country: STORE.country,
};

export const deliveryService = {
  calculateDeliveryFee(subtotal, fulfillmentType) {
    if (fulfillmentType !== 'delivery') return 0;
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  },

  getOrderTotal(subtotal, tax, fulfillmentType) {
    const deliveryFee = this.calculateDeliveryFee(subtotal, fulfillmentType);
    return subtotal + tax + deliveryFee;
  },

  getDeliveryLabel(subtotal, fulfillmentType) {
    if (fulfillmentType !== 'delivery') return null;
    if (subtotal >= FREE_DELIVERY_THRESHOLD) {
      return `Consegna gratuita (ordini oltre ${formatPrice(FREE_DELIVERY_THRESHOLD)})`;
    }
    const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
    return `Aggiungi ${formatPrice(remaining)} per la consegna gratuita`;
  },
};
