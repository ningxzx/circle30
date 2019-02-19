import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Icon } from '@tarojs/components'
import { connectLogin, requestUserId, withShare } from '../../utils/helper'
import { getCoupons } from '../../actions/coupons'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import './index.less'
import noCouponImage from '../../assets/images/img_12_wuquan@3x.png'

@connectLogin
@withShare()
class SelectCoupon extends Component {
    config = {
        navigationBarTitleText: '我的卡券'
    }
    state = {
        coupons: [],
        selectCouponId: ''
    }
    componentDidShow() {
        this.getUserCoupons()
        if (getGlobalData('selectCoupon')) {
            this.setState({
                selectCouponId: getGlobalData('selectCoupon')._id.$oid
            })
        }
    }
    async getUserCoupons() {
        const user_id = await requestUserId()
        getCoupons({
            user_id
        }).then(res => {
            const coupons = res.data.filter(x => x.used === 0)
            this.setState({ coupons })
        })
    }
    selectCoupon(e) {
        const id = e.currentTarget.dataset.id
        const idx = e.currentTarget.dataset.idx
        const { selectCouponId } = this.state
        if (selectCouponId != id) {
            this.setState({
                selectCouponId: id
            }, () => {
                const { coupons } = this.state
                setGlobalData('selectCoupon', coupons[idx])
                Taro.navigateBack({
                    delta: -1
                })

            })
        } else {
            this.setState({
                selectCouponId: ''
            }, () => {
                setGlobalData('selectCoupon', null)
                Taro.navigateBack({
                    delta: -1
                })
            })
        }
    }
    render() {
        const { coupons, selectCouponId } = this.state
        return (
            <View className={`coupon-list ${!coupons.length ? 'no-coupon' : ''}`}>
                {coupons.length ? coupons.map((couponObj, i) => {
                    const coupon = couponObj.coupon
                    const id = couponObj._id.$oid
                    return (<View className={`coupon ${selectCouponId == id ? 'active' : ''}`} onClick={this.selectCoupon} key={i} data-idx={i} data-id={id}>
                        <View className="amount">{coupon.amount / 100}<Text class="symbol">￥</Text></View>
                        <View className="detail">
                            <Text class="title">{coupon.title}</Text>
                            <Text class="range">{coupon.description}</Text>
                        </View>
                        {selectCouponId == id ? <Icon type='success' className="selectIcon" /> : <View className="circle"></View>}
                    </View>)
                }) : (<View className="no-coupon-wrapper" >
                    <Image className="no-coupon" src={noCouponImage}></Image>
                    <View className="no-coupon-text">暂无优惠券</View>
                </View>)}
            </View>
        )
    }
}

export default SelectCoupon