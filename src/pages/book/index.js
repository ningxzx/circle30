import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { connectLogin, requestUserId } from '../../utils/helper'
import { addDayStr, formatHour } from '../../utils/tool'
import { WeekDate,PostButton } from '../../components'
import { getCoupons } from '../../actions/coupons'
import { decryptData, putUser } from '../../actions/user'
import { getSchedules } from '../../actions/schedule'
import { createOrder, checkoutOrder, createTrasctions } from '../../actions/order'
import { FULL_NUM } from '../../constants/app'
import { set as setGlobalData, get as getGlobalData } from '../../utils/globalData'

import './index.less'
@connectLogin
class Book extends Component {
    state = {
        storeId: '',
        storeTitle: '',
        phoneNumber: Taro.getStorageSync('phoneNumber'),
        courses: [],
        couponsNum: 1,
        amount: 0,
        couponId: null,
        selectPeriodIdx: null,
        total: 0,
        selectDateIndex: 0,
        scheduleId: ''
    }

    config = {
        navigationBarTitleText: '预约训练'
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props, nextProps)
    }
    componentDidShow() {
        // 折扣数，折扣id
        const { amount, couponId } = getGlobalData('SelectCoupon') || {}
        if (!amount) {
            this.getUserCoupons()
        } else {
            this.setState({
                amount,
                couponId
            })
        }
        const { storeId, storeTitle, dateIndex } = this.$router.params
        if (storeId) {
            this.setState({
                storeId,
                storeTitle,
                selectDateIndex: dateIndex
            }, () => {
                this.getDateSchedules()
            })
        }
    }
    async getDateSchedules(days = 0) {
        const user_id = await requestUserId()
        const str = addDayStr(days)
        const shop_id = this.state.storeId
        this.setState({
            selectDateIndex: days
        })
        getSchedules({
            shop_id,
            date: str
        }).then(res => {
            const schedule = res.data[0]
            let courses = schedule.courses
            courses.forEach(cource => {
                cource.startTime = formatHour(cource.start)
                cource.endTime = formatHour(cource.end)
                cource.avatars = cource.users.map(x => x.avatar)
                cource.num = cource.users.length
                cource.full = cource.num == FULL_NUM
                cource.joined = cource.users.some(x => x._id.$oid == user_id)
            });
            this.setState({
                courses,
                scheduleId: schedule._id.$oid
            })
        })
    }
    async getUserCoupons() {
        const user_id = await requestUserId()
        getCoupons({
            user_id,
            used: 0
        }).then(res => {
            const couponsNum = res.data.length
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
            url: '/pages/coupons/index'
        })
    }
    // 生成订单
    async toPay() {
        const user_id = await requestUserId()
        const { scheduleId, selectPeriodIdx, courses, couponId } = this.state
        if (selectPeriodIdx===null) {
            Taro.showToast({
                title: '请选择一个时间段后再提交',
                icon: 'none',
                duration: 2000
            })
        } else {
            const start = courses[selectPeriodIdx]['start']
            createOrder({
                user_id,
                schedule_id: scheduleId,
                course: start
            }).then(res => {
                const { _id: { $oid } } = res.data
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
            param.timeStamp  = param.timestamp
            const {timestamp,...rest} = param
            Taro.requestPayment(rest).then(res => {
                console.log(res)
                Taro.navigateTo({
                    url: `/pages/bookStatus/index?order_id=${order_id}`
                })
            }).catch(res=>{
                
            })
        })
    }
    selectPeriod(e) {
        const { amount } = this.state
        this.setState({
            selectPeriodIdx: e.currentTarget.dataset.idx,
            total: (getGlobalData('amount') - amount) / 1000
        })
    }
    async getPhoneNumber(e) {
        const { iv, encryptedData } = e.detail
        const session_key = Taro.getStorageSync('session_key')
        decryptData({
            encrypted: encryptedData,
            iv,
            session: session_key
        }).then(async (res) => {
            const { phoneNumber } = res.data
            const unionid = Taro.getStorageSync('unionid')
            const avatar = Taro.getStorageSync('avatarUrl')
            const username = Taro.getStorageSync('nickName')
            this.setState({
                phoneNumber
            })
            Taro.setStorageSync('phoneNumber', phoneNumber)
            const user_id = await requestUserId()
            putUser({
                user_id,
                unionid,
                phone: phoneNumber,
                avatar,
                username
            })
        })
    }
    render() {
        const { storeTitle, phoneNumber, courses, selectPeriodIdx } = this.state
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
                    <WeekDate selectIndex={selectDateIndex} onChangeDate={this.getDateSchedules}></WeekDate>
                </View>
                <View className="period-wrapper">
                    {courses.length ? courses.map((x, i) => {
                        const statusText = x.joined ? '您已预约' : x.full ? '满员' : `${x.num || '无'}人预约`
                        const statusClass = x.joined ? 'joined' : x.full || !x.num ? 'full' : ''
                        return (<View key={i} data-idx={i} className={`period ${x.joined || x.full ? 'disable' : selectPeriodIdx == i ? 'selected' : ''}`} onClick={this.selectPeriod}>
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
                    }) : <View className="blank-wrapper" ><Image src="cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_noplan@2x.png" />
                            <Text>暂无训练计划</Text>
                        </View>}
                </View>
                {couponsNum || amount ? <View className="footer-placeholder"></View> : null}
                {couponsNum || amount ? <View className="coupon-wrapper" onClick={this.jumToCoupons}>
                    <Text>优惠券</Text>
                    <Text>
                        <Text className={`coupon-text {amount?'amount':'coupon-num'}`}>{!amount ? `${couponsNum}个可用` : `-￥${amount}`}</Text>
                        <Text className="icon-ic_more iconfont"></Text>
                    </Text>
                </View> : null}
                <View className="footer-placeholder"></View>
                <View className="footer">
                    <Text className="amount">￥{total}</Text>
                    <PostButton btn-class="pay-button" onClick={this.toPay}>立即支付</PostButton>
                </View>
            </View>
        )
    }
}

export default Book
