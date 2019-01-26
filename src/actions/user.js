import { createApiAction } from './index'
import { APP_ID } from '../constants/app.js'
import api from '../utils/request'

export const setUserInfo = (info) => ({ type: 'SET_USER_INFO', info })
export const login = createApiAction('GET_SESSION', params => api.post('/wechat/mini/sessions', {params,appid:APP_ID}))
export const getUnionId = createApiAction('GET_UNIONID', params => api.post('/wechat/mini/data', params))
export const register = createApiAction('REGISTER', params => api.post('/users', params))

