import api from '../utils/request'

export const getSystemConfig= (params => api.get('/systems',params))