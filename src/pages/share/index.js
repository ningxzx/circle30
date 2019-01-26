import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { Coupon } from '../../components'
import './index.less'
@connect(({ global, user }) => ({
  global, user
}))
class Share extends Component {
  state = {
    coupon: {
      amount: 30,
      title: '新用户体验券',
      range: '所有门店通用'
    },
    // toShare-发出邀请,shareBy-接收邀请
    type: 'toShare',
    used: false
  }

  config = {
    navigationBarTitleText: '邀请好友'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    const { type } = this.$router.params
    this.setState({
      type,
      used: type === 'toShare'
    })
    Taro.setNavigationBarTitle({
      title: type === 'shareBy' ? '好友邀请' : '邀请好友'
    })
  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { global: { pixelRatio } } = this.props
    const { coupon, type, used } = this.state
    const ratio = pixelRatio === 3 ? '3' : '2'
    return (
      <View className='share'>
        <View class="logo-wrapper">
          <Image src={`cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_logo@${ratio}x.png`}></Image>
          <View class="circle"></View>
        </View>
        {type === 'shareBy' ? (<View className="content shareBy">
          <Image className="avatar" src={`cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/default_icon@${ratio}x.png`}></Image>
          <Text className="userName">刘二狗</Text>
          <Text className="mainTitle">我正在参加CirCle30减脂训练</Text>
          <Text className="subTitle">送你一张体验券，一起来锻炼吧！</Text>
        </View>) : (<View className="content toShare">
          <Text className="mainTitle">邀请好友</Text>
          <Text className="mainTitle">各得30元代金券</Text>
          <Text className="subTitle">好友注册成功后</Text>
          <Text className="subTitle">代金券将会自动发放至你的账户中</Text>
        </View>)}
        <Coupon used={used} coupon={coupon}></Coupon>
        <View className="gotoBook">{type==='shareBy'?'立即预约训练':'立即邀请好友'}</View>
      </View>
    )
  }
}

export default Share
