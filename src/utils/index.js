/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function transformDateTime(dateTime) {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = ((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)
  const day = (date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate()
  const hour = (date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()
  const minute = (date.getMinutes() < 10) ? ('0' + date.getMinutes()) : date.getMinutes()
  const second = (date.getSeconds() < 10) ? ('0' + date.getSeconds()) : date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

export function combine() {
  const arr = [].concat.apply([], arguments)
  return Array.from(new Set(arr))
}

export function transformTime2Num(timeString) {
  return Date.parse('2018-08-09 ' + timeString)
}

export function returnTime(start_time, count, interval) {
  const startTime = transformDateTime(transformTime2Num(start_time) + (count * interval * 1000)).split(' ')[1]
  const endTime = transformDateTime(transformTime2Num(start_time) + ((count + 1) * interval * 1000)).split(' ')[1]
  return {
    start_time: startTime,
    end_time: endTime
  }
}

export function returnPercent(start_time, end_time) {
  const duration = transformTime2Num(end_time) - transformTime2Num(start_time)
  return (duration / (12 * 60 * 60 * 1000)) * 100
}

/**
 * 处理一个时间段内节目单
 * @param startTime 开始时间 '09:00:00'
 * @param endTime 结束时间 '09:30:00'
 * @param list 数组
 * @returns 数组
 */
export function adShowHandler(startTime, endTime, list) {
  // console.log(list)
  const result = list.slice(0, list.length)
  if (list.length === 0) {
    result.push({ ad_id: '0', start_time: startTime, end_time: endTime, ad_name: '待添加', status: 4 })
    return result
  }

  const start = transformTime2Num(startTime)
  const end = transformTime2Num(endTime)

  list.map((item, index) => {
    if (transformTime2Num(item.start_time) >= start && transformTime2Num(item.end_time) <= end) {
      // 第一个
      if (index === 0) {
        const item_start = transformTime2Num(item.start_time)
        if (item_start > start) {
          result.unshift({ ad_id: '0', start_time: startTime, end_time: transformDateTime(item_start).split(' ')[1], ad_name: '待添加', status: 4 })
        }
      }
      // 最后一个
      if (index === (list.length - 1)) {
        const item_end = transformTime2Num(item.end_time)
        if (item_end < end) {
          result.push({ ad_id: '0', start_time: transformDateTime(item_end).split(' ')[1], end_time: endTime, ad_name: '待添加', status: 4 })
        }
      }

      // 中间部分
      if (index > 0 && index < list.length) {
        const current_start = transformTime2Num(list[index].start_time)
        const prev_end = transformTime2Num(list[index - 1].end_time)
        if (current_start > prev_end) {
          let tempObj = {}
          let tempIndex = ''
          result.map((res, res_index) => {
            if (res.start_time == list[index].start_time) {
              tempIndex = res_index
              tempObj = { ad_id: '0', start_time: list[index - 1].end_time, end_time: list[index].start_time, ad_name: '待添加', status: 4 }
              return
            }
          })
          result.splice(tempIndex, '', tempObj)
        }
      }
    }
  })
  console.log(result)
  return result
}
