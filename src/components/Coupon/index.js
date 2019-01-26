import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
@connect(({ global }) => ({
    global
}))
class Coupon extends Component {
    static defaultProps = {
        coupon: {},
        used: false
    }
    render() {
        const { global: { pixelRatio } } = this.props
        const { coupon: { amount, title, range }, used } = this.props
        return (
            <View className={`coupon ${pixelRatio == 3 ? 'coupon-3x' : 'coupon-2x'}`} >
                <View className="amount">{amount}<Text class="symbol">￥</Text></View>
                <View className="detail">
                    <Text class="title">{title}</Text>
                    <Text class="range">{range}</Text>
                </View>
                {used ? <View className="useStatus">已领取</View> : null}
            </View>
        )
    }
}

export default Coupon