import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connectLogin, withShare } from '../../utils/helper'
import { PostButton } from '../../components'
import { refundOrder, getOrder } from '../../actions/order'
import { getTheSchedule } from '../../actions/schedule'
import { formatDate, formatWeek, formatHour, formatNormalDate, getUniqueExercise } from '../../utils/tool'
import './index.less'
import noplanImage from '../../assets/images/img_noplan@3x.png'



const TYPE_CLASSES = {
  '0': 'unArrived',
  '1': 'arrived',
  '-1': 'canceled',
  '-2': 'outdate'
}
@connectLogin
@withShare()
class BookInfo extends Component {

  state = {
    orderId: '',
    orderUser: {},
    orderStartTime: 0,
    date: '',
    weekDay: '',
    startTime: '',
    endTime: '',
    status: '',
    statusText: '',
    shop: {},
    exercises: [],
    checkout: {}
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

  componentDidShow() {
    const { id } = this.$router.params
    this.setState({
      orderId: id
    })
    Taro.showLoading({ title: '请求中...' })
    getOrder(id).then(res => {
      const _this = this
      if (res.data) {
        const order = res.data
        const orderUser = order.user
        const nowTime = (new Date()).getTime()
        const orderStartTime = order.schedule.course.start
        const orderEndTime = order.schedule.course.end
        const date = formatDate(orderStartTime)
        const weekDay = formatWeek(orderStartTime)
        const startTime = formatHour(orderStartTime)
        const endTime = formatHour(orderEndTime)
        let status = 0
        let statusText = ''
        const overTime = nowTime < orderEndTime * 1000
        if (order.refund) {
          status = -1
          statusText = '已取消'
        } else {
          if (overTime) {
            status = 0
            statusText = '待预约'
          } else {
            if (order.arrive) {
              status = 1
              statusText = '已训练'
            } else {
              status = -2
              statusText = '已过期'
            }
          }
        }
        const shop = order.schedule.shop
        const checkout = order.checkout
        if (order.schedule) {
          const { _id: { $oid }, date } = order.schedule
          getTheSchedule({
            schedule_id: $oid
          }).then(res => {
            Taro.hideLoading()
            if (res.data) {
              try {
                const exercises = getUniqueExercise([res.data])
                let users = res.data.courses.filter(x => x.start === orderStartTime)[0]['users']
                _this.setState({
                  exercises,
                  users
                })
              } catch (err) {
                console.log(err)
              }
            }
          })
        }
        this.setState({
          date,
          weekDay,
          startTime,
          endTime,
          status,
          statusText,
          shop,
          checkout,
          orderStartTime,
          orderUser
        })
      }
    })
  }
  toStore(e) {
    const storeId = e.currentTarget.dataset.id
    Taro.navigateTo({
      url: `/pages/store/index?id=${storeId}`
    })
  }
  copyOrderId() {
    const { checkout } = this.state
    if (checkout) {
      const orderId = checkout._id && checkout._id.$oid
      if (orderId) {
        Taro.setClipboardData({ data: orderId })
      }
    }
  }
  handleRefund() {
    const { checkout } = this.state
    const amount = checkout.amount / 100
    if (amount) {
      Taro.showModal({
        title: '取消预约',
        content: '已支付的金额会在1-3日内退还至你的支付账户',
        cancelText: '再想想',
        cancelColor: '#999',
        confirmText: '取消预约',
        cancelColor: '#FF747C',
        success: (res) => {
          if (res.confirm) {
            this.refund()
          }
        }
      })
    } else {
      Taro.showModal({
        title: '',
        content: '确定要取消预约吗？',
        cancelText: '再想想',
        cancelColor: '#999',
        confirmText: '取消预约',
        cancelColor: '#FF747C',
        success: (res) => {
          if (res.confirm) {
            this.refund()
          }
        }
      })
    }

  }
  refund() {
    const { orderId } = this.state
    Taro.showLoading({
      title:'取消中...'
    })
    refundOrder(orderId).then(res => {
      Taro.hideLoading()
      const data = res.data
      if (data.code == 200) {
        Taro.showToast({
          icon: 'success',
          duration: 5000,
          title: '已取消预约'
        }).then((res) => {
          Taro.redirectTo({
            url:`/pages/bookInfo/index?id=${orderId}`
          })
        })
      } else{
        Taro.showModal({
          title: '错误提示',
          content: '订单取消失败',
          showCancel:false
        })
      }
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
      exercises,
      statusText, orderUser, orderStartTime } = this.state
    const nowTime = (new Date()).getTime()
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
          <View className="store-info" data-id={shop._id && shop._id.$oid} onClick={this.toStore}>
            <Text class="title">预约门店</Text>
            <View className="content">
              <View className="left-content">
                <Text className="icon-ic__add iconfont"></Text>
                <View className="address-info">
                  <View className="store-name">{shop.title}</View>
                  <View class="address">{shop.address}</View>
                </View>
              </View>
              <Text className="icon-ic_more iconfont"></Text>
            </View>
          </View>
          {users.length ? <View className="students-info">
            <Text className="title">预约学员</Text>
            <View className="student-wrapper">
              {
                users.map((user, i) => {
                  return <View className="student" key={i}>
                    <Image src={user.avatar} />
                    <Text>{user.username}</Text>
                  </View>
                })
              }
            </View>
          </View> : null}
        </View>
        <View className="card">
          <View className="card-title">
            <Text className="verticalIcon"></Text>
            <Text className="card-title-text">训练计划</Text>
          </View>
        </View>
        <View className="exercise-list">
          {exercises.length ? exercises.map((exercise, i) => {
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
          }) : <View className="blank-wrapper" ><Image src={noplanImage} />
              <Text>暂无训练计划</Text>
            </View>}
        </View >
        <View className="order-wrapper">
          <View className="order-info">
            <View>
              <Text className="order-info-title">订单信息</Text>
            </View>
            <View>
              <Text>订单编号</Text>
              <View className="copy-wrapper">{checkout._id && checkout._id.$oid}<PostButton onClick={this.copyOrderId} btn-class='copy-btn'>复制</PostButton></View>
            </View>
            <View>
              <Text>订单金额</Text>
              <Text>￥{checkout.price && checkout.price.amount / 100}</Text>
            </View>
            <View>
              <Text>实际支付</Text>
              <Text>{checkout.amount / 100}</Text>
            </View>
            <View>
              <Text>下单时间</Text>
              <Text>{checkout.created && formatNormalDate(checkout.created.$date.$numberLong)}</Text>
            </View>
          </View>
          {(status == 0 && (orderStartTime * 1000 - nowTime > 7200000) && (orderUser._id && orderUser._id.$oid) == Taro.getStorageSync('user_id')) ?
            <View className="refund-wrapper">
              <PostButton onClick={this.handleRefund} btn-class='refund-btn'>取消预约</PostButton>
              <Text>* 请在训练开始前到达门店，提前10分钟即可签到</Text>
              <Text>* 训练开始前2小时内不支持取消预约</Text>
              <Text>* 训练结束后仍未签到，预约订单将会自动失效</Text>
            </View> : null}
        </View>
      </View >
    )
  }
}

export default BookInfo
