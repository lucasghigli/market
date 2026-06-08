import { useState, useEffect } from 'react';
import { usePromo } from '../context/PromoContext';

export default function PromoCodeInput({ variant = 'default', className = '', defaultCode = '' }) {
  const { appliedCode, applyPromo, removePromo, statusMessage, statusType } = usePromo();
  const [input, setInput] = useState(defaultCode || appliedCode || '');

  useEffect(() => {
    if (appliedCode) setInput(appliedCode);
  }, [appliedCode]);

  const handleApply = (e) => {
    e.preventDefault();
    applyPromo(input);
  };

  if (appliedCode) {
    return (
      <div className={`promo-input promo-input--applied ${className}`}>
        <div className="promo-applied-row">
          <span className="promo-applied-code">{appliedCode}</span>
          <span className="promo-applied-label">Applied</span>
          <button type="button" className="promo-remove-btn" onClick={removePromo}>
            Remove
          </button>
        </div>
        {statusMessage && (
          <p className={`promo-status promo-status--${statusType}`}>{statusMessage}</p>
        )}
      </div>
    );
  }

  return (
    <form
      className={`promo-input ${variant === 'banner' ? 'promo-input--banner' : ''} ${className}`}
      onSubmit={handleApply}
    >
      <div className="promo-input-row">
        <input
          type="text"
          placeholder="Enter promo code"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Promo code"
          className="promo-input-field"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="btn btn--outline btn--sm promo-apply-btn" disabled={!input.trim()}>
          Apply
        </button>
      </div>
      {statusMessage && (
        <p className={`promo-status promo-status--${statusType}`}>{statusMessage}</p>
      )}
    </form>
  );
}
