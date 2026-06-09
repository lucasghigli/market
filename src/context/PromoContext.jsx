import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { promoService } from '../services/promoService';
import { calculateOrderTotals } from '../utils/orderTotals';

const PROMO_KEY = 'supermarket_promo';
const PromoContext = createContext(null);

function loadStoredPromo() {
  const stored = localStorage.getItem(PROMO_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed?.code ? { code: parsed.code } : null;
  } catch {
    return null;
  }
}

export function PromoProvider({ children }) {
  const { user } = useAuth();
  const [appliedPromo, setAppliedPromo] = useState(loadStoredPromo);
  const [promoError, setPromoError] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  useEffect(() => {
    if (appliedPromo) {
      localStorage.setItem(PROMO_KEY, JSON.stringify({ code: appliedPromo.code }));
    } else {
      localStorage.removeItem(PROMO_KEY);
    }
  }, [appliedPromo]);

  useEffect(() => {
    if (!appliedPromo?.code) return;
    const result = promoService.validateCode(appliedPromo.code, user?.id);
    if (!result.valid) {
      setAppliedPromo(null);
      setPromoError(result.message);
      setPromoMessage('');
    }
  }, [user?.id, appliedPromo?.code]);

  const applyPromo = useCallback((code, userId = user?.id) => {
    setPromoError('');
    setPromoMessage('');

    const trimmed = code.trim();
    if (!trimmed) {
      setPromoError('Please enter a promo code.');
      return false;
    }

    const result = promoService.validateCode(trimmed, userId);
    if (!result.valid) {
      setPromoError(result.message);
      return false;
    }

    setAppliedPromo({ code: result.promo.code });
    setPromoMessage(`${result.promo.code} applied — ${result.promo.description}.`);
    return true;
  }, [user?.id]);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoError('');
    setPromoMessage('');
  }, []);

  const clearPromo = removePromo;

  const getDiscount = useCallback((subtotal) => {
    if (!appliedPromo || subtotal <= 0) return 0;
    const result = promoService.validateCode(appliedPromo.code, user?.id);
    if (!result.valid) return 0;
    return promoService.calculateDiscount(appliedPromo.code, subtotal);
  }, [appliedPromo, user?.id]);

  const getTotals = useCallback((subtotal, fulfillmentType = 'delivery') => {
    const discount = getDiscount(subtotal);
    return calculateOrderTotals({ subtotal, fulfillmentType, discount });
  }, [getDiscount]);

  const appliedPromoDetails = appliedPromo
    ? promoService.findPromotion(appliedPromo.code)
    : null;

  return (
    <PromoContext.Provider
      value={{
        appliedPromo,
        appliedPromoDetails,
        promoError,
        promoMessage,
        applyPromo,
        removePromo,
        clearPromo,
        getDiscount,
        getTotals,
      }}
    >
      {children}
    </PromoContext.Provider>
  );
}

export function usePromo() {
  const context = useContext(PromoContext);
  if (!context) throw new Error('usePromo must be used within PromoProvider');
  return context;
}
