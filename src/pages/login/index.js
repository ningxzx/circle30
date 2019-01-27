import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { login, setUserInfo } from '../../actions/user'
import { wxLogin } from '../../utils/helper'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import { connect } from '@tarojs/redux'

import './index.less'
// @wxLogin
class Login extends Component {
  config = {
    navigationBarTitleText: '登录'
  }

  componentWillReceiveProps(nextProps) {
  }
  componentDidMount() {
    wx.getSetting({
      success: res => {
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
      }
    })
  }
  getUserInfo(e) {
    console.log(e.detail.userInfo)
  }

  render() {
    const ratio = getGlobalData('pixelRatio') === 3 ? '3' : '2'
    const avatarUrl = `cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/default_icon@${ratio}x.png`
    return (
      <View className='login'>
        <Image src={avatarUrl} className="avatar"></Image>
        <Text className="login-title">登录</Text>
        <Text className="login-tips">请允许微信授权以获取你的身份信息</Text>
        <Button className="login-btn" open-type="getUserInfo" onGetUserInfo="getUserInfo">立即登录</Button>
      </View>
    )
  }
}

export default Login
