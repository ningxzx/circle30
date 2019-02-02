import { addDays, eachDay, format } from 'date-fns'
import Taro, { Component } from '@tarojs/taro'

export const WEEK_STR = ['日', '一', '二', '三', '四', '五', '六']

export function weekDate() {
    const today = new Date();
    const dayAWeekFromNow = addDays(today, 6);
    const thisWeek = eachDay(today, dayAWeekFromNow);
    let dates = thisWeek.map(d => {
        return {
            week: WEEK_STR[d.getDay()],
            date: d.getDate()
        }
    })
    dates[0]['week'] = '今日'
    return dates
}

export function addDayStr(n) {
    const today = new Date();
    const dayFromNow = addDays(today, n);
    return format(dayFromNow, 'YYYY-MM-DD')
}

/**
 * 
 * @param {timestamp} 时间戳 e.g.1548898800
 */
export function formatHour(timestamp) {
    const date = new Date(timestamp * 1000);
    const hour = ('0' + date.getHours()).slice(-2)
    const minutes = (date.getMinutes() + '0').slice(0, 2)
    return `${hour}:${minutes}`
}

/**
 * 
 * @param {timestamp} 时间戳 e.g.1548898800
 */
export function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const nowYear = (new Date()).getFullYear()
    if (date.getFullYear() === nowYear) {
        return format(date, 'MM月DD日')
    } else {
        return format(date, 'YYYY年MM月DD日')
    }
}


export function formatNormalDate(timestamp) {
    const date = new Date(timestamp*1);
    return format(date, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 
 * @param {timestamp} 时间戳 e.g.1548898800
 */
export function formatWeek(timestamp) {
    const date = new Date(timestamp * 1000);
    return `周${WEEK_STR[date.getDay()]}`
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
    } else {
        s = Math.round(s / 1000) + 'km'
    }
    return s;
}

const concatArr = arr => arr.reduce((a, b) => a.concat(b), [])
// 训练去重

export function getUniqueExercise(schedules) {
    if (!schedules.length) {
        return []
    } else {
        // 后续考虑用typescript实现
        const lessons = concatArr(schedules.map(schedule => schedule.shop.devices.map(x => x.lesson)))
        const exercises = []
        lessons.forEach(x => {
            const sections = x.sections
            if (sections && sections.some(sec => sec.exercise)) {
                exercises.push(x.sections.filter(sec => sec.exercise)[0])
            }
        })
        const hash = {}
        const uniqueExercises = []
        exercises.forEach(e => {
            const id = e.exercise_id
            if (id && !hash[id]) {
                uniqueExercises.push(e.exercise)
                hash[id] = 1
            }
        })
        return uniqueExercises
    }
}
