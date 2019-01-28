import { APP_ID } from '../constants/app.js'
import api from '../utils/request'

export const setUserInfo = (info) => ({ type: 'SET_USER_INFO', info })
export const login = (params => api.post('/wechat/mini/sessions', { ...params, appid: APP_ID }))
export const getUnionId = (params => api.post('/wechat/mini/data', { ...params, appid: APP_ID }))
export const register = (params => api.post('/users', params))
export const getUser = (params => api.get('/users', { ...params, appid: APP_ID }))

