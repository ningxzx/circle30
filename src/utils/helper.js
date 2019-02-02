import Taro from '@tarojs/taro'
import { login, getUser, decryptData, register } from '../actions/user'
import { APP_ID } from '../constants/app.js'

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
            const unionidRes = await decryptData({ session: session_key, iv, encrypted: encryptedData })
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

const getUserId = async (info, users, unionid, openid) => {
    if (users.length) {
        return users[0]._id && users[0]._id.$oid
    } else {
        try {
            const param = {
                username: info.nickName, avatar: info.avatarUrl, unionid, identifies: [
                    {
                        appid: APP_ID,
                        openid
                    }
                ]
            }
            const res = await register(param)
            if (res && res._id) {
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
            const res = await getUser({ unionid })
            const users = res.data
            const nickName = Taro.getStorageSync('nickName')
            const avatarUrl = Taro.getStorageSync('avatarUrl')
            const userId = await getUserId({ nickName, avatarUrl }, users, unionid, openid)
            return userId
        } else {
            const info = await getUserInfo(session_key)
            if (info) {
                const { unionId } = info
                saveUserInfo(info)
                const res = await getUser({ unionid: unionId })
                const users = res.data
                const userId = await getUserId(info, users, unionid, openid)
                return userId
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
            const id = await emitUserid(unionid, openid, session_key)
            Taro.setStorageSync('user_id', id)
        } else {
            const session = await getSession()
            const { openid, session_key, unionid } = session
            Taro.setStorageSync('openid', openid)
            Taro.setStorageSync('session_key', session_key)
            const id = await emitUserid(unionid, openid, session_key)
            Taro.setStorageSync('user_id', id)
        }
    }
}

/**
 * 获取userid请求较慢，因此单独写一个工具函数
 */
export async function requestUserId() {
    let user_id = Taro.getStorageSync('user_id')
    if (!user_id) {
        const res = await getUser({ unionid })
        user_id = res[0]._id.$oid
        Taro.setStorageSync('user_id', user_id)

    }
    return user_id
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
    const defalutPath = '/pages/index/index';
    const defalutTitle = 'CirCle30光速燃脂';
    const defaultImageUrl = '/assets/images/weappShare.png';

    return function demoComponent(Component) {
        class WithShare extends Component {
            async componentWillMount() {
                wx.showShareMenu({
                    withShareTicket: true
                });
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
                } else {
                    imageUrl = defaultImageUrl
                }

                if (!path) {
                    path = defalutPath;
                }

                // 每条分享都补充用户的分享id
                // 如果path不带参数，分享出去后解析的params里面会带一个{''： ''}
                const sharePath = `${path}`;

                return {
                    title: title || defalutTitle,
                    path: sharePath,
                    imageUrl: imageUrl 
                };
            }

            render() {
                return super.render();
            }
        }

        return WithShare;
    };
}