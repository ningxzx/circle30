import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { withShare, saveWxUserInfo, saveUserInfo } from '../../utils/helper'
import { getSessionKey, getUser, decryptData, register, putOpenid, getSingleUser, putUser } from '../../actions/user'
import { APP_ID } from '../../constants/app.js'
import './index.less'
import defaultIconImage from '../../assets/images/default_icon@3x.png'

@withShare()
class Login extends Component {
  state = {
    avatarUrl: ''
  }
  config = {
    navigationBarTitleText: '登录'
  }

  componentWillReceiveProps(nextProps) {
  }
  async componentDidMount() {
    const res = await Taro.getSetting()
    if (res.authSetting['scope.userInfo']) {
      const res = await Taro.getUserInfo()
      this.handleUserInfo(res.userInfo)
    }
  }
  getUserInfo(e) {
    Taro.showLoading({
      title: '登录中...'
    })
    this.handleUserInfo(e.detail.userInfo)
    Taro.login().then(res => {
      const { code } = res
      getSessionKey({ code }).then(session => {
        const { openid, session_key } = session.data
        Taro.setStorageSync('openid', openid)
        Taro.setStorageSync('session_key', session_key)
        const { iv, encryptedData } = e.detail
        decryptData({ session: session_key, iv, encrypted: encryptedData }).then(
          unionidres => {
            const { unionId } = unionidres.data
            Taro.setStorageSync('unionid', unionId)
            getUser({ openid }).then(user => {
              const info = user.data
              if (info.length) {
                Taro.hideLoading()
                const user = info[0]
                const { _id: { $oid } } = user
                saveUserInfo(user)
                const { nickName, avatarUrl } = user
                putUser({
                  user_id: $oid,
                  openid,
                  "username": nickName,
                  "avatar": avatarUrl
                })
                Taro.setStorageSync('user_id', $oid)
                Taro.navigateBack({
                  delta: 1
                })
              } else {
                register({
                  unionid: unionId, identifies: [
                    {
                      appid: APP_ID,
                      openid
                    }
                  ],
                  "username": Taro.getStorageSync('nickName'),
                  "avatar": Taro.getStorageSync('avatarUrl')
                }).then(res => {
                  Taro.hideLoading()
                  const { _id: { $oid } } = res.data
                  Taro.setStorageSync('user_id', $oid)
                  Taro.navigateBack({
                    delta: 1
                  })
                }).catch(() => {
                  Taro.showToast({
                    title: '登录失败，请重试',
                    icon: 'none',
                    duration: 2000
                  })
                })
              }
            }).catch(() => {
              Taro.showToast({
                title: '登录失败，请重试',
                icon: 'none',
                duration: 2000
              })
            })
          }
        )
      })
    }).catch(err => {
      Taro.hideLoading()
    })
  }
  handleUserInfo(info) {
    const { avatarUrl } = info
    saveWxUserInfo(info)
    this.setState({
      avatarUrl
    })
  }

  render() {
    const defaultAvatarUrl = defaultIconImage
    return (
      <View className='login'>
        <Image src={this.state.avatarUrl || defaultAvatarUrl} className="avatar"></Image>
        <Text className="login-title">登录</Text>
        <Text className="login-tips">请允许微信授权以获取你的身份信息</Text>
        <Button className="login-btn" open-type="getUserInfo" onGetUserInfo={this.getUserInfo}>立即登录</Button>
      </View>
    )
  }
}

export default Login
