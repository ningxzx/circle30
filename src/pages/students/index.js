import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connectLogin,withShare } from '../../utils/helper'
import { getShopUsers } from '../../actions/shop'

import './index.less'
@connectLogin
@withShare()
class Students extends Component {
  static defaultProps = {
    list: []
  }
  config = {
    navigationBarTitleText: '学员列表'
  }
  componentDidShow() {
    const { storeId } = this.$router.params
    getShopUsers({shop_id:storeId}).then(res=>{
        this.setState({
          list:res.data
        })
    })
  }
  render() {
    const { list } = this.state
    return (
      <View className='students'>
        {
          list.map((x, i) => {
            return <View className="student-info" key={i}>
              <Image src={x.avatar}></Image>
              <Text>{x.username}</Text>
            </View>
          })
        }
      </View>
    )
  }
}

export default Students
