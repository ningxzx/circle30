import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider, connect } from '@tarojs/redux'
import configStore from './store'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()
class App extends Component {

  config = {
    pages: [
      'pages/bookInfo/index',
      'pages/index/index',
      'pages/students/index',
      'pages/bookStatus/index',
      'pages/store/index',
      'pages/share/index',
      'pages/stores/index',
      'pages/login/index',
      'pages/coupons/index',
      'pages/book/index',
      'pages/exercise/index',
      'pages/mine/index',
      'pages/project/index',
    ],
    window: {
      backgroundColor: '#f4f4f4',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'CirCle30',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      list: [{
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./assets/images/ic_home@2x.png",
        selectedIconPath: "./assets/images/ic_home_on@2x.png"
      }, {
        pagePath: "pages/exercise/index",
        text: "训练",
        iconPath: "./assets/images/ic_exercise@2x.png",
        selectedIconPath: "./assets/images/ic_exercise_on@2x.png"
      }, {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "./assets/images/ic_mine@2x.png",
        selectedIconPath: "./assets/images/ic_mine_on@2x.png"
      }],
      color: '#666',
      selectedColor: '#14d0b4',
      backgroundColor: '#fff',
      borderStyle: 'black'
    },
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于搜索附近的门店"
      }
    }
  }
  componentDidShow() {
  }


  componentDidHide() { }

  componentCatchError() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
