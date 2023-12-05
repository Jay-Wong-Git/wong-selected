//封装一个函数用于返回当前是:早上/上午/下午/晚上
export const getTime = () => {
  let message = ''
  const hour = new Date().getHours()
  if (hour < 12) {
    message = 'morning'
  } else if (hour < 18) {
    message = 'afternoon'
  } else {
    message = 'night'
  }
  return message
}
