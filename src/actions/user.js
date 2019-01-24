import { createApiAction } from './index'
import api from '../utils/request'

export const login = createApiAction('GET_SESSION', params => {
    api.post('/wechat/mini/sessions', params)
})
