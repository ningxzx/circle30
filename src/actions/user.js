import { APP_ID } from '../constants/app.js'
import api from '../utils/request'

export const setUserInfo = (info) => ({ type: 'SET_USER_INFO', info })
export const getSessionKey = (params => api.post('/wechat/mini/sessions', { ...params, appid: APP_ID }))
export const decryptData = (params => api.post('/wechat/mini/data', { ...params, appid: APP_ID }))
export const register = (params => api.post('/users', params))
export const getUser = (params => api.get('/users', { ...params }))
export const getSingleUser = (id => api.get(`/users/${id}`))
export const putOpenid = (params => {
    const { user_id, ...rest } = params
    api.put(`/users/${user_id}/identifies`, { ...rest, appid: APP_ID })
})
export const putUser = (params => {
    const { user_id, openid, ...rest } = params
    return api.put(`/users/${user_id}`, {
        ...rest, "identifies": [
            {
                appid: APP_ID,
                openid
            }
        ]
    })
})