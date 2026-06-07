const ORDERS_KEY = 'supermarket_orders';
const CANCEL_WINDOW_MS = 24 * 60 * 60 * 1000;

function getOrders() {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export const orderService = {
  createOrder(userId, items, { shippingAddress, paymentMethod, fulfillmentType, subtotal, tax, deliveryFee, total }) {
    const orders = getOrders();
    const order = {
      id: `ORD-${Date.now()}`,
      userId,
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      })),
      shippingAddress,
      paymentMethod,
      fulfillmentType,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(order);
    saveOrders(orders);
    return order;
  },

  getOrdersByUser(userId) {
    return getOrders().filter((o) => o.userId === userId);
  },

  getOrderById(id) {
    return getOrders().find((o) => o.id === id);
  },

  getAllOrders() {
    return getOrders();
  },

  updateOrderStatus(id, status) {
    const orders = getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');
    orders[index].status = status;
    saveOrders(orders);
    return orders[index];
  },

  deleteOrder(id) {
    const orders = getOrders().filter((o) => o.id !== id);
    saveOrders(orders);
  },

  canCancelOrder(order) {
    if (!order) return false;
    if (['cancelled', 'delivered', 'shipped'].includes(order.status)) return false;
    const elapsed = Date.now() - new Date(order.createdAt).getTime();
    return elapsed <= CANCEL_WINDOW_MS;
  },

  getCancelDeadline(order) {
    return new Date(new Date(order.createdAt).getTime() + CANCEL_WINDOW_MS);
  },

  cancelOrder(id, userId) {
    const order = this.getOrderById(id);
    if (!order) throw new Error('Order not found');
    if (order.userId !== userId) throw new Error('Not authorized to cancel this order');
    if (!this.canCancelOrder(order)) {
      throw new Error('Orders can only be cancelled within 24 hours of placement');
    }
    const orders = getOrders();
    const index = orders.findIndex((o) => o.id === id);
    orders[index].status = 'cancelled';
    orders[index].cancelledAt = new Date().toISOString();
    saveOrders(orders);
    return orders[index];
  },
};
