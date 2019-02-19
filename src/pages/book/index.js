import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { connectLogin, requestUserId, withShare, wxLogin } from '../../utils/helper'
import { addDayStr, formatHour, getUniqueExercise, calDistance } from '../../utils/tool'
import { WeekDate, PostButton } from '../../components'
import { getCoupons } from '../../actions/coupons'
import { decryptData, putUser, getSessionKey } from '../../actions/user'
import { getShops } from '../../actions/shop'
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
    componentDidMount() {
        const { dateIndex, storeTitle, storeId } = this.$router.params
        this.setState({
            phoneNumber: Taro.getStorageSync('phoneNumber') || '',
            selectDateIndex: dateIndex||0
        }, () => {
            if (storeId) {
                this.setState({
                    storeId,
                    storeTitle
                }, () => {
                    this.getDateSchedules()
                })
            } else {
                const { latitude, longitude } = getGlobalData(['latitude', 'longitude'])
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
        })
        this.getUserCoupons()
    }
    componentDidShow() {
        // 折扣数，折扣id
        const selectCoupon = getGlobalData('selectCoupon')
        if (selectCoupon) {
            const { amount, _id:{$oid} } = selectCoupon['coupon'] || {}
            if (amount) {
                const couponAmount = amount / 100
                this.setState({
                    couponAmount,
                    couponId:$oid
                })
            }
        } else {
            this.setState({
                couponAmount: 0,
                couponId: null
            })
        }
        let { storeTitle, storeId } = getGlobalData('selectStore') || {}
        if (storeId) {
            this.setState({
                storeId,
                storeTitle,
            }, () => {
                this.getDateSchedules()
            })
        }
    }
    getDateSchedules() {
        Taro.showLoading({ title: '请求中...' })
        const dateIndex = this.state.selectDateIndex
        const user_id = Taro.getStorageSync('user_id')
        const str = addDayStr(dateIndex)
        console.log(str)
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
    async getUserCoupons() {
        const user_id = await requestUserId()
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
    async toPay() {
        const user_id = await requestUserId()
        const { scheduleId, selectPeriodIdx, courses, couponId, phoneNumber, selectDateIndex } = this.state
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
                const { _id: { $oid } } = res.data
                console.log(couponId)
                checkoutOrder({
                    coupon_id: couponId,
                    order_id: $oid
                }).then(res => {
                    this.pay($oid)
                })
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
                Taro.navigateTo({
                    url: `/pages/bookStatus/index?order_id=${order_id}`
                })
            }).catch(res => {

            })
        })
    }
    selectPeriod(e) {
        let { couponAmount, selectPeriodIdx, selectDateIndex } = this.state
        selectPeriodIdx[selectDateIndex] = e.currentTarget.dataset.idx
        this.setState({
            selectPeriodIdx,
            total: Math.max(getGlobalData('price') - couponAmount, 0) / 100
        })
    }
    async getPhoneNumber(e) {
        const { iv, encryptedData } = e.detail
        if (!iv) {
            return false
        }
        const code = await wxLogin()
        const res = await getSessionKey({ code })
        const session = res.data
        decryptData({
            encrypted: encryptedData,
            iv,
            session: session.session_key
        }).then((res) => {
            const { phoneNumber } = res.data
            const unionid = Taro.getStorageSync('unionid')
            this.setState({
                phoneNumber
            })
            Taro.setStorageSync('phoneNumber', phoneNumber)
            const user_id = Taro.getStorageSync('user_id')
            const openid = Taro.getStorageSync('openid')
            putUser({
                user_id,
                openid,
                unionid,
                phone: phoneNumber
            })
        })
    }
    changeDate(day) {
        this.setState({
            selectDateIndex: day,
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
                        const statusClass = x.joined ? 'joined' : x.full || !x.num ? 'full' : ''
                        return (<View key={i} data-idx={i} className={`period ${x.joined || x.full ? 'disable' : selectPeriodIdx[selectDateIndex] == i ? 'selected' : ''}`} onClick={this.selectPeriod}>
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
                        <Text className={`coupon-text ${couponAmount ? 'amount' : 'coupon-num'}`}>{!couponAmount ? `${couponsNum}个可用` : `-￥${couponAmount}`}</Text>
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
