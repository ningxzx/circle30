import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Form } from '@tarojs/components'
import { connectLogin, withShare } from '../../utils/helper'
import { PostButton } from '../../components'
import { getExercise } from '../../actions/exercise'
import { postFormId } from '../../actions/message'
import './index.less'
@connectLogin
@withShare()
class Exercise extends Component {
  state = {
    title: '',
    id: '',
    dateIndex: 0,
    body: '',
    type: '',
    cover: '',
    images: []
  }
  config = {
    navigationBarTitleText: ' '
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidMount() {
    const { id } = this.$router.params
    this.setState({
      id,
    }, () => {
      getExercise(id).then(res => {
        const { images, cover, type, body,title } = res.data
        this.setState({
          images,
          cover,
          type,
          body,
          title
        })
      })
    })
  }
  jumpToBook() {
    const { storeId } = this.$router.params
    Taro.navigateTo({
      url: `/pages/book/index?${storeId?`storeId=${storeId}`:''}`
    })
  }
  formSubmit(e) {
    const form_id = e.detail.formId
    const open_id = Taro.getStorageSync('openid')
    if (form_id) {
      postFormId({ form_id, open_id })
    }
  }
  componentDidHide() { }
  $setShareTitle() {
    const { title } = this.state
    return `${title} | Circle30`
  }
  $setSharePath() {
    const {id} = this.$router.params
    return `/pages/exercise/index?id=${id}`
  }
  $setShareImageUrl() {
    return this.state.cover
  }

  render() {
    const { images, cover, type, body, title } = this.state
    return (
      <View className='exercise'>
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
        <View className="card description-card">
          <View className="card-title description">
            <Text className="verticalIcon"></Text>
            <Text className="card-title-text">课程说明</Text>
          </View>
          <View className="exercise-image-wrapper">
            {images.map((x, i) => (<Image className="project-image" mode="widthFix" key={i} src={x}></Image>))}
          </View>
        </View>
        <View className="book-btn-placeholder"></View>
        <PostButton btn-class="book-btn" onClick={this.jumpToBook}>立即预约</PostButton>

      </View>
    )
  }
}

export default Exercise
