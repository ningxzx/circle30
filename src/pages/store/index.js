import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Swiper, SwiperItem } from '@tarojs/components'
import { connectLogin } from '../../utils/helper'
import { addDayStr } from '../../utils/tool'
import { WeekDate } from '../../components'
import { getTheShop, getShopUsers } from '../../actions/shop'
import { getSchedules } from '../../actions/schedule'
import './index.less'

@connectLogin
class Store extends Component {
  state = {
    id: '',
    title: "",
    phone: "",
    status: "enable",
    location: {},
    service_time: {
      "open": "00:00",
      "close": "24:00"
    },
    address: "",
    description: "",
    images: [],
    studentsNum: 0,
    avatars: [],
    cources: [
      { name: '划船', body: '全身', type: '动态保持' },
      { name: '过头蹲', body: '全身', type: '动态保持' },
      { name: '引体向上', body: '全身', type: '动态保持' }
    ],
  }

  config = {
    navigationBarTitleText: '门店详情'
  }
  jumpToBook() {
    const { id, title } = this.state
    Taro.setNavigationBarTitle(title)
    Taro.navigateTo({
      url: `/pages/book/index?storeId=${id}&storeTitle=${title}`
    })
  }
  toStudents() {
    const { id } = this.state
    Taro.navigateTo({
      url: `/pages/students/index?storeId=${id}`
    })
  }
  componentDidMount() {
    const { id, title } = this.$router.params
    Taro.setNavigationBarTitle({
      title: title
    })
    // 查询门店详情
    getTheShop({
      shop_id: id
    }).then(res => {
      const { _id: { $oid }, service_time, title, phone, location, images, description, status, address } = res.data
      this.setState({ id: $oid, service_time, title, phone, location, images, description, status, address })
    })
    // 查询预约过的用户
    getShopUsers({
      shop_id: id
    }).then(res => {
      const studentsNum = res.data.length
      const avatars = res.data.map(user => {
        return user.avatar
      })
      this.setState({
        studentsNum,
        avatars
      })
    })
    // 查询训练
    getSchedules({
      shop_id: id,
      date:addDayStr()
    }).then(res=>{

    })

  }
  makePhoneCall() {
    const { phone } = this.state
    Taro.makePhoneCall({
      phoneNumber: phone
    })
  }
  openMap() {
    const { location: { lat, lng } } = this.state
    Taro.openLocation({
      latitude: lat,
      longitude: lng
    })
  }
  componentDidHide() { }

  render() {
    const { title, service_time, phone, description, address, images, studentsNum, avatars } = this.state
    return (
      <View className='store'>
        <Swiper
          className='store-banner'
          indicatorColor='#b3b3b3'
          indicatorActiveColor='#14d0b4'
          circular
          indicatorDots
          autoplay>
          {images.map(banner => {
            return <SwiperItem>
              <Image src={banner}></Image>
            </SwiperItem>
          })
          }
        </Swiper>
        <View className="store-info ">
          <View className="name">{title}</View>
          <View className="office-hours">
            <Text className="info-text"><Text className="icon-ic__time iconfont"></Text>{`${service_time.open} - ${service_time.close}`}</Text>
          </View>
          <View className="tel" onClick={this.makePhoneCall}>
            <Text className="info-text"><Text className="icon-ic__phone iconfont"></Text>{phone}</Text>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
          <View className="location" onClick={this.openMap}>
            <Text className="info-text"><Text className="icon-ic__shopadd iconfont"></Text>{address}</Text>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
          <View className="students" onClick={this.toStudents}>
            <View className="period-avatars-wrapper">
              {avatars.slice(0, 4).map((src, i) => {
                return <View className="period-avatars" key={i} style={{ left: `${i * 48}rpx`, zIndex: (5 - i) * 100 }}><View className="mini-avatar" style={{ backgroundImage: `url(${src})` }}></View></View>
              })}
              {avatars.length > 4 ? <View className="period-avatars show-more-avatar" key={i}><View className="show-more-points">
                <Text className="point"></Text>
                <Text className="point"></Text>
                <Text className="point"></Text>
              </View>
              </View> : null}
            </View>
            <Text>{`${studentsNum}位学员`}</Text>
          </View>
          <View className="description"><Text>{description}</Text></View>
        </View>
        <View className="card">
          <View className="card-title">
            <Text className="verticalIcon"></Text>
            <Text className="card-title-text">训练计划</Text>
          </View>
          <WeekDate />
        </View>
        <View className="exercise-list">
          <View className="gap"></View>
          {cources.length ? cources.map((cource, i) => {
            return (<View className="cell" key={i}>
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
        <Button className="book-btn" onClick={this.jumpToBook}>立即预约</Button>
      </View>
    )
  }
}

export default Store
