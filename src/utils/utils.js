function fill(d = []) {
  return d.map(x => {
   return (x + '').padStart(2, '0')
  })
}

export const utils = {
  yesterDay: function () {
    let date = new Date(),
        y = date.getUTCFullYear(),
        M = date.getUTCMonth() + 1,
        d = date.getUTCDate() -1,
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
}