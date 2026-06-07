import { useRef } from 'react';
import { STORE, STORE_ADDRESS_SINGLE } from '../config/store';
import { formatPrice } from '../utils/currency';

export default function OrderReceipt({ order, type = 'confirmation' }) {
  const receiptRef = useRef(null);
  const isCancellation = type === 'cancellation';

  const handlePrint = () => {
    const receipt = receiptRef.current;
    if (!receipt) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${isCancellation ? 'Cancellation' : 'Order'} Receipt - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 2rem; color: #1e293b; max-width: 600px; margin: 0 auto; }
            .receipt-header { text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 1rem; margin-bottom: 1rem; }
            .receipt-header h1 { margin: 0; font-size: 1.5rem; }
            .receipt-type { font-weight: bold; color: ${isCancellation ? '#991b1b' : '#166534'}; margin: 0.5rem 0; }
            .receipt-meta { margin-bottom: 1rem; font-size: 0.9rem; }
            .receipt-meta p { margin: 0.25rem 0; }
            table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
            th, td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f8fafc; }
            .text-right { text-align: right; }
            .totals { margin-top: 1rem; border-top: 2px solid #1e293b; padding-top: 0.75rem; }
            .totals div { display: flex; justify-content: space-between; padding: 0.25rem 0; }
            .totals .grand-total { font-weight: bold; font-size: 1.1rem; margin-top: 0.5rem; }
            .receipt-footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: #64748b; border-top: 1px dashed #e2e8f0; padding-top: 1rem; }
          </style>
        </head>
        <body>${receipt.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className={`order-receipt-wrapper ${isCancellation ? 'order-receipt-wrapper--cancelled' : ''}`}>
      <div className="order-receipt-actions no-print">
        <h2>{isCancellation ? 'Cancellation Receipt' : 'Order Receipt'}</h2>
        <button type="button" className="btn btn--primary" onClick={handlePrint}>
          🖨️ Print Receipt
        </button>
      </div>

      <div className="order-receipt" ref={receiptRef} id="order-receipt">
        <div className="receipt-header">
          <h1>🛒 FreshMart</h1>
          <p className="receipt-type">
            {isCancellation ? 'ORDER CANCELLATION RECEIPT' : 'ORDER CONFIRMATION RECEIPT'}
          </p>
          <p>{STORE_ADDRESS_SINGLE}</p>
          <p>{STORE.email} · {STORE.phone}</p>
        </div>

        <div className="receipt-meta">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          {isCancellation && order.cancelledAt && (
            <p><strong>Cancelled:</strong> {new Date(order.cancelledAt).toLocaleString()}</p>
          )}
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Customer:</strong> {order.shippingAddress.fullName}</p>
          <p><strong>Email:</strong> {order.shippingAddress.email}</p>
          <p>
            <strong>{order.fulfillmentType === 'pickup' ? 'Pickup' : 'Delivery'}:</strong>{' '}
            {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zip}
          </p>
          <p>
            <strong>Payment:</strong>{' '}
            {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}
          </p>
        </div>

        <table className="receipt-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td className="text-right">{formatPrice(item.price)}</td>
                <td className="text-right">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="receipt-totals totals">
          {order.subtotal != null && (
            <div><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          )}
          {order.deliveryFee != null && (
            <div>
              <span>Delivery</span>
              <span>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</span>
            </div>
          )}
          {order.tax != null && (
            <div><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
          )}
          <div className="grand-total">
            <span>{isCancellation ? 'Refund Amount' : 'Total Paid'}</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="receipt-footer">
          {isCancellation ? (
            <p>Your order has been cancelled. A refund will be processed within 5–7 business days.</p>
          ) : (
            <p>Thank you for shopping at FreshMart! We appreciate your business.</p>
          )}
          <p>All Rights Lucas Ghigli 2024</p>
        </div>
      </div>
    </div>
  );
}
