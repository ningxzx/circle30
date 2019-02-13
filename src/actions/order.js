import api from '../utils/request'

export const createOrder = (params => api.post('/orders', params))
export const checkoutOrder = (({ order_id, coupon_id }) => api.post(`/orders/${order_id}/checkouts`, { coupon_id }))
export const createTrasctions = (({ order_id, openid }) => api.post(`/orders/${order_id}/transactions
`, { openid }))
export const refundOrder = (order_id => api.put(`/orders/${order_id}/refunds`))
export const getOrder = (order_id => api.get(`/orders/${order_id}`))
export const getOrders = (params => api.get(`/orders`, params))