function gcd(a, b) {
  if (!b) {
    return a
  }
  return gcd(b, a % b)
}

function simplify(num) {
  let gcd_num = gcd(num.up, num.down)
  num.up /= gcd_num
  num.down /= gcd_num
  return num
}

export function add(num1, num2) {
  let result = {
    up: num1.up * num2.down + num2.up * num1.down,
    down: num1.down * num2.down,
  }
  return simplify(result)
}

export function subtract(num1, num2) {
  let result = {
    up: num2.up * num1.down - num1.up * num2.down,
    down: num1.down * num2.down,
  }
  return simplify(result)
}

export function multiply(num1, num2) {
  let result = {
    up: num1.up * num2.up,
    down: num1.down * num2.down,
  }
  return simplify(result)
}

export function divide(num1, num2) {
  let result = {
    up: num2.up * num1.down,
    down: num2.down * num1.up,
  }
  return simplify(result)
}
