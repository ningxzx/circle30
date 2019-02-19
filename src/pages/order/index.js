import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, Text } from '@tarojs/components'
import { connectLogin, withShare } from '../../utils/helper'
import { getOrders } from '../../actions/order'
import { formatDate, formatWeek, formatHour } from '../../utils/tool'
import './index.less'
import noplanImage from '../../assets/images/img_noplan@3x.png'


const classNames = {
  '0': '',
  '1': 'finished',
  '-1': 'error',
  '-2': 'error',
}
@connectLogin
@withShare()
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
  swipeTab(e) {
    if ("touch" === e.detail.source) {
      let current = e.detail.current == 0 ? 'future' : 'ongoing'
      this.setState({
        current
      })
    }
  }
  getOrderList() {
    Taro.showLoading({ title: '请求中...' })
    const user_id = Taro.getStorageSync('user_id')
    getOrders({
      user_id,
      checkout_status: 'done'
    }).then(res => {
      Taro.hideLoading()
      const orders = res.data
      const nowTime = (new Date()).getTime()
      orders.forEach(order => {
        const orderStartTime = order.schedule.course.start
        const orderEndTime = order.schedule.course.end
        order.date = formatDate(orderStartTime)
        order.weekDay = formatWeek(orderStartTime)
        order.startTime = formatHour(orderStartTime)
        order.endTime = formatHour(orderEndTime)
        order.shopTitle = order.schedule.shop.title

        const overTime = nowTime < orderEndTime * 1000
        if (order.refund) {
          order.status = -1
          order.statusText = '已取消'
        } else {
          if (overTime) {
            order.status = 0
            order.statusText = '待预约'
          } else {
            if (order.arrive) {
              order.status = 1
              order.statusText = '已训练'
            } else {
              order.status = -2
              order.statusText = '已过期'
            }
          }
        }
      })
      this.setState({
        oldOrders: orders.filter(x => x.status !== 0).sort((a, b) => {
          return a.schedule.course.start > b.schedule.course.start ? -1 : 1
        }),
        newOrders: orders.filter(x => x.status === 0).sort((a, b) => {
          return a.schedule.course.start > b.schedule.course.start ? 1 : -1
        })

      })
    })
  }
  componentDidShow() {
    this.getOrderList()
  }
  toBookInfo(e) {
    const id = e.currentTarget.dataset.id
    Taro.navigateTo({
      url: `/pages/bookInfo/index?id=${id}`
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
          <Swiper current={current == 'future' ? 0 : 1} className="order-list-swiper" onChange={this.swipeTab}>
            <SwiperItem className={`order-list-wrapper ${newOrders.length ? '' : 'blank'}`}>
              {newOrders.length ? newOrders.map((order, i) => {
                return (<View className="cell" key={i} onClick={this.toBookInfo} data-id={order._id.$oid}>
                  <View className="left-content">
                    <Text className="date-str"><Text>{order.date}</Text><Text className="week-day">{order.weekDay}</Text></Text>
                    <Text className="time-str">{order.startTime}<Text className="timeGap">-</Text>{order.endTime}</Text>
                    <Text className="shop-str">{order.shopTitle}</Text>
                  </View>
                  <View>
                    <Text className="icon-ic_more iconfont"></Text>
                  </View>
                </View>)
              }) : (<View className="blank-wrapper" >
                <Image src={noplanImage} />
                <Text>暂无训练计划</Text>
              </View>)}
            </SwiperItem>
            <SwiperItem className={`order-list-wrapper ${oldOrders.length ? '' : 'blank'}`}>
              {oldOrders.length ? oldOrders.map((order, i) => {
                return (<View className="cell" key={i} onClick={this.toBookInfo} data-id={order._id.$oid}>
                  <View className="left-content">
                    <Text className="date-str"><Text>{order.date}</Text><Text className="week-day">{order.weekDay}</Text></Text>
                    <Text className="time-str">{order.startTime}<Text className="timeGap">-</Text>{order.endTime}</Text>
                    <Text className="shop-str">{order.shopTitle}</Text>
                  </View>
                  <View>
                    <Text className={`order-status ${classNames[order.status]}`}>{order.statusText}</Text>
                    <Text className="icon-ic_more iconfont"></Text>
                  </View>
                </View>)
              }) : <View className="blank-wrapper" ><Image src={noplanImage} />
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
