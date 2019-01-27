import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { WeekDate } from '../../components'
import { wxLogin } from '../../utils/helper'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'
import './index.less'
@wxLogin
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
  scan() {
    Taro.scanCode({
      onlyFromCamera: true
    }).then(res => {
      console.log(res)
    })
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    // Taro.getLocation().then()
    // 登录验证逻辑，如果当前缓存有open_id,user_id,union_id即视为登录状态，否则
  }
  toProject(e){
    const title = e.currentTarget.dataset.title
    Taro.navigateTo({
      url: `/pages/project/index?name=${title}`
    })
  }
  jumpToBook() {
    Taro.navigateTo({
      url: '/pages/book/index'
    })
  }
  jumpToStore(e) {
    const title = e.currentTarget.dataset.title
    Taro.navigateTo({
      url: `/pages/store/index?name=${title}`
    })
  }
  render() {
    const { stores, cources } = this.state
    return (
      <View className='index'>
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
          <WeekDate />
        </View>
        <View className="exercise-list">
          <View className="gap"></View>
          {cources.length ? cources.map((cource, i) => {
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
          </View>
          <View className="store-list">
            {stores.length ? stores.map((store, i) => {
              return (<View className="cell" key={i} data-title={store.title} onClick={this.jumpToStore}>
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
