import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromo } from '../context/PromoContext';
import { useAuth } from '../context/AuthContext';
import { WELCOME_PROMO_CODE } from '../config/promos';

export default function PromoBannerAction() {
  const navigate = useNavigate();
  const { appliedCode, applyPromo, removePromo, statusMessage, statusType } = usePromo();
  const { isAuthenticated } = useAuth();
  const [input, setInput] = useState(appliedCode || WELCOME_PROMO_CODE);

  useEffect(() => {
    if (appliedCode) setInput(appliedCode);
  }, [appliedCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appliedCode && !applyPromo(input)) return;
    navigate(isAuthenticated ? '/products' : '/register');
  };

  return (
    <form className="promo-banner-form" onSubmit={handleSubmit}>
      {appliedCode ? (
        <div className="promo-applied-row promo-applied-row--banner">
          <span className="promo-applied-code">{appliedCode}</span>
          <span className="promo-applied-label">Ready to redeem</span>
          <button type="button" className="promo-remove-btn" onClick={removePromo}>
            Remove
          </button>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Enter promo code"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Promo code"
          className="promo-input-field promo-input-field--banner"
          autoComplete="off"
          spellCheck={false}
        />
      )}
      <button type="submit" className="btn btn--primary btn--lg promo-btn">
        {isAuthenticated ? 'Continue shopping' : 'Create free account'}
      </button>
      {statusMessage && (
        <p className={`promo-status promo-status--${statusType}`}>{statusMessage}</p>
      )}
    </form>
  );
}
