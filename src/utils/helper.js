import Taro from '@tarojs/taro'
import { login, setUserInfo } from '../actions/user'
export const wxLogin = (Component) => {
    class LoginWrapper extends Component {
        componentWillMount() {
            console.log('willMount')
            Taro.checkSession().then().catch()
            if (super.componentWillMount) {
                super.componentWillMount();
            }
        }
        render() {
            return super.render();
        }
    }
    return LoginWrapper
}
export function withShare(opts = {}) {

    // 设置默认
    const defalutPath = 'pages/index/index?';
    const defalutTitle = '默认标题';
    const defaultImageUrl = defaultShareImg;

    return function demoComponent(Component) {
        class WithShare extends Component {
            async componentWillMount() {
                wx.showShareMenu({
                    withShareTicket: true
                });

                if (super.componentWillMount) {
                    super.componentWillMount();
                }
            }

            // 点击分享的那一刻会进行调用
            onShareAppMessage() {
                const { userInfo } = this.props;

                let { title, imageUrl, path = null } = opts;

                // 从继承的组件获取配置
                if (this.$setSharePath && typeof this.$setSharePath === 'function') {
                    path = this.$setSharePath();
                }

                // 从继承的组件获取配置
                if (this.$setShareTitle && typeof this.$setShareTitle === 'function') {
                    title = this.$setShareTitle();
                }

                // 从继承的组件获取配置
                if (
                    this.$setShareImageUrl &&
                    typeof this.$setShareImageUrl === 'function'
                ) {
                    imageUrl = this.$setShareImageUrl();
                }

                if (!path) {
                    path = defalutPath;
                }

                // 每条分享都补充用户的分享id
                // 如果path不带参数，分享出去后解析的params里面会带一个{''： ''}
                const sharePath = `${path}&shareFromUser=${userInfo.shareId}`;

                return {
                    title: title || defalutTitle,
                    path: sharePath,
                    imageUrl: imageUrl || defaultImageUrl
                };
            }

            render() {
                return super.render();
            }
        }

        return WithShare;
    };
}

// componentDidMount() {
//     const { global: { appid }, login, setUserInfo } = this.props
//     wx.login({
//       success: res => {
//         if (res.errMsg === 'login:ok') {
//           const { code } = res
//           login({ code, appid })
//         }
//       }
//     })
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           setUserInfo(res.userInfo)
    //           // register(res)
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
//   }