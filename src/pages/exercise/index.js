import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connectLogin } from '../../utils/helper'
import { getExercise } from '../../actions/exercise'
import './index.less'
@connectLogin
class Exercise extends Component {
  state = {
    title: '',
    id: '',
    storeId: '',
    storeTitle: '',
    dateIndex: 0,
    body: '',
    type: '',
    cover: '',
    images: []
  }
  config = {
    navigationBarTitleText: '训练项目介绍'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidMount() {
    const { title, id, dateIndex, storeId,storeTitle } = this.$router.params
    this.setState({
      title,
      id,
      storeId,
      storeTitle,
      dateIndex
    }, () => {
      Taro.setNavigationBarTitle({
        title: title
      })
      getExercise(id).then(res => {
        const { images, cover, type, body } = res.data
        this.setState({
          images,
          cover,
          type,
          body
        })
      })
    })
  }
  toBook() {
    const {storeId,dateIndex,storeTitle} = this.state
    Taro.navigateTo({
      url: `/pages/book/index?storeId=${storeId}&storeTitle=${storeTitle}&dateIndex=${dateIndex}`
    })

  }
  componentDidHide() { }

  render() {
    const { images, cover, type, body, title } = this.state
    return (
      <View className='project'>
        <Image src={cover}></Image>
        <View className="title">{title}</View>
        <View className="info">
          <View className="type">
            <Text>训练部位</Text>
            <Text>{body}</Text>
          </View>
          <Text className="vertical-gap"></Text>
          <View className="type">
            <Text>训练目的</Text>
            <Text>{type}</Text>
          </View>
        </View>
        <View className="card">
          <View className="card-title description">
            <Text className="verticalIcon"></Text>
            <Text className="card-title-text">课程说明</Text>
          </View>
          {images.map((x,i) => (<Image className="project-image" mode="widthFix" key={i} src={x}></Image>))}
        </View>
        <View className="book-btn-placeholder"></View>
        <Button className="book-btn" onClick={this.toBook}>立即预约</Button>
      </View>
    )
  }
}

export default Exercise
