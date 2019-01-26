import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'
@connect(({ global }) => ({
    global
  }))
class Share extends Component {

  config = {
    navigationBarTitleText: '邀请好友'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount () {
      const {type} =  this.$router.params 
      if(type==='shareBy'){
          Taro.setNavigationBarTitle({
              title:'好友邀请'
          })
      }
      
  }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { global: { pixelRatio } } = this.props
    const ratio = pixelRatio===3?'3':'2'
    return (
      <View className='share'>
        <View class="logo-wrapper">
            <Image src={`cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_logo@${ratio}x.png`}></Image>
            <View class="circle"></View>
        </View>
        <View className="content">
            <Image className="avatar" src={`cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/default_icon@${ratio}x.png`}></Image>
        </View>
      </View>
    )
  }
}

export default Share
