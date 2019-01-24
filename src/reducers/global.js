import Taro from '@tarojs/taro'

const systemInfo = Taro.getSystemInfoSync()
const INITIAL_STATE = {
    ...systemInfo,
    appid:'wx880c53e9a6239e51'
}
export default function global(state = INITIAL_STATE, action) {
    switch (action.type) {
        default:
            return state
    }
}