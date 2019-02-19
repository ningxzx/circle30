import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { withShare,saveUserInfo } from '../../utils/helper'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'

import './index.less'
import defaultIconImage from '../../assets/images/default_icon@3x.png'

@withShare()
class Login extends Component {
  state={
    avatarUrl:''
  }
  config = {
    navigationBarTitleText: '登录'
  }

  componentWillReceiveProps(nextProps) {
  }
  async componentDidMount() {
    const res = await Taro.getSetting()
    if(res.authSetting['scope.userInfo']){
      const res =await Taro.getUserInfo()
      this.handleUserInfo(res.userInfo)
    }
  }
  getUserInfo(e) {
    this.handleUserInfo(e.detail.userInfo)
    Taro.navigateBack({
      delta: 1
    })
  }
  handleUserInfo(info){
    const {avatarUrl} = info
    saveUserInfo(info)
    this.setState({
      avatarUrl
    })
  }

  render() {
    const defaultAvatarUrl = defaultIconImage
    return (
      <View className='login'>
        <Image src={this.state.avatarUrl||defaultAvatarUrl} className="avatar"></Image>
        <Text className="login-title">登录</Text>
        <Text className="login-tips">请允许微信授权以获取你的身份信息</Text>
        <Button className="login-btn" open-type="getUserInfo" onGetUserInfo={this.getUserInfo}>立即登录</Button>
      </View>
    )
  }
}

export default Login
