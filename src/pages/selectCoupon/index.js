import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Icon } from '@tarojs/components'
import { connectLogin, requestUserId, withShare } from '../../utils/helper'
import { Coupon } from '../../components'
import { getCoupons } from '../../actions/coupons'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import './index.less'
@connectLogin
@withShare()
class SelectCoupon extends Component {
    config = {
        navigationBarTitleText: '我的卡券'
    }
    state = {
        coupons: []
    }
    componentDidShow() {
        this.getUserCoupons()
    }
    async getUserCoupons() {
        const user_id = await requestUserId()
        getCoupons({
            user_id
        }).then(res => {
            const coupons = res.data
            this.setState({ coupons })
        })
    }
    selectCoupon(e) {
        const i = e.currentTarget.dataset.idx
        this.setState({
            selectIndex:i
        }, () => {
            const pages = Taro.getCurrentPages()
            const lastPage = pages[pages.length - 2]
            if (lastPage && lastPage.route === 'pages/book/index') {
                const { coupons } = this.state
                const idx = i
                setGlobalData('selectCoupon', coupons[idx])
                Taro.navigateBack({
                    delta: 1
                })
            }
        })
    }
    render() {
        const { coupons, selectIndex } = this.state
        return (
            <View className={`coupon-list ${!coupons.length ? 'no-coupon' : ''}`}>
                {coupons.length ? coupons.map((coupon, i) => {
                    return (<View className={`coupon ${selectIndex == i ? 'active' : ''}`} onClick={this.selectCoupon} key={i} data-idx={i}>
                        <View className="amount">{coupon.amount / 1000}<Text class="symbol">￥</Text></View>
                        <View className="detail">
                            <Text class="title">{coupon.title}</Text>
                            <Text class="range">{coupon.description}</Text>
                        </View>
                        {selectIndex == i ? <Icon type='success' className="selectIcon" /> : <View className="circle"></View>}
                    </View>)
                }) : <View className="no-coupon-wrapper" ><Image className="no-coupon" src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_12_wuquan@2x.png"></Image><View className="no-coupon-text">暂无优惠券</View></View>}
            </View>
        )
    }
}

export default SelectCoupon