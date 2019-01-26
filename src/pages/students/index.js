import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.less'

class Students extends Component {
  static defaultProps = {
    list: [
      { name: '孙二狗', avatar: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png' },
      { name: '孙三狗', avatar: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png' },
      { name: '孙四狗', avatar: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png' }
    ]
  }
  config = {
    navigationBarTitleText: '学员列表'
  }

  render() {
    // const { list } = this.props
    const list =  [
      { name: '孙二狗', avatar: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png' },
      { name: '孙三狗', avatar: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png' },
      { name: '孙四狗', avatar: 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png' }
    ]
    return (
      <View className='students'>
        {
          list.map((x, i) => {
            return <View className="student-info" key={i}>
              <Image src={x.avatar}></Image>
              <Text>{x.name}</Text>
            </View>
          })
        }
      </View>
    )
  }
}

export default Students
