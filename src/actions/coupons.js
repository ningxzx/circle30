import api from '../utils/request'

export const getCoupons = (params => api.get('/user/coupons',params))
