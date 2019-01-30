const globalData = {}

export function set(param, val) {
    if (typeof param === 'string' && arguments.length > 1) {
        globalData[param] = val
    } else if (Object.prototype.toString.call(param) === '[object Object]') {
        for (let key in param) {
            globalData[key] = param[key]
        }
    }
}

export function get(param) {
    if (typeof param === 'string') {
        return globalData[param]
    } else if (Array.isArray(param)&&param.every(x=>!!x)) {
        let res = []
        param.forEach(x=>{
            res[x] = globalData[x]
        })
        return res
    }
}