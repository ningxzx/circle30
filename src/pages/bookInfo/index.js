import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connectLogin, requestUserId } from '../../utils/helper'
import { refund, getOrder } from '../../actions/order'
import './index.less'


const BOOK_TYPES = {
  unArrived: '训练未开始',
  arrived: '已训练',
  canceled: '已取消',
  outdate: '已过期'
}
@connectLogin
class BookInfo extends Component {

  state = {
    cources: [
      { name: '划船', body: '全身', type: '动态保持' },
      { name: '过头蹲', body: '全身', type: '动态保持' },
      { name: '引体向上', body: '全身', type: '动态保持' }
    ],
    // unArrived-训练未开始，arrived-已训练，canceled-已取消,outdate-已过期
    type: 'arrived',
    users: [
      { avatarUrl: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', name: '刘二狗' },
      { avatarUrl: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', name: '刘三狗子' },
      { avatarUrl: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', name: '哈哈哈哈' },
      { avatarUrl: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', name: '合适的话就我' },
    ]
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
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { 
    const {order_id} = this.$router.params
    getOrder(order_id).then(res=>{
      console.log(res.data)
    })
  }

  componentDidHide() { }

  render() {
    const { cources, type, users } = this.state
    return (
      <View className='bookInfo'>
        <View class="book-info-detail">
          <View className="course-info">
            <View className="book-time">
              <Text className="tip">训练时间</Text>
              <Text>2018年12月21日<Text className="week">周四</Text></Text>
              <Text className="time">19:00-19:30</Text>
            </View>
            {type == 'unArrived' ? (<View className="sign" onClick={this.scan}>
              <Text className="icon-ic__qiandao iconfont sign-icon"></Text>
              <Text className="sign-text">扫码签到</Text>
            </View>) : <View className={`bookStatus ${type}`}>{BOOK_TYPES[type]}</View>}
          </View>
          <View className="store-info">
            <Text class="title">预约门店</Text>
            <View className="content">
              <View className="left-content">
                <Text className="icon-ic__add iconfont"></Text>
                <View className="address-info">
                  <Text className="store-name">优客联邦一期店</Text>
                  <Text class="address">成都市武侯区佳灵路222号优客联邦一期2栋5单元1601室 宽度540px 行距12px</Text>
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
          {cources.length ? cources.map((cource, i) => {
            return (<View className="cell" key={i} onClick={this.toProject} data-title={cource.name}>
              <View className="exercise-info">
                <Text className="exercise-name">{cource.name}</Text>
                <View className="exercise-detail">
                  <Text>{cource.body}</Text>
                  <Text>|</Text>
                  <Text>{cource.type}</Text>
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
            <Text>3284280324023023490<View>复制</View></Text>
          </View>
          <View>
            <Text>订单金额</Text>
            <Text>￥60</Text>
          </View>
          <View>
            <Text>实际支付</Text>
            <Text>￥30</Text>
          </View>
          <View>
            <Text>下单时间</Text>
            <Text>2019-01-27 04:00:00</Text>
          </View>
        </View>
      </View >
    )
  }
}

export default BookInfo
