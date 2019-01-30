import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { WeekDate } from '../../components'
import { connectLogin } from '../../utils/helper'
import { addDayStr, calDistance } from '../../utils/tool'
import { getShops } from '../../actions/shop'
import { getSchedules } from '../../actions/schedule'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import './index.less'
@connectLogin
class Index extends Component {
  state = {
    chooseDate: 0,
    schedules: [],
    stores: [],
    authLocation: true,
    showSubButton: false
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
    this.getLocation()
    this.getDateSchedules()
  }
  getLocation() {
    Taro.getLocation().then(res => {
      this.setState({
        authLocation: true
      })
      this.getStores(res)
    }).catch(error => {
      Taro.getSetting().then(res => {
        if (res.authSetting['scope.userLocation']) {
          Taro.getLocation().then(res => {
            this.setState({
              authLocation: true
            })
            this.getStores(res)
          })
        } else {
          this.getStores()
          this.setState({
            authLocation: false
          })
        }
      })
    })
  }
  // 默认选择天府广场
  getStores(location = { "latitude": 104.072329, "longitude": 30.66342 }) {
    const { latitude, longitude } = location
    setGlobalData({ latitude, longitude })
    getShops({
      latitude,
      longitude,
      status: 'enable'
    }).then(res => {
      const list = res.data.map(shop => {
        const { title, address, location: { lat, lng }, ...rest } = shop
        const distance = calDistance(latitude, longitude, lat, lng)
        return {
          title,
          address,
          distance,
          ...rest
        }
      })
      this.setState({
        stores: list
      })
    })
  }
  getDateSchedules(days = 0) {
    const str = addDayStr(days)
    getSchedules({
      date: str
    }).then(res => {
      let schedules = res.data
      this.setState({
        schedules
      })
    })
  }
  toProject(e) {
    const title = e.currentTarget.dataset.title
    Taro.navigateTo({
      url: `/pages/project/index?name=${title}`
    })
  }
  jumpToBook() {
    const store = this.state.stores[0]
    if (store) {
      const { _id: { $oid }, title } = store 
      Taro.navigateTo({
        url: `/pages/book/index?storeId=${$oid}&storeTitle=${title}`
      })
    }
  }
  jumpToStore(e) {
    const store = e.currentTarget.dataset.store
    const { _id: { $oid }, title } = store 
    Taro.navigateTo({
      url: `/pages/store/index?id=${$oid}&title=${title}`
    })
  }
  onPageScroll(scroll) {
    const { scrollTop } = scroll
    const { showSubButton } = this.state
    if (scrollTop > 55 && !showSubButton) {
      this.setState({
        showSubButton: true
      })
    }
    if (scrollTop < 58 && showSubButton) {
      this.setState({
        showSubButton: false
      })
    }
  }
  render() {
    const { stores, schedules, authLocation, showSubButton } = this.state
    return (
      <View className='index' >
        <View className="header">
          <View className="book-btn" onClick={this.jumpToBook}>预约训练</View>
          <View className="sign" onClick={this.scan}>
            <Text className="icon-ic__qiandao iconfont sign-icon"></Text>
            <Text className="sign-text">扫码签到</Text>
          </View>
        </View>
        <View className="card">
          <View className="card-title">
            <Text className="icon-ic__plan iconfont"></Text>
            <Text className="card-title-text">训练计划</Text>
          </View>
          <WeekDate onChangeDate={this.getDateSchedules} test="test" />
        </View>
        <View className="exercise-list">
          <View className="gap"></View>
          {schedules.length ? schedules.map((cource, i) => {
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
        <View className="card">
          <View className="card-title">
            <Text className="icon-ic__shop iconfont"></Text>
            <Text className="card-title-text">附近门店</Text>
            {authLocation ? null : <Button open-type="openSetting" className="authLocationTip" bindopensetting={this.getLocation}>定位有误？点击授权</Button>}
          </View>
          <View className="store-list">
            {stores.length ? stores.map((store, i) => {
              return (<View className="cell" key={i} data-store={store} onClick={this.jumpToStore}>
                <View className="left-content">
                  <Text className="cell-title">{store.title}</Text>
                  <View className="cell-detail">
                    <Text>{store.address}</Text>
                  </View>
                </View>
                <View className="right-content">
                  <Text className="icon-ic__add1 iconfont"></Text>
                  <Text>{store.distance}</Text>
                </View>
              </View>)
            }) : null}
          </View>
        </View>
        {showSubButton ? <View className="sub-book-btn" onClick={this.jumpToBook}>立即预约</View> : null}
      </View >
    )
  }
}

export default Index
