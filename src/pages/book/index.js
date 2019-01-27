import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { WeekDate } from '../../components'
import './index.less'

class Book extends Component {
    state = {
        store: '优客联邦一期',
        tel: '',
        list: [
            { avatars: ['cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png'], num: 5, period: '12:00-13:00', joined: false, full: false },
            { avatars: ['cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png',], num: 5, period: '12:00-13:00', joined: false, full: true },
            { avatars: ['cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png',], num: 2, period: '12:00-13:00', joined: true, full: false },
            { avatars: ['cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png',], num: 1, period: '12:00-13:00', joined: false, full: false },
            { avatars: ['cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png',], num: 5, period: '12:00-13:00', joined: false, full: false },
            { avatars: ['cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png',], num: 5, period: '12:00-13:00', joined: false, full: false },
            { avatars: [], num: 0, period: '12:00-13:00', joined: false, full: false },
            { avatars: [], num: 0, period: '12:00-13:00', joined: false, full: false },
            { avatars: ['cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png', 'cloud://circle30-dev-e034c4.6369-circle30-dev-e034c4/img_touxiang@2x.png',], num: 5, period: '12:00-13:00', joined: false, full: false },
        ],
        coupons: 1,
        discount: null,
        selectPeriodIdx: null,
        amount: 60
    }

    config = {
        navigationBarTitleText: '预约训练'
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props, nextProps)
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
    toPay() {
        // 支付逻辑
        Taro.navigateTo({
            url: '/pages/bookStatus/index'
        })
    }
    selectPeriod(e) {
        this.setState({
            selectPeriodIdx: e.currentTarget.dataset.idx
        })
    }
    getPhoneNumber(e) {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
    }
    render() {
        const { store, tel, list, selectPeriodIdx } = this.state
        return (
            <View className='book'>
                <View className="book-info-wrapper">
                    <View className="book-info" onClick={this.jumToStores}>
                        <Text>门店</Text>
                        <Text>{store} <Text className="icon-ic_more iconfont" ></Text></Text>
                    </View>
                    <View className="book-info">
                        <Text>预约手机号</Text>
                        {tel ? <Text>{tel}</Text> : <Button className="getUserPhoneBtn" onGetPhoneNumber={this.getPhoneNumber} openType="getPhoneNumber">点击验证手机号</Button>}
                    </View>
                </View>
                <WeekDate></WeekDate>
                <View className="period-wrapper">
                    {list.map((x, i) => {
                        const statusText = x.joined ? '您已预约' : x.full ? '满员' : `${x.num || '无'}人预约`
                        const statusClass = x.joined ? 'joined' : x.full || !x.num ? 'full' : ''
                        return (<View key={i} data-idx={i} className={`period ${x.joined || x.full ? 'disable' : selectPeriodIdx == i ? 'selected' : ''}`} onClick={this.selectPeriod}>
                            <Text>{x.period}</Text>
                            <View className="period-detail">
                                <View className="period-avatars-wrapper">
                                    {x.avatars.slice(0, 3).map((src, i) => {
                                        return <View className="period-avatars" key={i}><Image className="mini-avatar" src={src}></Image></View>
                                    })}
                                </View>
                                <Text className={`${statusClass} status-text`}>{statusText}</Text>
                            </View>
                        </View>)
                    })}
                </View>
                {coupons ? <View className="coupon-wrapper" onClick={this.jumToCoupons}>
                    <Text>优惠券</Text>
                    <Text>
                        <Text className={`coupon-text {discount?'discount':'coupon-num'}`}>{!discount ? `${coupons}个可用` : `-￥${discount}`}</Text>
                        <Text className="icon-ic_more iconfont"></Text>
                    </Text>
                </View> : null}
                <View className="footer">
                    <Text className="amount">￥{amount}</Text>
                    <View className="pay-button" onClick={this.toPay}> 立即支付</View>
                </View>
            </View>
        )
    }
}

export default Book
