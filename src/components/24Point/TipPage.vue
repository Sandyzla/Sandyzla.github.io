<template>
  <div class="wrapper">
    <div class="container">
      <ul>
        <li v-for="(tip, index) in tips" :key="index">{{ tip }}</li>
      </ul>

      <button @click="close">close</button>
    </div>
  </div>
</template>

<script>
export default {
  emit: ['closeTip'],
  data() {
    return {
      solutions: [],
      tips: [],
    }
  },
  methods: {
    getTip() {
      this.tips = []
      let stack = [] //辅助栈
      for (let i = 0; i < this.solutions.length; i++) {
        //后缀转中缀
        let post_s = this.solutions[i]
        for (let j = 0; j < post_s.length; j++) {
          if (typeof post_s[j] == 'number') {
            //数字
            if (post_s[j] < 0) {
              stack.push('(' + post_s[j] + ')')
            } else {
              stack.push(post_s[j])
            }
          } else {
            //运算符+-*/
            let oj1 = stack.pop() //oj1,oj2可能是数字也可能是表达式
            let oj2 = stack.pop()
            if (post_s[j] == '*') post_s[j] = '×'
            else if (post_s[j] == '/') post_s[j] = '÷'
            if (j < post_s.length - 1) stack.push('(' + oj2 + post_s[j] + oj1 + ')')
            else stack.push(oj2 + post_s[j] + oj1)
          }
        }
        // this.tip = "tip(" + (this.tipId + 1) + '/' + totalWays + ")  " + stack[0] + "=" + this.reachNum;
        this.tips.push(stack[0])
        stack.pop()
      }
    },
    close() {
      this.$emit('closeTip')
    },
  },
}
</script>

<style scoped>
div.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  align-items: center;
}

div.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* width: min-content; */
  /* max-width: 80%; */
  height: min-content;
  /* 默认情况下，div的高度适应ul的高度 */
  max-height: 95%;
  /* 当ul的高度超过屏幕高度时，div的高度为100% */
  font-size: 24px;
  background-color: aliceblue;
  border: 1.5px solid rgba(163, 35, 35, 0.6);
  border-radius: 10px;
  color: rgb(179, 111, 28);
}

ul {
  padding: 30px 30px 10px 30px;
  overflow-y: auto;
  list-style: none;
}

li {
  padding-bottom: 10px;
}

button {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  border-radius: 12px;
  color: rgb(179, 111, 28);
  font-size: 22px;
  height: 50px;
  width: 100px;
  cursor: pointer;
  border: 1.5px solid rgba(197, 60, 60, 0.6);
  line-height: 42px;
}
</style>
