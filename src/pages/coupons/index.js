import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'

@connect(({ global }) => ({
  global
}))
class CouponList extends Component {
  config = {
    navigationBarTitleText: '我的卡券'
  }
  state = {
    coupons: [
      { amount: 30, title: '新用户体验券', range: '所有门店通用' },
      { amount: 12, title: '邀请好友奖励', range: '所有门店通用' }
    ]
  }
  selectCoupon(e) {

  }
  render() {
    const { global: { pixelRatio } } = this.props
    const { coupons } = this.state
    return (
      <View className="coupon-list">
        {coupons.length ? coupons.map((coupon, i) => {
          const { amount, title, range } = coupon
          return (<View className={`coupon ${pixelRatio == 3 ? 'coupon-3x' : 'coupon-2x'}`} >
            <View className="amount">{amount}<Text class="symbol">￥</Text></View>
            <View className="detail">
              <Text class="title">{title}</Text>
              <Text class="range">{range}</Text>
            </View>
          </View>)
        }) : <View className="no-coupon-wrapper" ><Image className="no-coupon" src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_12_wuquan@2x.png"></Image><View className="no-coupon-text">暂无优惠券</View></View>}
      </View>
    )
  }
}

export default CouponList