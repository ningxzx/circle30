import Taro, { Component } from '@tarojs/taro'
import { login, setUserInfo } from '../actions/user'
import { connect } from '@tarojs/redux'
export const wxLogin = (WrappedComponent) => {
    @connect(() => { }, (dispatch) => ({
        login(param) {
            dispatch(login(param))
        }
    }))
    class LoginWrapper extends Component {
        // async componentDidMount() {
        //     try {
        //         await Taro.checkSession()
        //     } catch (error) {
        //         const code = await wxLogin()
        //         login({ code })
        //     }
        // }
        render() {
            return <WrappedComponent {...this.props} />
        }
    }
    return LoginWrapper
}
export const getUserInfo = (WrappedComponent) => {
    @connect(() => { }, (dispatch) => ({
        login(param) {
            dispatch(login(param))
        }
    }))
    class userInfoWrapper extends Component {
        componentDidMount() {
            const { openId,unionId } = Taro.getStorageSync()
            Taro.getSetting().then(res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            setUserInfo(res.userInfo)
                            // register(res)
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            })
        }
        render() {
            return <WrappedComponent {...this.props} />
        }
    }
    return userInfoWrapper
}

// componentDidMount() {
//     const { global: { appid }, login, setUserInfo } = this.props
//     wx.login({
//       success: res => {
//         if (res.errMsg === 'login:ok') {
//           const { code } = res
//           login({ code, appid })
//         }
//       }
//     })
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           setUserInfo(res.userInfo)
    //           // register(res)
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
//   }