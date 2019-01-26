import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Swiper, SwiperItem } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { WeekDate } from '../../components'

import './index.less'


class Store extends Component {
  state = {
    info: {
      "title": "高攀一店",
      "city": {
        "index": "028",
        "title": "成都"
      },
      "index": "001",
      "phone": "82938202",
      "status": "enable",
      "location": {
        "lat": 30.667936,
        "lng": 104.07418
      },
      "service_time": {
        "open": "06:00",
        "close": "22:00"
      },
      "address": "中国四川省成都市青羊区草市街宏信证券",
      "description": "高攀最好的健身房，没有之一",
      "images": [
        "https://images.circle30.com/shop1.jpg"
      ],
      "devices": [
        {
          "code": "02800102",
          "status": 0,
          "use": 0,
          "index": 2
        }
      ],
      "order_total": 0
    },
    cources: [
      { name: '划船', body: '全身', type: '动态保持' },
      { name: '过头蹲', body: '全身', type: '动态保持' },
      { name: '引体向上', body: '全身', type: '动态保持' }
    ],
  }

  config = {
    navigationBarTitleText: '门店详情'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  jumpToBook(){
    Taro.navigateTo({
      url: '/pages/book/index'
    })
  }
  toStudents(){
    Taro.navigateTo({
      url: '/pages/students/index'
    })
  }
  componentDidMount() {
    const { name } = this.$router.params
    if (name) {
      Taro.setNavigationBarTitle({
        title: name
      })
    }

  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { info: { title, service_time, phone, description, address }, cources } = this.state
    const studentsNum = 123
    const avatars = ['cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png']

    const bannerImages = [
      'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_shop@2x.png',
      'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_shop@2x.png',
      'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_shop@2x.png'
    ]
    return (
      <View className='store'>
        <Swiper
          className='store-banner'
          indicatorColor='#b3b3b3'
          indicatorActiveColor='#14d0b4'
          circular
          indicatorDots
          autoplay>
          {bannerImages.map(banner => {
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
        <View className="book-btn" onClick={this.jumpToBook}>立即预约</View>
      </View>
    )
  }
}

export default Store
