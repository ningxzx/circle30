import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import './index.less'
class StoreList extends Component {
  config = {
    navigationBarTitleText: '选择门店'
  }
  state = {
    stores: [
      { title: '优客联邦一期店', desc: '成都市武侯区佳灵路222号优客联', distance: '1.2km', status: true },
      { title: '优客联邦一期店', desc: '成都市武侯区佳灵路222号优客联邦一期2栋5单元1601室 宽度520px 行距12px@2x', distance: '1.2km', status: false },
      { title: '优客联邦一期店', desc: '成都市武侯区佳灵路222号优客联邦一期2栋5单元1601室 宽度520px 行距12px@2x', distance: '1.2km', status: true }
    ],
    selectIdx: null
  }
  stores(e) {
    const { idx, status } = e.currentTarget.dataset
    if (status) {
      this.setState({
        selectIdx: idx
      })
    }
    Taro.navigateTo({
      url: '/pages/store/index'
    })
  }
  render() {
    const { stores, selectIdx } = this.state
    return (
      <View className="store-list">
        {stores.length ? stores.map((store, i) => {
          return (<View className={`cell ${store.status ? '' : 'disable'} ${i == selectIdx ? 'selected' : ''}`} key={i} data-idx={i} data-status={store.status} onClick={this.stores} >
            <View className="left-content">
              <Text className="cell-title">{store.title}{!store.status ? <Text className="status-str">暂停预约</Text> : null}</Text>
              <View className="cell-detail">
                <Text>{store.desc}</Text>
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