import api from '../utils/request'

export const getShops = (params => api.get('/shops',params))
export const getTheShop = (params => api.get(`/shops/${params.shop_id}`))
