import api from '../utils/request'

export const getSchedules= (params => api.get('/schedules',params))
export const getTheSchedules= (params => api.get(`/schedules/${params.schedule_id}`))
