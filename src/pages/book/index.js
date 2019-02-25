import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { connectLogin, withShare, wxLogin } from '../../utils/helper'
import { addDayStr, formatHour, getUniqueExercise, calDistance } from '../../utils/tool'
import { WeekDate, PostButton } from '../../components'
import { getCoupons } from '../../actions/coupons'
import { decryptData, putUser, getSessionKey } from '../../actions/user'
import { getShops, getTheShop } from '../../actions/shop'
import { getSchedules } from '../../actions/schedule'
import { createOrder, checkoutOrder, createTrasctions } from '../../actions/order'
import { FULL_NUM } from '../../constants/app'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'

import './index.less'
import noplanImage from '../../assets/images/img_noplan@3x.png'

@connectLogin
@withShare()
class Book extends Component {
    state = {
        storeId: '',
        storeTitle: '',
        phoneNumber: '',
        courses: [],
        couponsNum: 0,
        couponAmount: 0,
        couponId: null,
        selectPeriodIdx: {},
        total: 0,
        selectDateIndex: 0,
        scheduleId: ''
    }
    componentDidShow() {
        let storeId = ''
        if (getGlobalData('selectStore')) {
            storeId = getGlobalData('selectStore')['storeId']
        }
        if (this.$router.params.storeId) {
            storeId = this.$router.params.storeId
        }
        this.setState({
            phoneNumber: Taro.getStorageSync('phoneNumber') || '',
        }, () => {
            if (storeId) {
                this.setState({
                    storeId
                }, () => {
                    Taro.showLoading({
                        title: '请求中...'
                    })
                    // 查询门店详情
                    getTheShop({
                        shop_id: storeId
                    }).then(res => {
                        Taro.hideLoading()
                        let { title } = res.data
                        this.setState({ storeTitle: title })
                    })
                })
                this.getDateSchedules()
            } else {
                this.getLocationStore()
            }
        })
        this.getUserCoupons()
        const { selectPeriodIdx, selectDateIndex } = this.state
        // 折扣数，折扣id
        const selectCoupon = getGlobalData('selectCoupon')
        let total
        if (selectCoupon) {
            const { amount, _id: { $oid } } = selectCoupon['coupon'] || {}
            if (amount) {
                const couponAmount = amount / 100
                this.setState({
                    couponAmount,
                    couponId: $oid,
                }, () => {
                    if (selectPeriodIdx[selectDateIndex] === 0 || selectPeriodIdx[selectDateIndex]) {
                        total = Math.max((getGlobalData('price') || 0) - couponAmount, 0) / 100
                    }
                    this.setState({
                        total
                    })
                })
            }
        } else {
            this.setState({
                couponAmount: 0,
                couponId: null
            }, () => {
                if (selectPeriodIdx[selectDateIndex] === 0 || selectPeriodIdx[selectDateIndex]) {
                    total = Math.max((getGlobalData('price') || 0), 0) / 100
                }
                this.setState({
                    total
                })
            })
        }
    }
    getLocationStore() {
        Taro.getLocation().then(res => {
            this.getStores(res)
        }).catch(error => {
            Taro.getSetting().then(res => {
                if (res.authSetting['scope.userLocation']) {
                    Taro.getLocation().then(res => {
                        this.getStores(res)
                    })
                } else {
                    this.getStores()
                }
            })
        })
    }
    getStores(location = { "latitude": 30.66342, "longitude": 104.072329 }) {
        //  默认选择最近的门店
        let { latitude, longitude } = location
        getShops().then(res => {
            let stores = res.data.map(store => {
                const { location: { lat, lng } } = store
                const { distance, pureDistance } = calDistance(latitude, longitude, lat, lng)
                store = { ...store, ...{ distance, pureDistance } }
                return store
            })
            stores = stores.sort((a, b) => a.pureDistance > b.pureDistance ? 1 : -1).filter(x => x.status == 'enable')
            const { _id: { $oid }, title } = stores[0]
            this.setState({
                storeId: $oid,
                storeTitle: title
            }, () => {
                this.getDateSchedules()
            })
        })
    }
    componentWillUnmount() {
        setGlobalData('selectCoupon', null)
        this.setState({
            couponAmount: 0,
            couponId: null
        })
    }
    getDateSchedules() {
        Taro.showLoading({ title: '请求中...' })
        const dateIndex = this.state.selectDateIndex
        const user_id = Taro.getStorageSync('user_id')
        const str = addDayStr(dateIndex)
        const shop_id = this.state.storeId
        getSchedules({
            shop_id,
            date: str
        }).then(res => {
            Taro.hideLoading()
            const schedules = res.data
            if (schedules && schedules.length) {
                const schedule = res.data[0]
                let courses = schedule.courses
                const nowTime = (new Date()).getTime()
                courses = courses.filter(x => x.end * 1000 > nowTime)
                courses.forEach(course => {
                    course.startTime = formatHour(course.start)
                    course.endTime = formatHour(course.end)
                    course.avatars = course.users.map(x => x.avatar)
                    course.num = course.users.length
                    course.full = course.num == FULL_NUM
                    course.joined = course.users.some(x => x._id.$oid == user_id)
                });
                this.setState({
                    courses,
                    scheduleId: schedule._id.$oid
                })
            } else {
                this.setState({
                    courses: []
                })
            }
        })
    }
    getUserCoupons() {
        const user_id = Taro.getStorageSync('user_id')
        getCoupons({
            user_id,
            used: 0
        }).then(res => {
            const couponsNum = res.data && res.data.length
            this.setState({ couponsNum })
        })
    }
    jumToStores() {
        Taro.navigateTo({
            url: '/pages/stores/index'
        })
    }
    jumToCoupons() {
        Taro.navigateTo({
            url: '/pages/selectCoupon/index'
        })
    }
    // 生成订单
    toPay() {
        const user_id = Taro.getStorageSync('user_id')
        const { scheduleId, selectPeriodIdx, courses, couponId, phoneNumber, selectDateIndex, total } = this.state
        if (!phoneNumber) {
            Taro.showToast({
                title: '请授权手机号',
                icon: 'none',
                duration: 2000
            })
        } else if (!(selectDateIndex in selectPeriodIdx)) {
            Taro.showToast({
                title: '请选择一个时间段后再提交',
                icon: 'none',
                duration: 2000
            })
        } else {
            const start = courses[selectPeriodIdx[selectDateIndex]]['start']
            createOrder({
                user_id,
                schedule_id: scheduleId,
                course: start
            }).then(res => {
                if (res.data.code == 200 || res.data.code == 201) {
                    const { _id: { $oid } } = res.data
                    checkoutOrder({
                        coupon_id: couponId,
                        order_id: $oid
                    }).then(res => {
                        if (res.data.code == 200) {
                            if (total > 0) {
                                this.pay($oid)
                            } else {
                                Taro.navigateTo({
                                    url: `/pages/bookStatus/index?order_id=${$oid}`
                                })
                            }
                        }
                    })
                } else {
                    Taro.showModal({
                        title: '请求出错',
                        content: res.data.message,
                        showCancel: false
                    })
                }
            })
        }
    }
    pay(order_id) {
        const openid = Taro.getStorageSync('openid')
        createTrasctions({
            order_id,
            openid
        }).then(res => {
            const param = res.data
            param.timeStamp = param.timestamp
            const { timestamp, ...rest } = param
            Taro.requestPayment(rest).then(res => {
                const { selectPeriodIdx, selectDateIndex, total } = this.state
                delete selectPeriodIdx[selectDateIndex]
                this.setState({
                    selectPeriodIdx,
                    total: 0
                }, () => {
                    Taro.navigateTo({
                        url: `/pages/bookStatus/index?order_id=${order_id}`
                    })
                })
            }).catch(res => {

            })
        })
    }
    selectPeriod(e) {
        const { idx, status } = e.currentTarget.dataset
        console.log({ idx, status })
        if (status !== 'joined' && status !== 'full') {
            let { couponAmount, selectPeriodIdx, selectDateIndex } = this.state
            selectPeriodIdx[selectDateIndex] = idx
            this.setState({
                selectPeriodIdx,
                total: Math.max((getGlobalData('price') || 0) - couponAmount, 0) / 100
            })
        }
    }
    async getPhoneNumber(e) {
        const { iv, encryptedData } = e.detail
        if (!iv) {
            return false
        }
        Taro.checkSession().then(
            res => {
                console.log(res)
                decryptData({
                    encrypted: encryptedData,
                    iv,
                    session: Taro.getStorageSync('session_key')
                }).then((res) => {
                    const { phoneNumber } = res.data
                    const unionId = Taro.getStorageSync('unionId')
                    this.setState({
                        phoneNumber
                    })
                    Taro.setStorageSync('phoneNumber', phoneNumber)
                    const user_id = Taro.getStorageSync('user_id')
                    const openid = Taro.getStorageSync('openid')
                    putUser({
                        user_id,
                        openid,
                        unionId,
                        phone: phoneNumber
                    })
                })
                    .catch((err) => {
                        console.log(err)
                        Taro.login().then((res) => {
                            const code = res.code
                            getSessionKey({ code }).then((session => {
                                decryptData({
                                    encrypted: encryptedData,
                                    iv,
                                    session: session.session_key
                                }).then((res) => {
                                    const { phoneNumber } = res.data
                                    const unionId = Taro.getStorageSync('unionId')
                                    this.setState({
                                        phoneNumber
                                    })
                                    Taro.setStorageSync('phoneNumber', phoneNumber)
                                    const user_id = Taro.getStorageSync('user_id')
                                    const openid = Taro.getStorageSync('openid')
                                    putUser({
                                        user_id,
                                        openid,
                                        unionId,
                                        phone: phoneNumber
                                    })
                                })
                            }))
                            return res.data
                        })
                    })
            })
    }
    changeDate(day) {
        let { couponAmount, selectPeriodIdx } = this.state
        let total
        if (selectPeriodIdx[day] === 0 || selectPeriodIdx[day]) {
            total = Math.max((getGlobalData('price') || 0) - couponAmount, 0) / 100
        } else {
            total = 0
        }
        this.setState({
            selectDateIndex: day,
            total
        }, () => {
            this.getDateSchedules()
        })
    }
    render() {
        const { storeTitle, phoneNumber, courses, selectPeriodIdx, selectDateIndex } = this.state
        return (
            <View className='book'>
                <View className="book-info-wrapper">
                    <View className="book-info" onClick={this.jumToStores}>
                        <Text>门店</Text>
                        <Text>{storeTitle} <Text className="icon-ic_more iconfont" ></Text></Text>
                    </View>
                    <View className="book-info">
                        <Text>预约手机号</Text>
                        <Button className="getUserPhoneBtn" onGetPhoneNumber={this.getPhoneNumber} openType="getPhoneNumber">{phoneNumber ? <Text>{phoneNumber}</Text> : '点击获取手机号'}</Button>
                    </View>
                </View>
                <View className="date-wrapper">
                    <WeekDate selectIndex={selectDateIndex} onChangeDate={this.changeDate}></WeekDate>
                </View>
                <View className="period-wrapper">
                    {courses.length ? courses.map((x, i) => {
                        const statusText = x.joined ? '您已预约' : x.full ? '满员' : `${x.num || '无'}人预约`
                        const statusClass = x.joined ? 'joined' : x.full ? 'full' : ''
                        return (<View key={i} data-idx={i} className={`period ${x.joined || x.full ? 'disable' : selectPeriodIdx[selectDateIndex] == i ? 'selected' : ''}`} onClick={this.selectPeriod} data-status={statusClass}>
                            <Text>{x.startTime}<Text className="timeGap">-</Text>{x.endTime}</Text>
                            <View className="period-detail">
                                <View className="period-avatars-wrapper">
                                    {x.avatars.slice(0, 3).map((src, i) => {
                                        return <View className="period-avatars" key={i}><Image className="mini-avatar" src={src}></Image></View>
                                    })}
                                </View>
                                <Text className={`${statusClass} status-text`}>{statusText}</Text>
                            </View>
                        </View>)
                    }) : <View className="blank-wrapper" ><Image src={noplanImage} />
                            <Text>暂无训练计划</Text>
                        </View>}
                </View>
                {couponsNum ? <View className="footer-placeholder"></View> : null}
                {couponsNum ? <View className="coupon-wrapper" onClick={this.jumToCoupons}>
                    <Text>优惠券</Text>
                    <Text>
                        <Text className={`coupon-text ${couponAmount ? 'discount' : 'coupon-num'}`}>{!couponAmount ? `${couponsNum}个可用` : `-￥${couponAmount}`}</Text>
                        <Text className="icon-ic_more iconfont"></Text>
                    </Text>
                </View> : null}
                <View className="footer-placeholder"></View>
                <View className="footer">
                    <Text className="total">￥{total}</Text>
                    <PostButton btn-class="pay-button" onClick={this.toPay}>立即支付</PostButton>
                </View>
            </View>
        )
    }
}

export default Book
