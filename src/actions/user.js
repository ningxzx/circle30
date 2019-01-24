import { createApiAction } from './index'
import api from '../utils/request'

export const login = createApiAction('GET_SESSION', params => api.post('/wechat/mini/sessions', params))
export const setUserInfo = (info) => ({ type: 'SET_USER_INFO', info })
export const register = createApiAction('REGISTER', params => api.post('/users', params))

