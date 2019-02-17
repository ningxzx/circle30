import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connectLogin, withShare } from '../../utils/helper'
import { getShops } from '../../actions/shop'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import { calDistance } from '../../utils/tool'

import './index.less'
@connectLogin
@withShare()
class StoreList extends Component {
  config = {
    navigationBarTitleText: '选择门店'
  }
  state = {
    stores: [],
    selectIdx: null
  }
  componentDidShow() {
    const { latitude, longitude } = getGlobalData(['latitude', 'longitude'])
    getShops().then(res => {
      const stores = res.data.map(store => {
        const { location: { lat, lng } } = store
        const { distance, pureDistance } = calDistance(latitude, longitude, lat, lng)
        store = { ...store, ...{ distance, pureDistance } }
        return store
      })
      stores.sort((a, b) => a.pureDistance > b.pureDistance ? 1 : -1)
      this.setState({
        stores
      })
    })
  }
  toStoreInfo(e) {
    const { idx, status } = e.currentTarget.dataset
    if (status == 'enable') {
      this.setState({
        selectIdx: idx
      })
      const { _id: { $oid }, title } = this.state.stores[idx]
      const pages = Taro.getCurrentPages()
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        id: $oid,
        title: 'test'
      })
      setGlobalData('selectStore', { storeId: $oid, storeTitle: title })
      Taro.navigateBack({
        delta: -1
      })
    }
  }
  render() {
    const { stores, selectIdx } = this.state
    return (
      <View className="store-list">
        {stores.length ? stores.map((store, i) => {
          return (<View className={`cell ${store.status == 'enable' ? '' : 'disable'} ${i == selectIdx ? 'selected' : ''}`} key={i} data-idx={i} data-status={store.status} onClick={this.toStoreInfo} >
            <View className="left-content">
              <View className="cell-title">{store.title}{store.status == 'enable' ? null : <Text className="status-str">暂停预约</Text>}</View>
              <View className="cell-detail">
                <Text>{store.address}</Text>
              </View>
            </View>
            <View className="right-content">
              <Text className="icon-ic__add1 iconfont"></Text>
              <Text className="distance">{store.distance}</Text>
            </View>
          </View>)
        }) : null}
      </View>
    )
  }
}

export default StoreList