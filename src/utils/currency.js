import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../config/store';

export { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD };

const eurFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
});

export function formatPrice(amount) {
  return eurFormatter.format(Number(amount) || 0);
}
