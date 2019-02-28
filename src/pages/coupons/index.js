import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connectLogin, withShare } from '../../utils/helper'
import { Coupon } from '../../components'
import { getCoupons } from '../../actions/coupons'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import './index.less'
import noCouponImage from '../../assets/images/img_12_wuquan@3x.png'
@connectLogin
@withShare()
class CouponList extends Component {
  config = {
    navigationBarTitleText: '我的卡券'
  }
  state = {
    coupons: []
  }
  componentDidShow() {
    this.getUserCoupons()
  }
  getUserCoupons() {
    const user_id = Taro.getStorageSync('user_id')
    getCoupons({
      user_id
    }).then(res => {
      if (res.statusCode == 200) {
        const coupons = res.data.filter(x => x.used == 0)
        this.setState({ coupons })
      }
    })
  }
  render() {
    const { coupons } = this.state
    return (
      <View className={`coupon-list ${!coupons.length ? 'no-coupon' : ''}`}>
        {coupons.length ? coupons.map((couponObj, i) => {
          const coupon = couponObj.coupon
          return <View className="coupon-item" onClick={this.selectCoupon} key={i} data-idx={i}><Coupon hasMargin={true} coupon={coupon}></Coupon></View>
        }) : <View className="no-coupon-wrapper" ><Image className="no-coupon" src={noCouponImage}></Image><View className="no-coupon-text">暂无优惠券</View></View>}
      </View>
    )
  }
}

export default CouponList