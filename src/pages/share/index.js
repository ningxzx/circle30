import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connectLogin } from '../../utils/helper'

import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import { Coupon } from '../../components'
import { createShareCoupon, verifyShareCoupon } from '../../actions/coupons'
import { getSingleUser } from '../../actions/user'
import { getSystemConfig } from '../../actions/system'
import './index.less'
import logoImage from '../../assets/images/img_logo@3x.png'
import defaultIconImage from '../../assets/images/default_icon@3x.png'

@connectLogin
class Share extends Component {
  state = {
    coupon: {},
    type: 'toShare',
    recieved: false
  }

  config = {
    navigationBarTitleText: '邀请好友'
  }
  componentDidMount() {
    const { type } = this.$router.params
    if (type == 'shareBy') {
      wx.hideShareMenu()
      getSystemConfig().then(res => {
        const {coupons} = res.data

        const newer_coupon = coupons.filter(x=>x.type=='new_arrival')[0]
        setGlobalData('newer_coupon', newer_coupon)
        const coupon_id = newer_coupon._id.$oid
        const user_id = Taro.getStorageSync('user_id')
        const { token_id, share_user_id } = this.$router.params
        if (token_id && share_user_id) {
          Taro.showLoading({
            title: '请求中...'
          })
          Promise.all([verifyShareCoupon({
            coupon_id,
            user_id,
            token_id
          }), getSingleUser(share_user_id)]).then(resArr => {
            const [res1, res2] = resArr
            Taro.hideLoading()
            if (res2.data) {
              const { username, avatar } = res2.data
              console.log(user_id, share_user_id)
              this.setState({
                type,
                recieved: user_id !== share_user_id,
                coupon: newer_coupon,
                userName: username,
                avatarUrl: avatar
              })
            }
          }).catch(() => {
            Taro.showModal({
              title: '请求出错！',
              content: '请检查网络连接后重试',
              showCancel: false
            })
          })
        }
      })
    } else {
      this.setState({
        type,
        recieved: false,
        coupon: type === 'toShare' ? getGlobalData('invite_coupon') : getGlobalData('newer_coupon'),
        userName: Taro.getStorageSync('nickName'),
        avatarUrl: Taro.getStorageSync('avatarUrl')
      })
      Taro.showLoading()
      const user_id = Taro.getStorageSync('user_id')
      const invite_coupon = getGlobalData('invite_coupon')
      const coupon_id = invite_coupon._id.$oid
      createShareCoupon({
        coupon_id,
        user_id
      }).then(res => {
        Taro.hideLoading()
        if (res.data._id) {
          this.setState({
            token_id: res.data._id.$oid
          })
        }
      })
    }
    Taro.setNavigationBarTitle({
      title: type === 'shareBy' ? '好友邀请' : '邀请好友'
    })
  }
  onShareAppMessage() {
    const url = `pages/share/index?type=shareBy&token_id=${this.state.token_id}&share_user_id=${Taro.getStorageSync('user_id')}`
    return {
      title: '送你一张CirCle30减脂训练体验券，跟我一起来锻炼吧！',
      path: url,
      imageUrl: ''
    }
  }
  jumpToBook() {
    Taro.navigateTo({
      url: '/pages/book/index'
    })
  }
  componentDidShow() { }

  componentDidHide() { }

  render() {
    const pixelRatio = getGlobalData('pixelRatio')
    const { coupon, type, recieved, avatarUrl, userName } = this.state
    return (
      <View className='share'>
        <View class="logo-wrapper">
          <Image src={logoImage}></Image>
          <View class="circle"></View>
        </View>
        {type === 'shareBy' ? (<View className="content shareBy">
          <Image className="avatar" src={avatarUrl || defaultIconImage}></Image>
          <Text className="userName">{userName}</Text>
          <Text className="mainTitle">我正在参加CirCle30减脂训练</Text>
          <Text className="subTitle">送你一张体验券，一起来锻炼吧！</Text>
        </View>) : (<View className="content toShare">
          <Text className="mainTitle">邀请好友</Text>
          <Text className="mainTitle">各得30元代金券</Text>
          <Text className="subTitle">好友注册成功后</Text>
          <Text className="subTitle">代金券将会自动发放至你的账户中</Text>
        </View>)}
        <Coupon recieved={recieved} coupon={coupon}></Coupon>
        {type === 'shareBy' ? <Button className="gotoBook" onClick={this.jumpToBook}>立即预约训练</Button> : <Button className="gotoBook" openType="share" >立即邀请好友</Button>}
      </View>
    )
  }
}

export default Share
