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
    const minutes = ('0' + date.getMinutes()).slice(-2)
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
    const date = new Date(timestamp * 1);
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
const EARTH_RADIUS = 6378137.0;    //单位M
const PI = Math.PI;

function getRad(d) {
    return d * PI / 180.0;
}

/**
 * caculate the great circle distance
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
export function calDistance(lat1, lng1, lat2, lng2) {
    let radLat1 = getRad(lat1);
    let radLat2 = getRad(lat2);

    let a = radLat1 - radLat2;
    let b = getRad(lng1) - getRad(lng2);

    let pureDistance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    pureDistance = Math.round(pureDistance * EARTH_RADIUS);
    let distance = ''
    if (pureDistance < 1000) {
        distance = pureDistance + 'm'
    } else if (pureDistance <= 9900) {
        distance = Math.round(pureDistance / 100) / 10 + 'km'
    } else {
        distance = Math.round(pureDistance / 1000) + 'km'
    }
    return { distance, pureDistance };
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
                x.sections.forEach(sec => {
                    if (sec.exercise) {
                        exercises.push(sec.exercise)
                    }
                })
            }
        })
        const hash = {}
        const uniqueExercises = []
        exercises.forEach(e => {
            const id = e._id.$oid
            if (id && !hash[id]) {
                uniqueExercises.push(e)
                hash[id] = 1
            }
        })
        return uniqueExercises
    }
}

export function queryString(url, name) {
    let params = {};
    if (url.indexOf("?") != -1) {
        let str = url.split('?')[1];
        let strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            params[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }
    return name ? params[name] : params

}
