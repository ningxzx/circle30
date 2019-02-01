import api from '../utils/request'

export const postFormId= (params => api.post('/wechat/mini/form/ids',params))
/**
 * 
 * @param 
  "open_id": "mock_open_id",
  "template_id": "mock_template_id",
  "data": "{}",
  "page": "pages/index/index",
  "appid": "mock_appid"
 */
export const postMessage= (params => api.post('/wechat/mini/notifications',params))