import Taro from '@tarojs/taro'
import { getSessionKey, getUser, decryptData, register, putOpenid, getSingleUser, putUser } from '../actions/user'
import { APP_ID } from '../constants/app.js'
import shareImg from '../assets/images/weappShare.png'

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
        const res = await getSessionKey({ code })
        return res.data
    } catch (error) {
        console.log(error)
        console.log('换取客户微信session失败')
    }
}
// 获取unionId
export const getUserInfo = async (session_key) => {
    try {
        const settingRes = await Taro.getSetting()
        if (settingRes.authSetting['scope.userInfo']) {
            const res = await Taro.getUserInfo()
            const { iv, encryptedData } = res
            const unionIdRes = await decryptData({ session: session_key, iv, encrypted: encryptedData })
            return unionIdRes.data
        } else {
            Taro.navigateTo({
                url: '/pages/login/index'
            })
            return false
        }
    } catch (error) {
        console.log('换取unionId失败')
    }
}

export const saveUserInfo = (info) => {
    const { phone } = info
    if (phone) {
        Taro.setStorageSync('phoneNumber', phone)
    }
}
export const saveWxUserInfo = (info) => {
    const { avatarUrl, province, language, country, city, nickName, gender, phone } = info
    Taro.setStorageSync('avatarUrl', avatarUrl)
    Taro.setStorageSync('province', province)
    Taro.setStorageSync('language', language)
    Taro.setStorageSync('country', country)
    Taro.setStorageSync('city', city)
    Taro.setStorageSync('nickName', nickName)
    Taro.setStorageSync('gender', gender)
}


const getUserId = async (info, users, unionId, openid) => {
    if (users.length) {
        return users[0]._id && users[0]._id.$oid
    } else {
        try {
            const param = {
                username: info.nickName, avatar: info.avatarUrl, unionId, identifies: [
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
const emitUserid = async (unionId, openid, session_key) => {
    try {
        if (unionId) {
            const res = await getUser({ unionId })
            const users = res.data
            const nickName = Taro.getStorageSync('nickName')
            const avatarUrl = Taro.getStorageSync('avatarUrl')
            const userId = await getUserId({ nickName, avatarUrl }, users, unionId, openid)
            return userId
        } else {
            const info = await getUserInfo(session_key)
            if (info) {
                const { unionId } = info
                Taro.setStorageSync('unionId', unionId)
                saveWxUserInfo(info)
                const res = await getUser({ unionId: unionId })
                const users = res.data
                const userId = await getUserId(info, users, unionId, openid)
                return userId
            }
        }
    } catch (error) {
        console.log(error)
    }
}
export const oldUserLogin = async () => {
    try {
        await Taro.checkSession()
        if (!Taro.getStorageSync('user_id')) {
            throw new Error('本地没有缓存UserId')
        }
    } catch (error) {
        Taro.showLoading({
            title: '登录中'
        })
        const openid = Taro.getStorageSync('openid')
        const unionId = Taro.getStorageSync('unionId')
        const session_key = Taro.getStorageSync('session_key')
        if (openid) {
            const id = await emitUserid(unionId, openid, session_key)
            Taro.setStorageSync('user_id', id)
            getSingleUser(id).then(res => {
                Taro.hideLoading()
                Promise.all([saveUserInfo(res.data), putUser({
                    user_id: id,
                    openid,
                    "username": Taro.getStorageSync('nickName'),
                    "avatar": Taro.getStorageSync('avatarUrl')
                })])
            })
        } else {
            const session = await getSession()
            const { openid, session_key, unionId } = session
            Taro.setStorageSync('openid', openid)
            Taro.setStorageSync('session_key', session_key)
            const id = await emitUserid(unionId, openid, session_key)
            Taro.setStorageSync('user_id', id)
            getSingleUser(id).then(res => {
                Taro.hideLoading()
                Promise.all([saveUserInfo(res.data), putUser({
                    user_id: id,
                    openid,
                    "username": Taro.getStorageSync('nickName'),
                    "avatar": Taro.getStorageSync('avatarUrl')
                }), putOpenid({
                    openid,
                    user_id: id
                })])
            })
        }
    }
}

function userLogin() {
    const openid = Taro.getStorageSync('openid')
    const user_id = Taro.getStorageSync('user_id')
    const unionId = Taro.getStorageSync('unionId')
    if (openid && user_id && unionId) {
        getSingleUser(user_id).then(res => {
            saveUserInfo(res.data)
        })
    } else {
        Taro.navigateTo({
            url: '/pages/login/index'
        })
    }
}
/**
 * 登录态检查
 * openid
 * unionId
 * userid
 */
export const connectLogin = (Component) => {
    class LoginWrapper extends Component {
        componentDidShow() {
            userLogin()
            if (super.componentWillMount) {
                super.componentDidShow();
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
    const defaultImageUrl = shareImg

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
                console.log(imageUrl)
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