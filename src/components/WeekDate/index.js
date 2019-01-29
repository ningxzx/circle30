import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { weekDate } from '../../utils/tool'

import './index.less'
class WeekDate extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    chooseDate: 0
  }
  // static defaultProps = {
  //   ChangeDate:()=>{}
  // }
  changeDate(e) {
    const val = e.currentTarget.dataset.idx
    this.setState({
      chooseDate: val
    })
    this.props.onChangeDate(val)
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