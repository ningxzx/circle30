import api from '../utils/request'

export const getSchedules= (params => api.get('/schedules',params))
