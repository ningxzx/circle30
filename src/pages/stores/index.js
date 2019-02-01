import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connectLogin } from '../../utils/helper'
import { getShops } from '../../actions/shop'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import { calDistance } from '../../utils/tool'

import './index.less'
@connectLogin
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
        store.distance = calDistance(latitude, longitude, lat, lng)
        return store
      })
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
      Taro.navigateTo({
        url: `/pages/store/index?id=${oid}&title=${title}`
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
              <Text className="cell-title">{store.title}{store.status == 'enable' ? null : <Text className="status-str">暂停预约</Text>}</Text>
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