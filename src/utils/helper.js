import Taro from '@tarojs/taro'
import { login, getUser, getUnionId, register } from '../actions/user'

// 获取微信登录凭证
export const wxLogin = async () => {
    try {
        const res = await Taro.login()
        return res.code
    } catch (error) {
        console.log('微信获取临时凭据失败')
    }
}
// 获取微信登录凭证
export const getSession = async () => {
    try {
        const code = await wxLogin()
        const res = await login({ code })
        return res.data
    } catch (error) {
        console.log('换取客户微信session失败')
    }
}
// 获取unionid
export const getUserInfo = async (session_key) => {
    try {
        const settingRes = await Taro.getSetting()
        if (settingRes.authSetting['scope.userInfo']) {
            const res = await Taro.getUserInfo()
            const { iv, encryptedData } = res
            const unionidRes = await getUnionId({ session: session_key, iv, encrypted: encryptedData })
            return unionidRes.data
        } else {
            Taro.navigateTo({
                url: '/pages/login/index'
            })
            return false
        }
    } catch (error) {
        console.log('换取unionid失败')
    }
}

export const saveUserInfo = (info) => {
    const { avatarUrl, unionId, province, language, country, city, nickName, gender } = info
    if (unionId) {
        Taro.setStorageSync('unionid', unionId)
    }
    Taro.setStorageSync('avatarUrl', avatarUrl)
    Taro.setStorageSync('province', province)
    Taro.setStorageSync('language', language)
    Taro.setStorageSync('country', country)
    Taro.setStorageSync('city', city)
    Taro.setStorageSync('nickName', nickName)
    Taro.setStorageSync('gender', gender)
}

const getUserId = async (info, users, unionid) => {
    if (users.length) {
        return users[0]._id.$oid
    } else {
        try {
            const param = { username: info.nickName, avatar: info.avatarUrl, unionid }
            const res = await register(param)
            if (res) {
                return res._id.$oid
            }
        } catch (error) {
            console.log(error)
        }
    }

}
const emitUserid = async (unionid, openid, session_key) => {
    try {
        if (unionid) {
            const users = await getUser({ unionid, openid })
            const nickName = Taro.getStorageSync('nickName')
            const avatarUrl = Taro.getStorageSync('avatarUrl')
            return getUserId({ nickName, avatarUrl }, users, unionid)
        } else {
            const info = await getUserInfo(session_key)
            if (info) {
                const { unionId } = info
                saveUserInfo(info)
                const users = await getUser({ unionid: unionId, openid })
                return getUserId(info, users, unionid)
            }
        }
    } catch (error) {
        console.log(error)
    }
}
export const userLogin = async () => {
    try {
        await Taro.checkSession()
        if (!Taro.getStorageSync('user_id')) {
            throw new Error('本地没有缓存UserId')
        }
    } catch (error) {
        const openid = Taro.getStorageSync('openid')
        const unionid = Taro.getStorageSync('unionid')
        const session_key = Taro.getStorageSync('session_key')
        if (openid) {
            const id = emitUserid(unionid, openid, session_key)
            Taro.setStorageSync('user_id', id)
        } else {
            const session = await getSession()
            const { openid, session_key, unionid } = session
            Taro.setStorageSync('openid', openid)
            Taro.setStorageSync('session_key', session_key)
            const id = emitUserid(unionid, openid, session_key)
            Taro.setStorageSync('user_id', id)
        }
    }
}

/**
 * 登录态检查
 * openid
 * unionid
 * userid
 */
export const connectLogin = (Component) => {
    class LoginWrapper extends Component {
        async componentWillMount() {
            await userLogin()
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
    //           // 可以将 res 发送给后台解码出 unionid
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