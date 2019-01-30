import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Coupon } from '../../components'
import { getCoupons } from '../../actions/coupons'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import './index.less'

class CouponList extends Component {
  config = {
    navigationBarTitleText: '我的卡券'
  }
  state = {
    coupons: [
      { amount: 30, title: '新用户体验券', description: '所有门店通用' },
      { amount: 12, title: '邀请好友奖励', description: '所有门店通用' }
    ]
  }
  componentDidShow() {
    this.getUserCoupons()
  }
  getUserCoupons() {
    let user_id = Taro.getStorageSync('user_id')
    getCoupons({
      user_id
    }).then(res => {
      // const coupons = res.data
      // this.setState({ coupons })
    })
  }
  selectCoupon(e) {
    const pages = Taro.getCurrentPages()
    const lastPage = pages[pages.length - 2]
    if (lastPage.route === 'pages/book/index') {
      const { coupons } = this.state
      const idx = e.currentTarget.dataset.idx
      setGlobalData('selectCoupon', coupons[idx])
      Taro.navigateBack({
        delta: 1
      })
    }
  }
  render() {
    const { coupons } = this.state
    return (
      <View className={`coupon-list ${!coupons.length ? 'no-coupon' : ''}`}>
        {coupons.length ? coupons.map((coupon, i) => {
          return <View className="coupon-item" onClick={this.selectCoupon} key={i} data-idx={i}><Coupon hasMargin={true} coupon={coupon}></Coupon></View>
        }) : <View className="no-coupon-wrapper" ><Image className="no-coupon" src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_12_wuquan@2x.png"></Image><View className="no-coupon-text">暂无优惠券</View></View>}
      </View>
    )
  }
}

export default CouponList