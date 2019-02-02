import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connectLogin, withShare } from '../../utils/helper'
import { refund, getOrder } from '../../actions/order'
import { formatDate, formatWeek, formatHour,formatNormalDate } from '../../utils/tool'
import './index.less'


const TYPE_CLASSES = {
  '0':'unArrived',
  '1':'arrived',
  '-1':'canceled',
  '-2':'outdate'
}
@connectLogin
@withShare()
class BookInfo extends Component {

  state = {
    date: '',
    weekDay: '',
    startTime: '',
    endTime: '',
    status: '',
    statusText: '',
    shop:{},
    exercises:[],
    checkout:{}
  }
  config = {
    navigationBarTitleText: 'CirCle30'
  }
  scan() {
    Taro.scanCode({
      onlyFromCamera: true
    }).then(res => {
      console.log(res)
    })
  }
  componentWillUnmount() { }

  componentDidShow() {
    const { id } = this.$router.params
    getOrder(id).then(res => {
      if (res.data) {
        const order = res.data
        const nowTime = (new Date()).getTime()
        const orderStartTime = order.schedule.course.start
        const orderEndTime = order.schedule.course.end
        const date = formatDate(orderStartTime)
        const weekDay = formatWeek(orderStartTime)
        const startTime = formatHour(orderStartTime)
        const endTime = formatHour(orderEndTime)
        let status = 0
        let statusText = ''
        const overTime = nowTime > orderStartTime
        if (overTime) {
          status = 0
          statusText = '待预约'
        } else {
          if (arrive) {
            status = 1
            statusText = '已训练'
          } else {
            if (refund) {
              status = -1
              statusText = '已取消'
            } else {
              status = -2
              statusText = '已过期'
            }
          }
        }
        const shop = order.schedule.shop
        const checkout = order.checkout
        let exercise=[]
        if(order.schedule.device){
          exercises = getUniqueExercise(order.schedule)
        }
        this.setState({
          date,
          weekDay,
          startTime,
          endTime,
          status,
          statusText,
          shop,
          exercise,
          checkout
        })
      }
    })
  }
  toStore(e){
    const storeId = e.currentTarget.dataset.id
    Taro.navigateTo({
      url:`/pages/store/index?id=${storeId}`
    })
  }
  componentDidHide() { }
  $setShareTitle() {
    return '分享预约订单 | CirCle30'
  }
  $setSharePath() {
    return '/pages/bookInfo/index'
  }
  $setShareImageUrl() {
    return ''
  }
  render() {
    const { users, date, weekDay,
      startTime,
      endTime,
      status,
      checkout,
      shop,
      statusText } = this.state
    return (
      <View className='bookInfo'>
        <View class="book-info-detail">
          <View className="course-info">
            <View className="book-time">
              <Text className="tip">训练时间</Text>
              <Text>{date}<Text className="week">{weekDay}</Text></Text>
              <Text className="time">{startTime}<Text className="timeGap">-</Text>{endTime}</Text>
            </View>
            {status == 0 ? (<View className="sign" onClick={this.scan}>
              <Text className="icon-ic__qiandao iconfont sign-icon"></Text>
              <Text className="sign-text">扫码签到</Text>
            </View>) : <View className={`bookStatus ${TYPE_CLASSES[status]}`}>{statusText}</View>}
          </View>
          <View className="store-info" data-id={shop._id&&shop._id.$oid} onClick={this.toStore}>
            <Text class="title">预约门店</Text>
            <View className="content">
              <View className="left-content">
                <Text className="icon-ic__add iconfont"></Text>
                <View className="address-info">
                  <Text className="store-name">{shop.title}</Text>
                  <Text class="address">{shop.address}</Text>
                </View>
              </View>
              <Text className="icon-ic_more iconfont"></Text>
            </View>
          </View>
          <View className="students-info">
            <Text className="title">预约学员</Text>
            <View className="student-wrapper">
              {
                users.map(user => {
                  return <View class="student">
                    <Image src={user.avatarUrl} />
                    <Text>{user.name}</Text>
                  </View>
                })
              }
            </View>
          </View>
        </View>
        <View className="card">
          <View className="card-title">
            <Text className="verticalIcon"></Text>
            <Text className="card-title-text">训练计划</Text>
          </View>
        </View>
        <View className="exercise-list">
          {exercises.length ? exercise.map((exercise, i) => {
            return (<View className="cell" key={i} onClick={this.toProject} data-title={exercise.title}>
              <View className="exercise-info">
                <Text className="exercise-name">{exercise.title}</Text>
                <View className="exercise-detail">
                  <Text>{exercise.body}</Text>
                  <Text>|</Text>
                  <Text>{exercise.type}</Text>
                </View>
              </View>
              <Text className="icon-ic_more iconfont"></Text>
            </View>)
          }) : <View className="blank-wrapper" ><Image src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_noplan@2x.png" />
              <Text>暂无训练计划</Text>
            </View>}
        </View >
        <View class="order-wrapper">
          <View>
            <Text>订单信息</Text>
            <Text></Text>
          </View>
          <View>
            <Text>订单编号</Text>
            <Text>{checkout._id&&checkout._id.$oid}<View>复制</View></Text>
          </View>
          <View>
            <Text>订单金额</Text>
            <Text>￥{checkout.price&&checkout.price.amount/1000}</Text>
          </View>
          <View>
            <Text>实际支付</Text>
            <Text>{checkout.amount/1000}</Text>
          </View>
          <View>
            <Text>下单时间</Text>
            <Text>{checkout.created&&formatNormalDate(checkout.created.$date.$numberLong)}</Text>
          </View>
        </View>
      </View >
    )
  }
}

export default BookInfo
