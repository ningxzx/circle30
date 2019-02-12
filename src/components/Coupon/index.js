import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'

import './index.less'
class Coupon extends Component {
    static defaultProps = {
        coupon: {},
        used: false
    }
    render() {
        const pixelRatio = getGlobalData('pixelRatio')
        const { coupon: { amount, title, description }, used} = this.props
        return (
            <View className={`coupon ${pixelRatio == 3 ? 'coupon-3x' : 'coupon-2x'}`}>
                <View className="amount">{amount/100}<Text class="symbol">￥</Text></View>
                <View className="detail">
                    <Text class="title">{title}</Text>
                    <Text class="range">{description}</Text>
                </View>
                {used ? <View className="useStatus">已领取</View> : null}
            </View>
        )
    }
}

export default Coupon