import { addDays, eachDay } from 'date-fns'



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

