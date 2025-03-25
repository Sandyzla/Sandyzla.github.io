//此函数为算法核心部分,负责递归查找解法
export function infixToPostfix(s) {
  let Postfix_s = []
  let sign = []
  for (let i = 0; i < s.length; i++) {
    if (typeof s[i] == 'number') {
      Postfix_s.push(s[i])
    } else if (s[i].length > 1) {
      //负数
      Postfix_s.push(parseInt(s[i].substring(1, s[i].length - 1)))
    } else if (s[i] == '+' || s[i] == '-') {
      while (sign.length != 0 && sign[sign.length - 1] != '(') Postfix_s.push(sign.pop())
      sign.push(s[i])
    } else if (s[i] == '×' || s[i] == '÷') {
      if (sign.length != 0 && (sign[sign.length - 1] == '×' || sign[sign.length - 1] == '÷'))
        Postfix_s.push(sign.pop())
      sign.push(s[i])
    } else if (s[i] == '(') {
      sign.push(s[i])
    } else if (s[i] == ')') {
      while (sign[sign.length - 1] != '(') Postfix_s.push(sign.pop())
      sign.pop()
    }
  }

  while (sign.length != 0) {
    Postfix_s.push(sign.pop())
  }
  return Postfix_s
}

export function compute(d) {
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

// class tipWorker {
//   constructor(size, nums, tipNum) {
//     this.size = size;
//     this.solutions = [];
//     this.tipNum = tipNum;
//     this.recursion([], size, size - 1, nums);
//     this.reachNum = 24;
//   }
//   in_s = "";
//   reachNum = 24;
//   tipNum = -1;
//   tipCount = 0;
//   size = 0;
//   solutions = [];
// }
