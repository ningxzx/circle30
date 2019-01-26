import Taro from '@tarojs/taro'

const INITIAL_STATE = {}
export default function global(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "GET_SESSION":
            Taro.setStorageSync({
                key:'openId',
                value:action.payload.data.openId
            })
            return {
                ...state
            }
        case "SET_USER_INFO":
            return {
                ...state,
                ...action.info
            }
        default:
            return state
    }
}