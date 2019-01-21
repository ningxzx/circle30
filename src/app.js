import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

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
      'pages/login/index',
      'pages/index/index',
      'pages/mine/index',
      'pages/store/index',
      'pages/students/index',
      'pages/project/index',
      'pages/book/index',
      'pages/selectStore/index',
      'pages/selectCoupon/index',
      'pages/bookStatus/index',
      'pages/exercise/index',
      'pages/bookInfo/index',
      'pages/coupons/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
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
      },{
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "./assets/images/ic_mine@2x.png",
        selectedIconPath: "./assets/images/ic_mine_on@2x.png"
      }],
      color: '#666',
      selectedColor: '#14d0b4',
      backgroundColor: '#fff',
      borderStyle: '#ccc'
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
