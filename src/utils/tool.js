import { addDays, eachDay,format } from 'date-fns'
import Taro, { Component } from '@tarojs/taro'

export function weekDate() {
    const weekStr = ['日', '一', '二', '三', '四', '五', '六']
    const today = new Date();
    const dayAWeekFromNow = addDays(today, 6);
    const thisWeek = eachDay(today, dayAWeekFromNow);
    let dates = thisWeek.map(d => {
        return {
            week: weekStr[d.getDay()],
            date: d.getDate()
        }
    })
    dates[0]['week'] = '今日'
    return dates
}

export function addDayStr(n){
    const today = new Date();
    const dayFromNow = addDays(today, n);
    return format(dayFromNow,'YYYYMMDD')
}

// - 小于1km，显示单位m，如321m
// - 1km至9.9km之间，显示单位km，允许小数点后一位；如果小数点后是0，则显示为整数
// - 10km以上，显示单位km，并且都为整数
export function calDistance(la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = Math.round(s * 6378.137);
    if (s < 1000) {
        s = s + 'm'
    } else if (s <= 9900) {
        s = Math.round(s / 100) / 10 + 'km'
    } else{
        s = Math.round(s / 1000) + 'km'
    }
    return s;
}

