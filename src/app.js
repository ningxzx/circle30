import '@tarojs/async-await'
import Taro, { Component, onSocketClose } from '@tarojs/taro'
import { Provider, connect } from '@tarojs/redux'
import { getSystemConfig } from './actions/system'
import { set as setGlobalData, get as getGlobalData } from './utils/globalData'



import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/book/index',
      'pages/bookInfo/index',
      'pages/students/index',
      'pages/bookStatus/index',
      'pages/store/index',
      'pages/share/index',
      'pages/stores/index',
      'pages/login/index',
      'pages/coupons/index',
      'pages/order/index',
      'pages/mine/index',
      'pages/exercise/index',
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
        iconPath: "./assets/images/ic_home@3x.png",
        selectedIconPath: "./assets/images/ic_home_on@3x.png"
      }, {
        pagePath: "pages/order/index",
        text: "训练",
        iconPath: "./assets/images/ic_exercise@3x.png",
        selectedIconPath: "./assets/images/ic_exercise_on@3x.png"
      }, {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "./assets/images/ic_mine@3x.png",
        selectedIconPath: "./assets/images/ic_mine_on@3x.png"
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
  componentDidMount() {
    // 获取环境数据
    Taro.getSystemInfo().then(res => {
      setGlobalData(res)
    })
    getSystemConfig().then(res => {
      const { price: { amount } } = res.data
      setGlobalData('amount', amount)
    })
  }


  componentDidHide() { }

  componentCatchError() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
