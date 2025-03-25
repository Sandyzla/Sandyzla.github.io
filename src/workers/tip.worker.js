let reachNum
let tipNum
let isLimitTip = false
let tipCount = 0
let canSolve = false
let verifyCount = 0

self.onmessage = function (e) {
  let mes = e.data
  tipCount = 0
  verifyCount = 0
  canSolve = false
  tipNum = mes.tipNum
  reachNum = mes.reachNum
  isLimitTip = mes.isLimitTip
  // status 1:枚举完所有可能的解法,发现此题无解, 2:有解(可能还未找全), 3:已经找到tipNum指定的解数量, 4:已经找到全部解, 5:不是解,仅用于UI中的查找进度
  recursion([], mes.size, mes.size - 1, mes.nums) //动态规划的方式递归所有可能的解法
  if (canSolve)
    self.postMessage({ status: 4 }) //已经找到全部解
  else {
    self.postMessage({ status: 1 }) //枚举完所有可能的解法，发现此题无解，交由主线程重新生成新的题目
  }
}

//参数：numOfPoker剩余可用的牌数；numOfSign：剩余可用的运算符数；剩余可用的卡牌数组
function recursion(post_s, numOfPoker, numOfSign, nums) {
  if (isLimitTip && tipCount == tipNum) {
    // console.log('worker的tip达到目标数返回')
    self.postMessage({ status: 3 }) //已经找到tipNum指定的解数量
    return
  }
  if (numOfPoker == 0 && numOfSign == 0) {
    verifyCount++
    if (compute(post_s) == reachNum) {
      tipCount++
      canSolve = true
      // console.log(post_s)
      // console.log(tipCount)

      self.postMessage({ status: 2, tipCount: tipCount, post_s: post_s }) //有解(可能还未找全)
    } else {
      if (verifyCount % 100 == 0) self.postMessage({ status: 5, verifyCount: verifyCount }) //不是解,仅用于UI中的查找进度
    }
    return
  }
  //若取==,此时已得到的后缀表达式实际上结果是一个数,因此不能再添加运算符,只能枚举剩余的数
  for (let i = 0; i < nums.length; i++) {
    recursion(post_s.concat(nums[i]), numOfPoker - 1, numOfSign, nums.toSpliced(i, 1)) //toSpliced是软拷贝,不会影响外面的nums
    let j = i + 1
    while (nums[i] == nums[j] && j < nums.length) {
      i++
      j++
    }
  }
  if (numOfPoker < numOfSign) {
    recursion(post_s.concat('+'), numOfPoker, numOfSign - 1, nums)
    recursion(post_s.concat('-'), numOfPoker, numOfSign - 1, nums)
    recursion(post_s.concat('×'), numOfPoker, numOfSign - 1, nums)
    recursion(post_s.concat('÷'), numOfPoker, numOfSign - 1, nums)
  }
}
// 以下均是运算用的函数,除了选择模式下的4*6/3*8/2*12逻辑外,都与项目逻辑无关
function compute(d) {
  let num = []
  let result = 0
  for (let i = 0; i < d.length; i++) {
    if (typeof d[i] == 'number') {
      num.push(d[i])
    } else if (d[i] == '+' || d[i] == '-' || d[i] == '×' || d[i] == '÷') {
      let num1 = num.pop()
      let num2 = num.pop()

      switch (d[i]) {
        case '+':
          result = num2 + num1
          break
        case '-':
          result = num2 - num1
          break
        case '×':
          result = num2 * num1
          if (i == d.length - 1 && d[i] == '×' && result == 24 && reachNum == 24) {
            if (num1 == 6) {
              //4*6=24
              self.postMessage({ status: 6 }) //可用4*6解决
            } else if (num1 == 8) {
              //3*8=24
              self.postMessage({ status: 8 }) //可用3*8解决
            } else if (num1 == 12) {
              //12*2=24
              self.postMessage({ status: 12 }) //可用2*12解决
            }
          }
          break
        case '÷':
          result = num2 / num1
          break
      }
      num.push(result)
    }
  }
  if (isPossibleInfiniteDecimal(num[0])) {
    return num[0].toFixed(4)
  } else {
    return num[0]
  }
}
function isPossibleInfiniteDecimal(num) {
  // 将数字转换为字符串
  let str = num.toString()
  // 找到小数点的位置
  let dotIndex = str.indexOf('.')
  // 如果没有小数点，那么这个数字肯定不是无限小数
  if (dotIndex === -1) {
    return false
  }
  // 计算小数点后的位数
  let decimalPlaces = str.length - dotIndex - 1
  // 如果小数点后的位数超过了15，那么我们认为这个数字可能是无限小数
  return decimalPlaces > 15
}
