import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePromo } from '../context/PromoContext';
import { WELCOME_PROMO_CODE } from '../config/promotions';

export default function PromoCodeForm({ variant = 'default', idPrefix = 'promo' }) {
  const { isAuthenticated } = useAuth();
  const {
    appliedPromo,
    appliedPromoDetails,
    promoError,
    promoMessage,
    applyPromo,
    removePromo,
  } = usePromo();
  const [code, setCode] = useState(appliedPromo?.code || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    applyPromo(code);
  };

  const isBanner = variant === 'banner';

  if (appliedPromo && appliedPromoDetails) {
    return (
      <div className={`promo-applied ${isBanner ? 'promo-applied--banner' : ''}`}>
        <div className="promo-applied-main">
          <span className="promo-applied-icon" aria-hidden="true">✓</span>
          <div>
            <p className="promo-applied-code">
              <strong>{appliedPromo.code}</strong> — {appliedPromoDetails.description}
            </p>
            {!isAuthenticated && (
              <p className="promo-applied-hint">
                <Link to="/register">Create a free account</Link> or{' '}
                <Link to="/login">sign in</Link> to redeem at checkout.
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          className="promo-remove-btn"
          onClick={removePromo}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className={`promo-form-wrap ${isBanner ? 'promo-form-wrap--banner' : ''}`}>
      <form className={`promo-form ${isBanner ? 'promo-form--banner' : ''}`} onSubmit={handleSubmit}>
        <label htmlFor={`${idPrefix}-code`} className="visually-hidden">
          Promo code
        </label>
        <input
          id={`${idPrefix}-code`}
          type="text"
          className="promo-form-input"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={`e.g. ${WELCOME_PROMO_CODE}`}
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className={`btn ${isBanner ? 'btn--accent' : 'btn--outline'} promo-form-btn`}>
          Apply
        </button>
      </form>
      {promoError && <p className="promo-feedback promo-feedback--error" role="alert">{promoError}</p>}
      {promoMessage && <p className="promo-feedback promo-feedback--success">{promoMessage}</p>}
    </div>
  );
}
