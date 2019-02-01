import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, Text } from '@tarojs/components'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import { connectLogin, requestUserId } from '../../utils/helper'
import { getOrders } from '../../actions/order'
import './index.less'
@connectLogin
class Order extends Component {
  constructor() {
    this.state = {
      current: 'future',
      oldOrders: [],
      newOrders: []
    }
  }
  config = {
    navigationBarTitleText: '我的训练'
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
  async getOrderList() {
    const user_id = await requestUserId()
    getOrders({
      user_id
    }).then(res => {
      this.setState({

      })
    })
  }
  render() {
    const { current } = this.state
    return (
      <View className='order'>
        <View className="tabHeaderWrapper">
          <View className={`tabHeader ${current == 'future' ? 'on' : ''}`} data-idx='future' onClick={this.tapTab}>待训练</View>
          <View className={`tabHeader ${current == 'ongoing' ? 'on' : ''}`} data-idx='ongoing' onClick={this.tapTab}>历史训练</View>
        </View>
        <View className="tabPaneWrapper">
          <Swiper circular current={current == 'future' ? 0 : 1} className="order-list-swiper">
            <SwiperItem className="order-list-wrapper">
              {newOrders.length ? newOrders.map((order, i) => {
                return (<View className="cell" key={i} onClick={this.toBookInfo} data-id={order._id.$oid}>
                  <View className="left-content">
                    <Text>{order.date}</Text>
                    <Text>{order.startTime}<Text className="timeGap">-</Text>{order.endTime}</Text>
                    <Text>{order.shopTitle}</Text>
                  </View>
                </View>)
              }) : <View className="blank-wrapper" ><Image src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_noplan@2x.png" />
                  <Text>暂无训练计划</Text>
                </View>}
            </SwiperItem>
            <SwiperItem className="order-list-wrapper">
              {oldOrders.length ? newOrders.map((order, i) => {
                return (<View className="cell" key={i} onClick={this.toBookInfo} data-id={order._id.$oid}>
                  <View className="left-content">
                    <Text>{order.date}</Text>
                    <Text>{order.startTime}<Text className="timeGap">-</Text>{order.endTime}</Text>
                    <Text>{order.shopTitle}</Text>
                  </View>
                  <View className="right-content">>
                <Text>{order.statusText}</Text>
                  </View>
                </View>)
              }) : <View className="blank-wrapper" ><Image src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_noplan@2x.png" />
                  <Text>暂无训练计划</Text>
                </View>}
            </SwiperItem>
          </Swiper>
        </View>
      </View>
    )
  }
}

export default Order
