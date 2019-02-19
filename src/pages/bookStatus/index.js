import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connectLogin, withShare } from '../../utils/helper'
import { PostButton } from '../../components'
import './index.less'
import successImage from '../../assets/images/img_8_chenggong@3x.png'

@connectLogin
@withShare()
class BookStatus extends Component {

  config = {
    navigationBarTitleText: '预约成功'
  }
  toInfo() {
    const { order_id } = this.$router.params
    Taro.navigateTo({
      url: `/pages/bookInfo/index?id=${order_id}`
    })
  }
  toHome() {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  $setShareTitle() {
    return '预约训练 | CirCle30'
  }
  $setSharePath() {
    const { order_id } = this.$router.params
    return `/pages/bookStatus/index?order_id=${order_id}`
  }
  $setShareImageUrl() {
    return ''
  }

  render() {
    return (
      <View className='bookStatus'>
        <Image className="status-image" src={successImage}></Image>
        <Text className="mainText">预约成功</Text>
        <Text className="subText">请提前到达预约门店签到</Text>
        <PostButton btn-class="circle-btn info-btn" onClick={this.toInfo}>查看预约详情</PostButton>
        <PostButton btn-class="circle-btn sub-btn home-btn" onClick={this.toHome}>返回首页</PostButton>
      </View>
    )
  }
}

export default BookStatus
