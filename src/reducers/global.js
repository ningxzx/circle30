import Taro from '@tarojs/taro'

const systemInfo = Taro.getSystemInfoSync()
const INITIAL_STATE = {
    ...systemInfo
}
export default function global(state = INITIAL_STATE, action) {
    switch (action.type) {
        default:
            return state
    }
}