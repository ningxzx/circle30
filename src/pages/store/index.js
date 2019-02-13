import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Swiper, SwiperItem, Icon } from '@tarojs/components'
import { connectLogin, withShare } from '../../utils/helper'
import { getUniqueExercise, addDayStr } from '../../utils/tool'
import { WeekDate, PostButton } from '../../components'
import { getTheShop, getShopUsers } from '../../actions/shop'
import { getSchedules } from '../../actions/schedule'
import './index.less'

@connectLogin
@withShare()
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
    exercises: [],
    selectDateIndex: 0,
    showAllDesc: false
  }
  config = {
    navigationBarTitleText: ' '
  }
  jumpToBook() {
    const { id, title, selectDateIndex } = this.state
    Taro.navigateTo({
      url: `/pages/book/index?storeId=${id}&storeTitle=${title}&dateIndex=${selectDateIndex}`
    })
  }
  toStudents() {
    const { id } = this.state
    Taro.navigateTo({
      url: `/pages/students/index?storeId=${id}`
    })
  }
  componentDidShow() {
    const { id, dateIndex } = this.$router.params
    this.setState({
      id,
      selectDateIndex: dateIndex || 0
    }, () => {
      Taro.showLoading()
      // 查询门店详情
      getTheShop({
        shop_id: id
      }).then(res => {
        Taro.hideLoading()
        const { _id: { $oid }, service_time, title, phone, location, images, description, status, address } = res.data
        this.setState({ id: $oid, service_time, title, phone, location, images, description, status, address })
      })
      // 查询预约过的用户
      getShopUsers({
        shop_id: id
      }).then(res => {
        if (res.data) {
          const studentsNum = res.data.length
          const avatars = res.data.map(user => {
            return user.avatar
          })
          this.setState({
            studentsNum,
            avatars
          })
        }
      })
      this.getDateSchedules(dateIndex)
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
  getDateSchedules(days = 0) {
    const { id } = this.state
    this.setState({
      selectDateIndex: days
    })
    // 查询训练
    getSchedules({
      shop_id: id,
      date: addDayStr(days)
    }).then(res => {
      if (res.data && res.data.length) {
        const schedule = res.data[0]
        const exercises = getUniqueExercise(res.data)
        this.setState({
          exercises,
          scheduleId: schedule._id.$oid
        })
      }
    })
  }
  toExerciseDetail(e) {
    const exerciseId = e.currentTarget.dataset.id
    const exerciseTitle = e.currentTarget.dataset.title
    const { id, selectDateIndex, title } = this.state
    Taro.navigateTo({
      url: `/pages/exercise/index?id=${exerciseId}&title=${exerciseTitle}&storeId=${id}&dateIndex=${selectDateIndex}&storeTitle=${title}`
    })
  }
  componentDidHide() { }

  $setShareTitle() {
    const { title } = this.state
    return `${title} | Circle30`
  }
  $setSharePath() {
    const { id, title } = this.state
    return `/pages/store/index?id=${id}&title=${title}`
  }
  $setShareImageUrl() {
    const { images } = this.state
    return images[0]
  }
  onShowAllDesc() {
    const showAllDesc = this.state.showAllDesc
    this.setState({
      showAllDesc: !showAllDesc
    })
  }
  render() {
    const { title, service_time, phone, description, address, images, studentsNum, avatars, selectDateIndex, showAllDesc } = this.state
    return (
      <View className='store'>
        <Swiper
          className='store-banner'
          indicatorColor='#b3b3b3'
          indicatorActiveColor='#14d0b4'
          circular
          indicatorDots
          autoplay>
          {images.map((banner, i) => {
            return <SwiperItem key={i}>
              <Image src={banner} mode="aspectFill"></Image>
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
          {avatars.length ? <View className="students" onClick={this.toStudents}>
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
          </View> : null}
          <View className={`description ${showAllDesc ? '' : 'line-limit'}`}><Text>{description}</Text>
          </View>
          <View onClick={this.onShowAllDesc} className="show-all-icon">{showAllDesc ? '收起' : '更多>'}</View>
        </View>
        <View className="card">
          <View className="card-title">
            <Text className="verticalIcon"></Text>
            <Text className="card-title-text">训练计划</Text>
          </View>
          <WeekDate selectIndex={selectDateIndex} onChangeDate={this.getDateSchedules} />
        </View>
        <View className="exercise-list">
          <View className="gap"></View>
          {exercises.length ? exercises.map((exercise, i) => {
            return (<View className="cell" key={i} data-id={exercise._id.$oid} data-title={exercise.title} onClick={this.toExerciseDetail}>
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
        <View className="book-btn-placeholder"></View>
        <PostButton btn-class="book-btn" onClick={this.jumpToBook}>立即预约</PostButton>
      </View>
    )
  }
}

export default Store
