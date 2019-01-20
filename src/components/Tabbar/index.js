import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Navigator, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
@connect(({ global }) => ({
  global
}))
class Tabbar extends Component {
  static defaultProps = {

  }
  onClick() {

  }
  render() {
    const { global: { pixelRatio } } = this.props
    return (
      <View className="menu-wrapper" onClick={this.onClick}>
        <Navigator className="menu" url="/pages/index/index">
          <View className="home-icon" style={{ backgroundImage: `url('/assets/images/ic_home@${pixelRatio}x.png')` }}></View>
          <Text>首页</Text>
        </Navigator>
        <Navigator className="menu" url="/pages/exercise/index">
          <View className="exercise-icon"></View>
          <Text>训练</Text>
        </Navigator>
        <Navigator className="menu" url="/pages/user/index">
          <View className="mine-icon"></View>
          <Text>我的</Text>
        </Navigator>
      </View>
    )
  }
}

export default Tabbar