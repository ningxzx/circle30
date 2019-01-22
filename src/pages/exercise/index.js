import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'


@connect(({ counter }) => ({
  counter
}))
class Exercise extends Component {
  constructor() {
    this.state = {
      current: 'future'
    }
  }
  config = {
    navigationBarTitleText: '我的训练'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  tapTab(e) {
    this.setState({
      current: e.currentTarget.dataset.idx
    })
  }
  pagechange(e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  }
  render() {
    const { current } = this.state
    return (
      <View className='exercise'>
        <View className="tabHeaderWrapper">
          <View className={`tabHeader ${current == 'future' ? 'on' : ''}`} data-idx='future' onClick={this.tapTab}>待训练</View>
          <View className={`tabHeader ${current == 'ongoing' ? 'on' : ''}`} data-idx='ongoing' onClick={this.tapTab}>历史训练</View>
        </View>
        <View className="tabPaneWrapper">
          <Swiper circular current={current == 'future' ? 0 : 1} className="exercise-list-swiper">
            <SwiperItem className="exercise-list-wrapper">
              <View className="cell">
                <Text>我的训练</Text>
                <Text className="icon-ic_more iconfont"></Text>
              </View>
              <View className="cell">
                <Text>优惠券</Text>
                <Text className="icon-ic_more iconfont"></Text>
              </View>
            </SwiperItem>
            <SwiperItem className="exercise-list-wrapper">
              <View className="cell">
                <Text>我的训练3</Text>
                <Text className="icon-ic_more iconfont"></Text>
              </View>
              <View className="cell">
                <Text>优惠券</Text>
                <Text className="icon-ic_more iconfont"></Text>
              </View>
            </SwiperItem>
          </Swiper>
        </View>
      </View>
    )
  }
}

export default Exercise
