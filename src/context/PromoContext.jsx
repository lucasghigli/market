import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { promoService } from '../services/promoService';

const PROMO_KEY = 'supermarket_promo_code';
const PromoContext = createContext(null);

function loadStoredCode() {
  return localStorage.getItem(PROMO_KEY) || '';
}

export function PromoProvider({ children }) {
  const { user } = useAuth();
  const [appliedCode, setAppliedCode] = useState(loadStoredCode);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');

  const clearStatus = useCallback(() => {
    setStatusMessage('');
    setStatusType('');
  }, []);

  const applyPromo = useCallback((code) => {
    const trimmed = code.trim();
    if (!trimmed) {
      setStatusMessage('Please enter a promo code.');
      setStatusType('error');
      return false;
    }

    const result = promoService.validateCode(trimmed, user?.id);
    if (!result.valid) {
      setAppliedCode('');
      setAppliedPromo(null);
      localStorage.removeItem(PROMO_KEY);
      setStatusMessage(result.message);
      setStatusType('error');
      return false;
    }

    const normalized = promoService.normalizeCode(trimmed);
    setAppliedCode(normalized);
    setAppliedPromo(result.promo);
    localStorage.setItem(PROMO_KEY, normalized);
    setStatusMessage(result.message);
    setStatusType(result.pending ? 'info' : 'success');
    return true;
  }, [user?.id]);

  const removePromo = useCallback(() => {
    setAppliedCode('');
    setAppliedPromo(null);
    localStorage.removeItem(PROMO_KEY);
    clearStatus();
  }, [clearStatus]);

  useEffect(() => {
    if (!appliedCode) return;
    const result = promoService.validateCode(appliedCode, user?.id);
    if (!result.valid) {
      setAppliedPromo(null);
      setStatusMessage(result.message);
      setStatusType('error');
      return;
    }
    setAppliedPromo(result.promo);
    if (result.pending) {
      setStatusMessage(result.message);
      setStatusType('info');
    } else {
      setStatusMessage(`${result.promo.label} — ready at checkout.`);
      setStatusType('success');
    }
  }, [appliedCode, user?.id]);

  const getPricing = useCallback((subtotal, fulfillmentType = 'delivery') => {
    const activePromo = appliedPromo && user?.id && promoService.isFirstOrderEligible(user.id)
      ? appliedPromo
      : null;
    return promoService.calculatePricing(subtotal, fulfillmentType, activePromo);
  }, [appliedPromo, user?.id]);

  const isRedeemable = !!(appliedPromo && user?.id && promoService.isFirstOrderEligible(user.id));

  return (
    <PromoContext.Provider
      value={{
        appliedCode,
        appliedPromo,
        statusMessage,
        statusType,
        isRedeemable,
        applyPromo,
        removePromo,
        clearStatus,
        getPricing,
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
