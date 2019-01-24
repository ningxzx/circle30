import Taro from '@tarojs/taro'

export const HTTP_STATUS = {
    SUCCESS: 200,
    CLIENT_ERROR: 400,
    AUTHENTICATE: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  }

export const base = "https://stage.circle30.com/api"


export const logError = (name, action, info) => {
    if (!info) {
        info = 'empty'
    }
    try {
        let deviceInfo = Taro.getSystemInfoSync() // 这替换成 taro的
        var device = JSON.stringify(deviceInfo)
    } catch (e) {
        console.error('not support getSystemInfoSync api', err.message)
    }
    let time = formatTime(new Date())
    console.error(time, name, action, info, device)
    // 如果使用了 第三方日志自动上报
    // if (typeof action !== 'object') {
    // fundebug.notify(name, action, info)
    // }
    // fundebug.notifyError(info, { name, action, device, time })
    if (typeof info === 'object') {
        info = JSON.stringify(info)
    }
}
export default {
    baseOptions(params, method = 'GET') {
        let { url, data } = params
        let contentType = 'application/json'
        contentType = params.contentType || contentType
        console.log(params)

        const option = {
            isShowLoading: false,
            loadingText: '正在加载',
            url: base + url,
            data: data,
            method: method,
            header: { 'content-type': contentType},
            success(res) {
                if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
                    return logError('api', '请求资源不存在')
                } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
                    return logError('api', '服务端出现了问题')
                } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
                    return logError('api', '没有权限访问')
                } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
                    return res.data
                }
            },
            error(e) {
                logError('api', '请求接口出现问题', e)
            }
        }
        return Taro.request(option)
    },
    get(url, data = '') {
        let option = { url, data }
        return this.baseOptions(option)
    },
    post: function (url, data, contentType) {
        let params = { url, data, contentType }
        return this.baseOptions(params, 'POST')
    }
}