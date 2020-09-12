function fill(d = []) {
  return d.map(x => {
   return (x + '').padStart(2, '0')
  })
}

export const utils = {
  /*pixiv无法获取当天的排行，该方法返回昨天的世界时间*/
  yesterDay: function () {
    let date = new Date(),
        y = date.getUTCFullYear(),
        M = date.getUTCMonth() + 1,
        d = date.getUTCDate() -2,
        h = date.getUTCHours(),
        m = date.getUTCMinutes(),
        s = date.getUTCSeconds();

    if (d === 1) {
      let bigMonth = [1, 3, 5, 7, 8, 10, 12];
      if (M === 1) {
        y -= 1;
        d = '31';
        M = '12';
      } else {
        M -= 1;
        if (M === 2) {
          d = y & 4 ? '28' : '29'
        } else {
          d = bigMonth.indexOf(M) === -1 ? '30' : '31';
        }
      }
    }
    let fillDate = fill([y,M,d,h,m,s])
    return `${fillDate[0]}-${fillDate[1]}-${fillDate[2]}`
  },
  /*
  * min 随机数的最小数
  * max 随机数的最大数
  * count 随机颜色的数量
  * transparent 随机颜色透明度，默认不透明
  * */
  randomColor(min,max,count,transparent=1){
    let random = [],
        result = [];
    for(let i = 0 ; i < 20 ; i++){
      for(let i = 0 ; i < 3 ; i++){
        random.push(Math.floor(Math.random() * (max - min + 1)) + min)
      }
      result.push(`rgba(${random[0]},${random[1]},${random[2]},${transparent})`)
      random = [];
    }
    return result
  },
}