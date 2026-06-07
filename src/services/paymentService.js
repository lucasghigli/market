export const paymentService = {
  async processPayment({ cardNumber, expiry, cvv, amount }) {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      throw new Error('Invalid card number');
    }
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      throw new Error('Invalid expiry date (use MM/YY)');
    }
    if (!cvv || cvv.length < 3) {
      throw new Error('Invalid CVV');
    }
    if (amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    return {
      success: true,
      transactionId: `TXN-${Date.now()}`,
      amount,
      timestamp: new Date().toISOString(),
    };
  },
};
