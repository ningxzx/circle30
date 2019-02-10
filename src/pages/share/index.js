import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connectLogin, requestUserId } from '../../utils/helper'

import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import { Coupon } from '../../components'
import { createShareCoupon, verifyShareCoupon } from '../../actions/coupons'
import './index.less'
@connectLogin
class Share extends Component {
  state = {
    coupon: {
      amount: 30,
      title: '新用户体验券',
      description: '所有门店通用',
      token_id: ''
    },
    // toShare-发出邀请,shareBy-接收邀请
    type: 'toShare',
    used: false
  }

  config = {
    navigationBarTitleText: '邀请好友'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  async componentDidMount() {
    const { type } = this.$router.params
    this.setState({
      type,
      used: type !== 'toShare'
    })
    if (type == 'shareBy') {
      wx.hideShareMenu()
      const coupon_id = getGlobalData('share_coupon_id')
      const user_id = await requestUserId()
      const { token_id } = this.$router.params
      if (token_id) {
        verifyShareCoupon({
          coupon_id,
          user_id,
          token_id
        }).then(res => {

        })
      }
    } else {
      Taro.showLoading()
      const user_id = await requestUserId()
      const coupon_id = getGlobalData('share_coupon_id')
      createShareCoupon({
        coupon_id,
        user_id
      }).then(res => {
        Taro.hideLoading()
        if (res.code === 0) {
          this.setState({
            token_id: res._id.$oid
          })
        }
      })
    }
    Taro.setNavigationBarTitle({
      title: type === 'shareBy' ? '好友邀请' : '邀请好友'
    })
  }
  onShareAppMessage() {
    const url = this.state.token_id
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
    const { coupon, type, used } = this.state
    const ratio = pixelRatio === 3 ? '3' : '2'
    return (
      <View className='share'>
        <View class="logo-wrapper">
          <Image src={`cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_logo@${ratio}x.png`}></Image>
          <View class="circle"></View>
        </View>
        {type === 'shareBy' ? (<View className="content shareBy">
          <Image className="avatar" src={`cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/default_icon@${ratio}x.png`}></Image>
          <Text className="userName">刘二狗</Text>
          <Text className="mainTitle">我正在参加CirCle30减脂训练</Text>
          <Text className="subTitle">送你一张体验券，一起来锻炼吧！</Text>
        </View>) : (<View className="content toShare">
          <Text className="mainTitle">邀请好友</Text>
          <Text className="mainTitle">各得30元代金券</Text>
          <Text className="subTitle">好友注册成功后</Text>
          <Text className="subTitle">代金券将会自动发放至你的账户中</Text>
        </View>)}
        <Coupon used={used} coupon={coupon}></Coupon>
        {type === 'shareBy' ? <Button className="gotoBook" onClick={this.jumpToBook}>立即预约训练</Button> : <Button className="gotoBook" openType="share" >立即邀请好友</Button>}
      </View>
    )
  }
}

export default Share
