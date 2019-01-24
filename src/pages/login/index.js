import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { login } from '../../actions/user'
import { connect } from '@tarojs/redux'

import './index.less'


@connect(({ global, user }) => ({
  global, user
}), (dispatch) => ({
  login(param) {
    dispatch(login(param))
  }
}))
class Login extends Component {

  config = {
    navigationBarTitleText: '登录'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    wx.login({
      success: res => {
        if (res.errMsg === 'login:ok') {
          const { code } = res
          const { global: { appid }, login } = this.props
          console.log(login)
          login({ code, appid })
        }
      }
    })
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  }

  componentDidHide() { }

  render() {
    const { global: { pixelRatio }, route } = this.props

    return (
      <View className='login'>
        <View className={`avatar ${pixelRatio == 3 ? 'avatar-3x' : 'avatar-2x'}`}></View>
        <Text className="login-title">登录</Text>
        <Text className="login-tips">请允许微信授权以获取你的身份信息</Text>
        <View className="login-btn">立即登录</View>
      </View>
    )
  }
}

export default Login
