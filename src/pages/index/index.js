import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { weekDate } from '../../utils/tool'
import './index.less'


@connect(({ global }) => ({
  global
}))
class Index extends Component {
  state = {
    chooseDate: 0
  }
  config = {
    navigationBarTitleText: 'CirCle30'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  changeDate(e) {
    this.setState({
      chooseDate: e.currentTarget.dataset.idx
    })
  }
  render() {
    const { chooseDate } = this.state
    const dates = weekDate()
    return (
      <View className='index'>
        <View className="header">
          <View className="book-btn">预约训练</View>
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
          <View className="timeline-date">
            {dates.map((x, i) => (<View key={i} className={`day-wrapper ${i == chooseDate ? 'on' : ''}`} onClick={this.changeDate} data-idx={i}><View className="week-text">{x.week}</View><View className="date-text">{x.date}</View></View>))}
          </View>
        </View>
        <View className="exercise-list">
          <View className="gap"></View>
          <View className="cell">
            <View className="exercise-info">
              <Text className="exercise-name">过头蹲</Text>
              <View className="exercise-detail">
                <Text>全身</Text>
                <Text>|</Text>
                <Text>动态保持</Text>
              </View>
            </View>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
          <View className="cell">
            <View className="exercise-info">
              <Text className="exercise-name">划船</Text>
              <View className="exercise-detail">
                <Text>全身</Text>
                <Text>|</Text>
                <Text>动态保持</Text>
              </View>
            </View>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
          <View className="cell">
            <View className="exercise-info">
              <Text className="exercise-name">引体向上</Text>
              <View className="exercise-detail">
                <Text>全身</Text>
                <Text>|</Text>
                <Text>动态保持</Text>
              </View>
            </View>
            <Text className="icon-ic_more iconfont"></Text>
          </View>
        </View >
        <View className="card">
          <View className="card-title">
            <Text className="icon-ic__shop iconfont"></Text>
            <Text className="card-title-text">附近门店</Text>
          </View>
          <View className="store-list">
            <View className="cell">
              <View className="left-content">
                <Text className="cell-title">优客联邦一期店</Text>
                <View className="cell-detail">
                  <Text>成都市武侯区佳灵路222号优客联邦一期2栋5单元1601室 宽度520px 行距12px@2x</Text>
                </View>
              </View>
              <View className="right-content">
                <Text className="icon-ic__add1 iconfont"></Text>
                <Text>1.2km</Text>
              </View>
            </View>
            <View className="cell">
              <View className="left-content">
                <Text className="cell-title">优客联邦二期店</Text>
                <View className="cell-detail">
                  <Text>成都市武侯区佳灵路222号优客联邦一期2栋5单元1601室 宽度520px 行距12px@2xahhahahahhah</Text>
                </View>
              </View>
              <View className="right-content">
                <Text className="icon-ic__add1 iconfont"></Text>
                <Text>1.2km</Text>
              </View>
            </View>
          </View>
        </View>
      </View >
    )
  }
}

export default Index
