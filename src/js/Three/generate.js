function generateInitialNum(num_1, num_2) {
  let rate = Math.random();
  let num = 1;
  if (num_1 > num_2) { num = 2; num_2++; }
  else if (num_2 > num_1) { num = 1; num_1++; }
  else {
    if (rate > 0.6) { num = 1; num_1++; }
    else if (rate > 0.2) { num = 2; num_2++; }
    else if (rate > 0.1) num = 3;
    else num = 6;
  }
  return num;
}


function generateNum(num1, num2, maxNum) {


  //如果生成除1,2以外的大数,计算概率
  let bigNum = 3;
  if (maxNum >= 192) {
    bigNum = maxNum;
    let randomDivision = 4;
    let rate = Math.random();
    if (rate > 0.9) randomDivision = 3; //0.2的概率 生成maxNum的3次根
    else if (rate > 0.8) randomDivision = 4;
    else if (rate >= 0) randomDivision = 5;
    while (randomDivision--) {
      bigNum /= 2;
    }
  } else {
    let smallRate = Math.random();
    bigNum = (smallRate > 0.1 ? 3 : 6);
  }

  let next = 1;
  let rate = Math.random();
  if (num1 > num2)
    next = (rate < 0.8) ? 2 : bigNum;
  else if (num2 > num1)
    next = (rate < 0.8) ? 1 : bigNum;
  else { //1和2的个数已经匹配
    if (rate < 0.4)
      next = 2;
    else if (rate < 0.8)
      next = 1;
    else
      next = bigNum;
  }

  return next;
}

export { generateNum, generateInitialNum };