import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { WeekDate, PostButton } from '../../components'
import { connectLogin, withShare, requestUserId } from '../../utils/helper'
import { addDayStr, calDistance, getUniqueExercise, queryString } from '../../utils/tool'
import { getShops } from '../../actions/shop'
import { getSchedules, userCheckin } from '../../actions/schedule'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import './index.less'
@connectLogin
@withShare()
class Index extends Component {
  state = {
    chooseDate: 0,
    exercises: [],
    stores: [],
    authLocation: true,
    showSubButton: false,
    selectDateIndex: 0
  }
  config = {
    navigationBarTitleText: 'CirCle30'
  }
  async scan() {
    const user_id = await requestUserId()
    Taro.scanCode({
      onlyFromCamera: true
    }).then(res => {
      if (res.errMsg == "scanCode:ok") {
        const scene = queryString(res.path, 'scene')
        userCheckin({
          checkin_id: scene,
          user_id
        }).then(res => {
          if (res.code == 200) {
            Taro.showToast({
              icon:'success',
              title:'签到成功',
              duration:2000
            })
          } else if (res.code == 4100) {
            Taro.showModal({
              title: '签到失败',
              content: `订单不存在`,
              showCancel: false
            })
          } else if (res.code == 4101) {
            Taro.showModal({
              title: '签到失败',
              content: `订单未支付`,
              showCancel: false
            })
          } else if (res.code == 4100) {
            Taro.showModal({
              title: '签到失败',
              content: `订单已退款`,
              showCancel: false
            })
          } else {
            Taro.showModal({
              title: '签到失败',
              content: `你尚未预约此课程`,
              showCancel: false
            })
          }
        })
      }
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
      longitude
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
    this.setState({
      selectDateIndex: days
    })
    getSchedules({
      date: str
    }).then(res => {
      const exercises = getUniqueExercise(res.data)
      this.setState({
        exercises
      })
    })
  }
  toProject(e) {
    const exerciseTitle = e.currentTarget.dataset.title
    const id = e.currentTarget.dataset.id
    const { selectDateIndex } = this.state
    const store = this.state.stores[0]
    const { _id: { $oid }, title } = store
    Taro.navigateTo({
      url: `/pages/exercise/index?title=${exerciseTitle}&id=${id}&storeId=${$oid}&storeTitle=${title}&dateIndex=${selectDateIndex}`
    })
  }
  jumpToBook() {
    const { selectDateIndex } = this.state
    const store = this.state.stores[0]
    if (store) {
      const { _id: { $oid }, title } = store
      Taro.navigateTo({
        url: `/pages/book/index?storeId=${$oid}&storeTitle=${title}&dateIndex=${selectDateIndex}`
      })
    }
  }
  jumpToStore(e) {
    const { selectDateIndex } = this.state
    const store = e.currentTarget.dataset.store
    const { _id: { $oid }, title } = store
    Taro.navigateTo({
      url: `/pages/store/index?id=${$oid}&title=${title}&dateIndex=${selectDateIndex}`
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
    const { stores, authLocation, showSubButton, exercises } = this.state
    return (
      <View className='index' >
        <View className="header">
          <PostButton btn-class="book-btn" onClick={this.jumpToBook}>预约训练</PostButton>
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
          <WeekDate selectIndex={selectDateIndex} onChangeDate={this.getDateSchedules} />
        </View>
        <View className="exercise-list">
          <View className="gap"></View>
          {exercises.length ? exercises.map((exercise, i) => {
            return (<View className="cell" key={i} onClick={this.toProject} data-id={exercise._id.$oid} data-title={exercise.title}>
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
        <View className="card">
          <View className="card-title">
            <Text className="icon-ic__shop iconfont"></Text>
            <Text className="card-title-text">附近门店</Text>
            {authLocation ? null : <Button open-type="openSetting" className="authLocationTip" bindopensetting={this.getLocation}>定位有误？点击授权</Button>}
          </View>
          <View className="store-list">
            {stores.length ? stores.map((store, i) => {
              return (<View className={`cell ${store.status == 'enable' ? '' : 'disable'} `} key={i} data-store={store} onClick={this.jumpToStore}>
                <View className="left-content">
                  <Text className="cell-title">{store.title}{store.status == 'enable' ? null : <Text className="status-str">暂停预约</Text>}</Text>
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
