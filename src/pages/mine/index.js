import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connectLogin, withShare } from '../../utils/helper'
import { get as getGlobalData } from '../../utils/globalData'
import './index.less'
import iconImage from '../../assets/images/default_icon@3x.png'

@connectLogin
@withShare()
class Mine extends Component {
  config = {
    navigationBarTitleText: '个人中心'
  }
  toExercise() {
    Taro.switchTab({
      url: '/pages/order/index'
    })
  }
  toCoupons() {
    Taro.navigateTo({
      url: '/pages/coupons/index'
    })
  }
  toShare() {
    Taro.navigateTo({
      url: '/pages/share/index?type=toShare'
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const pixelRatio = getGlobalData('pixelRatio') === 3 ? '3' : '2'
    const avatarUrl = Taro.getStorageSync('avatarUrl') || iconImage
    console.log(avatarUrl)
    const nickName = Taro.getStorageSync('nickName')
    return (
      <View>
        <View className="avatar-wrapper">
          <View className='avatar' style={{ backgroundImage: `url(${avatarUrl})` }}></View>
          <Text>{nickName}</Text>
        </View>
        <View>
          <View className="cell" onClick={this.toExercise}>
            <Text>我的训练</Text>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
          <View className="cell" onClick={this.toCoupons}>
            <Text>优惠券</Text>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
        </View>
        <View className={`share-img ${pixelRatio == 3 ? 'share-img-3x' : 'share-img-2x'}`} onClick={this.toShare}></View>
      </View>
    )
  }
}

export default Mine
