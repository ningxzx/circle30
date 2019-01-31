import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'

class BookStatus extends Component {

  config = {
    navigationBarTitleText: '预约成功'
  }
  toInfo() {
    const { order_id } = this.$router.params
    Taro.navigateTo({
      url: `/pages/bookInfo/index?order_id=${order_id}`
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


  render() {
    return (
      <View className='bookStatus'>
        <Image className="status-image" src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_8_chenggong@2x.png"></Image>
        <Text className="mainText">预约成功</Text>
        <Text className="subText">请提前到达预约门店签到</Text>
        <Button className="circle-btn info-btn" onClick={this.toInfo}>查看预约详情</Button>
        <Button className="circle-btn sub-btn home-btn" onClick={this.toHome}>返回首页</Button>
      </View>
    )
  }
}

export default BookStatus
