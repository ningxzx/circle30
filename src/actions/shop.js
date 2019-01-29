import api from '../utils/request'

export const getShops = (params => api.get('/shops',params))
