import Taro from '@tarojs/taro'

const INITIAL_STATE = {}
export default function global(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "GET_SESSION":
            const data  = action.payload.data;
            return {
                ...state,
                ...data
            }
        default:
            return state
    }
}