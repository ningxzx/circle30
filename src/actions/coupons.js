import api from '../utils/request'

export const getCoupons = (params => api.get('/user/coupons',params))
export const createShareCoupon = (params => api.post(`/coupons/${params.coupon_id}/tokens`,{user_id:params.user_id}))
export const verifyShareCoupon = (params => api.put(`/coupons/${params.coupon_id}/tokens/${params.token_id}`,{user_id:params.user_id}))
