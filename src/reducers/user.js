import Taro from '@tarojs/taro'

const INITIAL_STATE = {}
export default function global(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "SET_SESSION":
            return {
                ...state,
                ...action.payload.data
            }
        case "SET_USER_INFO":
         console.log(action)
            return {
                ...state,
                ...action.info
            }
        default:
            return state
    }
}