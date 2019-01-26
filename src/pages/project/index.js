import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'

class Project extends Component {
  state={
    name:''
  }
  config = {
    navigationBarTitleText: '训练项目介绍'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidMount() {
    const { name } = this.$router.params
    if (name) {
      Taro.setNavigationBarTitle({
        title: name
      })
      this.setState({
        name
      })
    }
  }
  toBook() {
    Taro.navigateTo({
      url: '/pages/book/index'
    })

  }
  componentDidHide() { }

  render() {
    const {name} = this.state
    return (
      <View className='project'>
        <Image src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_dian@2x.png"></Image>
        <View className="title">{name}</View>
        <View className="info">
          <View className="type">
            <Text>训练部位</Text>
            <Text>全身</Text>
          </View>
          <Text className="vertical-gap"></Text>
          <View className="type">
            <Text>训练目的</Text>
            <Text>耐力</Text>
          </View>
        </View>
        <View className="card">
          <View className="card-title">
            <Text className="verticalIcon"></Text>
            <Text className="card-title-text">课程说明</Text>
          </View>
          <Text className="note">课程说明使用图文说明，由后台上传的多张图片拼接 字号24px。课程说明使用图文说明，由后台上传的多张图片拼接 字号24px行。课程说明使用图文说明，由后台上传的多张图片拼接 字号24px。课程说明使用图文说明，由后台上传的多张图片拼接 字号24px行。课程说明使用图文说明，由后台上传的多张图片拼接 字号24px。课程说明使用图文说明，由后台上传的多张图片拼接 字号24px行。</Text>
          <Image className="project-image" src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_dian@2x.png"></Image>
        </View>
        <Button className="book-btn" onClick={this.toBook}>立即预约</Button>
      </View>
    )
  }
}

export default Project
