const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getDateStr = (addDayCount) => {
  const dd = new Date();
  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
  const y = dd.getFullYear();
  const m = formatNumber(dd.getMonth() + 1);//获取当前月份的日期
  const d = dd.getDate();
  return y + "" + m + "" + d;
}

module.exports = {
  formatTime: formatTime,
  getDateStr: getDateStr
}
