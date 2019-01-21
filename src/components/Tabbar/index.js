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
    route: 'index'
  }
  onClick() {

  }
  toHome(){
    Taro.redirectTo({
      url: '/pages/index/index'
    })
  }
  render() {
    const { global: { pixelRatio }, route } = this.props
    return (
      <View className="menu-wrapper" onClick={this.onClick}>
        <View className={`menu ${route == 'index' ? 'on' : ''}`} onClick={this.toHome}>
          <View className={`home-icon ${pixelRatio == 3 ? 'home-icon-3x' : 'home-icon-2x'}`}></View>
          <Text>首页</Text>
        </View>
        <Navigator className={`menu ${route == 'exercise' ? 'on' : ''}`} url="/pages/exercise/index" hover-class="on">
          <View className={`exercise-icon ${pixelRatio == 3 ? 'exercise-icon-3x' : 'exercise-icon-2x'} `} ></View>
          <Text>训练</Text>
        </Navigator>
        <Navigator className={`menu ${route == 'mine' ? 'on' : ''}`} url="/pages/mine/index" hover-class="on">
          <View className={`mine-icon ${pixelRatio == 3 ? 'mine-icon-3x' : 'mine-icon-2x'}`}></View>
          <Text>我的</Text>
        </Navigator>
      </View>
    )
  }
}

export default Tabbar