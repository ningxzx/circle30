import api from '../utils/request'

export const getSchedules= (params => api.get('/schedules',params))
export const getTheSchedule= (params => api.get(`/schedules/${params.schedule_id}`))
export const userCheckin = (params => {
    const { user_id, checkin_id } = params
    return api.put(`/users/${user_id}/checkins/${checkin_id}`)
})

