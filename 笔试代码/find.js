// 约定：
// title 数据类型为 String
// userId 为主键，数据类型为 Number
var data = [
  {userId: 8,  title: 'title1'},
  {userId: 11, title: 'other'},
  {userId: 15, title: null},
  {userId: 19, title: 'title2'}
];

var find = function(origin) {
  const where = filterOpt => {
    let filterOrigin

    if (!Array.isArray(origin) || !Boolean(origin.length)) filterOrigin = []

    filterOrigin = origin.filter(item => {
      let condition = true
      for (key in filterOpt) {
        condition = item.hasOwnProperty(key) ? (condition && new RegExp(filterOpt[key]).test(item[key])) : condition  
      }
      return condition
    })

    const orderBy = (orderAttr, orderType = 'asc') => {
      filterOrigin.sort((prev, next) => { 
        if (orderType.toLowerCase() === 'desc') {
          return next[orderAttr] - prev[orderAttr]
        }
        return prev[orderAttr] - next[orderAttr]
      })
      return filterOrigin
    }

    return { orderBy }
  }

  return { where }
}
// 查找 data 中，符合条件的数据，并进行排序
var result = find(data).where({
  'title': /\d$/
}).orderBy('userId', 'desc');

console.log(result);// [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];