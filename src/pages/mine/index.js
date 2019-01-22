import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'


import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'


@connect(({ global }) => ({
  global
}))
class Mine extends Component {

  config = {
    navigationBarTitleText: '个人中心'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { global: { pixelRatio }, route } = this.props
    return (
      <View>
        <View className="avatar-wrapper">
          <View className={`avatar ${pixelRatio == 3 ? 'avatar-3x' : 'avatar-2x'}`}></View>
          <Text>刘二狗</Text>
        </View>
        <View>
          <View className="cell">
            <Text>我的训练</Text>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
          <View className="cell">
            <Text>优惠券</Text>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
        </View>
        <View className={`share-img ${pixelRatio == 3 ? 'share-img-3x' : 'share-img-2x'}`}></View>

      </View>
    )
  }
}

export default Mine
