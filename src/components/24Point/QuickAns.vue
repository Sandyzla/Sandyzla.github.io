<template>
  <div class="container">
    <div class="choiceContainer">
      <div @click="verify(6)" :class="{
        quickCard: verifyNum[6] == 0,
        correctQuickAns: verifyNum[6] == 1,
        wrongQuickAns: verifyNum[6] == -1,
      }">
        4×6
      </div>
      <div @click="verify(8)" :class="{
        quickCard: verifyNum[8] == 0,
        correctQuickAns: verifyNum[8] == 1,
        wrongQuickAns: verifyNum[8] == -1,
      }">
        3×8
      </div>
      <div @click="verify(12)" :class="{
        quickCard: verifyNum[12] == 0,
        correctQuickAns: verifyNum[12] == 1,
        wrongQuickAns: verifyNum[12] == -1,
      }">
        2×12
      </div>
      <div @click="verify(0)" :class="{
        quickCard: verifyNum[0] == 0,
        correctQuickAns: verifyNum[0] == 1,
        wrongQuickAns: verifyNum[0] == -1,
      }">
        other
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emit: ['quickAns'],
  data() {
    return {
      canQuickNum: [], //canQuickNum[6,8,12];
      verifyNum: [], // verifyNum[6,8,12,0],用于点击按钮后改变样式(对或错)
      canClickVerify: true, //防止连续点击
    }
  },
  mounted() {
    this.verifyNum[0] = 0
    this.verifyNum[6] = 0
    this.verifyNum[8] = 0
    this.verifyNum[12] = 0
  },
  methods: {
    initialData() {
      this.canQuickNum[6] = false
      this.canQuickNum[8] = false
      this.canQuickNum[12] = false
      this.canClickVerify = true
    },
    setChoice(choice) {
      this.canQuickNum[choice] = true
    },
    verify(choice) {
      if (!this.canClickVerify) return
      this.canClickVerify = false
      setTimeout(() => {
        this.canClickVerify = true
      }, 1000)
      //判断正误
      let isCorrect = false
      if (choice != 0) {
        //没有选择Other,即选择4*6,3*8,2*12中的一项
        if (this.canQuickNum[choice]) {
          isCorrect = true
        }
      } else if (!this.canQuickNum[6] && !this.canQuickNum[8] && !this.canQuickNum[12]) {
        //选择了Other并且选对了
        isCorrect = true
      } else {
        //选择Other,但是其实4*6,3*8,2*12中有一项是对的,因此答案错误
      }
      //处理逻辑
      if (isCorrect) {
        this.verifyNum[choice] = 1
        this.$emit('quickAns', 1)
        setTimeout(() => {
          this.verifyNum[choice] = 0
        }, 1000)
      } else {
        this.verifyNum[choice] = -1
        if (this.canQuickNum[6]) this.verifyNum[6] = 1
        if (this.canQuickNum[8]) this.verifyNum[8] = 1
        if (this.canQuickNum[12]) this.verifyNum[12] = 1
        if (!this.canQuickNum[6] && !this.canQuickNum[8] && !this.canQuickNum[12])
          this.verifyNum[0] = 1
        this.$emit('quickAns', -1)
        setTimeout(() => {
          this.verifyNum[0] = 0
          this.verifyNum[6] = 0
          this.verifyNum[8] = 0
          this.verifyNum[12] = 0
        }, 1000)
      }
    },
  },
}
</script>

<style scoped>
div.container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 260px;
  height: 140px;
  border-radius: 10px;
}

div.choiceContainer {
  display: grid;
  row-gap: 15px;
  column-gap: 15px;
  grid-template-columns: 1fr 1fr;
}

div.quickCard,
div.correctQuickAns,
div.wrongQuickAns {
  cursor: pointer;
  border-radius: 10px;
  font-size: 26px;
  transition: all 0.2s;
  width: 100px;
  height: 50px;
  line-height: 50px;
  font-weight: 600;
  background-color: rgb(247, 207, 196);
  color: rgb(230, 77, 46);
}

div.correctQuickAns {
  background-color: rgb(91, 213, 146);
  color: rgb(255, 255, 255);
}

div.wrongQuickAns {
  background-color: rgb(255, 99, 93);
  color: rgb(255, 255, 255);
}
</style>
