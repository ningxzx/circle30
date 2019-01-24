import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { weekDate } from '../../utils/tool'

import './index.less'
class WeekDate extends Component {
  state={
    chooseDate:0
  }
  static defaultProps = {
    changeDate:()=>{}
  }
  changeDate(e){
    this.setState({
      chooseDate: e.currentTarget.dataset.idx
    })
    this.props.changeDate()
  }
  render() {
    const dates = weekDate()
    return (
      <View className="timeline-date">
        {dates.map((x, i) =>
          (<View key={i} className={`day-wrapper ${i == chooseDate ? 'on' : ''}`} onClick={this.changeDate} data-idx={i}>
            <View className="week-text">{x.week}</View>
            <View className="date-text">{x.date}</View>
          </View>))}
      </View>
    )
  }
}

export default WeekDate