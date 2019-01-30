import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Swiper, SwiperItem } from '@tarojs/components'
import { connectLogin } from '../../utils/helper'
import { WeekDate } from '../../components'
import { getTheShop } from '../../actions/shop'

import './index.less'

@connectLogin
class Store extends Component {
  state = {
    id:'',
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
    devices: [],
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
    Taro.navigateTo({
      url: `/pages/book/index?storeId=${id}&storeTitle=${title}`
    })
  }
  toStudents() {
    Taro.navigateTo({
      url: '/pages/students/index'
    })
  }
  componentDidShow() {
    const { id, title } = this.$router.params
    Taro.setNavigationBarTitle({
      title: title
    })
    getTheShop({
      shop_id: id
    }).then(res => {
      const { _id: { $oid }, service_time, title, phone, location, images, description, status, address } = res.data
      this.setState({ id: $oid, service_time, title, phone, location, images, description, status, address })
    })
  }

  componentDidHide() { }

  render() {
    const { title, service_time, phone, description, address, images } = this.state
    const studentsNum = 123
    const avatars = ['cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png']
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
            <Text>{`${service_time.open} - ${service_time.close}`}</Text>

          </View>
          <View className="tel">
            <Text><Text className="icon-ic_time iconfont"></Text>{phone}</Text>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
          <View className="location">
            <Text><Text className="icon-ic_address iconfont"></Text>{address}</Text>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
          <View className="students" onClick={this.toStudents}>
            <View className="period-avatars-wrapper">
              {avatars.slice(0, 3).map((src, i) => {
                return <View className="period-avatars" key={i}><Image className="mini-avatar" src={src}></Image></View>
              })}
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
