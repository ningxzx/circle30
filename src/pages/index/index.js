import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { WeekDate } from '../../components'
import { wxLogin } from '../../utils/helper'
import './index.less'

@wxLogin
@connect(({ global }) => ({
  global
}))
class Index extends Component {
  state = {
    chooseDate: 0,
    cources: [
      { name: '划船', body: '全身', type: '动态保持' },
      { name: '过头蹲', body: '全身', type: '动态保持' },
      { name: '引体向上', body: '全身', type: '动态保持' }
    ],
    stores: [
      { title: '优客联邦一期店', desc: '成都市武侯区佳灵路222号优客联邦一期2栋5单元1601室 宽度520px 行距12px@2x', distance: '1.2km' },
      { title: '优客联邦一期店', desc: '成都市武侯区佳灵路222号优客联邦一期2栋5单元1601室 宽度520px 行距12px@2x', distance: '1.2km' }
    ]
  }
  config = {
    navigationBarTitleText: 'CirCle30'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillMount() {
    Taro.getLocation().then()
  }
  jumpToBook() {
    Taro.navigateTo({
      url: '/pages/book/index'
    })
  }
  render() {
    const { stores, cources } = this.state
    return (
      <View className='index'>
        <View className="header">
          <View className="book-btn" onClick={this.jumpToBook}>预约训练</View>
          <View className="sign">
            <Text className="icon-ic__qiandao iconfont sign-icon"></Text>
            <Text className="sign-text">扫码签到</Text>
          </View>
        </View>
        <View className="card">
          <View className="card-title">
            <Text className="icon-ic__plan iconfont"></Text>
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
        <View className="card">
          <View className="card-title">
            <Text className="icon-ic__shop iconfont"></Text>
            <Text className="card-title-text">附近门店</Text>
          </View>
          <View className="store-list">
            {stores.length ? stores.map((store, i) => {
              return (<View className="cell" key={i}>
                <View className="left-content">
                  <Text className="cell-title">{store.title}</Text>
                  <View className="cell-detail">
                    <Text>{store.desc}</Text>
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
      </View >
    )
  }
}

export default Index
