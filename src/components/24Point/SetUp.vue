<template>
  <div class="wrapper">
    <div :class="{ container: !darkMode, container_dark: darkMode }" style="height: 160px">
      <div class="lineDiv">
        <label class="note">目标数字:</label>
        <input type="number" min="-1998" max="1998" v-model="reachNum" />
      </div>
      <div class="lineDiv">
        <label class="note">卡牌数量:</label>
        <input type="number" min="2" max="20" v-model="size" />
      </div>
      <div class="lineDiv">
        <label class="note">牌值区间</label>
        <input type="number" min="-999" max="999" v-model="minNum" />
        <label class="note">至</label>
        <input type="number" :min="minNum" max="999" v-model="maxNum" />
      </div>
    </div>

    <div :class="{ container: !darkMode, container_dark: darkMode }" style="height: 120px">
      <div class="lineDiv">
        <label class="note">解题时间:</label>
        <input type="number" min="0" max="9999" v-model="initialMinute" /><label class="note">分</label>
        <input type="number" min="0" max="59" v-model="initialSecond" /><label class="note">秒</label>
      </div>
      <div class="lineDiv">
        <label class="note">奖励时间:</label>
        <input type="number" min="0" max="9999" v-model="addMinute" /><label class="note">分</label>
        <input type="number" min="0" max="59" v-model="addSecond" /><label class="note">秒</label>
      </div>
    </div>
    <div :class="{ container: !darkMode, container_dark: darkMode }" style="height: 150px">
      <div class="lineDiv">
        <label class="note">限制查找的题解个数? </label>
        <input type="checkbox" style="height: 20px; width: 20px" v-model="isLimitTip" />
      </div>
      <div class="lineDiv">
        <label class="note">最多查找的题解个数:</label>
        <input type="number" min="1" max="1000" :disabled="!isLimitTip" v-model="tipNum" />
      </div>
      <div class="lineDiv">
        <label class="note" style="color: rgb(155, 150, 143); font-size: 18px">（建议牌数≥6时勾选以缩短加载时间）
        </label>
      </div>
    </div>
    <div class="buttonLabel">
      <button @click="confirm">生成</button>
      <button @click="close">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['darkMode'],
  data() {
    return {
      size: 4, //初始卡牌数量
      minNum: 1, //最小值
      maxNum: 13, //最大值
      reachNum: 24, //目标数
      tipNum: 1, //-1表示无限制
      initialMinute: 1, //初始分钟数
      initialSecond: 0, //初始秒数[该值在TheTimer.vue中有重复定义]
      addMinute: 0, //加时的分钟数
      addSecond: 24, //每一次正确解决都会延时的秒数[该值在TheTimer.vue中有重复定义]
      isLimitTip: false, //是否限制tip个数,如果false,需要在emit中修改tipNum为-1
    }
  },
  methods: {
    confirm() {
      let setUpData = {
        size: this.size,
        minNum: this.minNum,
        maxNum: this.maxNum,
        reachNum: this.reachNum,
        tipNum: this.tipNum,
        initialMinute: this.initialMinute,
        initialSecond: this.initialSecond,
        addMinute: this.addMinute,
        addSecond: this.addSecond, //每一次正确解决都会延时的秒数[该值在TheTimer.vue中有重复定义]
        isLimitTip: this.isLimitTip,
      }
      this.$emit('set-up', setUpData)
    },
    close() {
      this.$emit('close-set')
    },
  },
  watch: {
    reachNum(newValue) {
      if (newValue > 1998) this.reachNum = 1998
      if (newValue < -1998) this.reachNum = -1998
    },
    size(newValue) {
      if (newValue > 20) this.size = 20
      if (newValue < 2) this.size = 2
    },
    minNum(newValue) {
      if (newValue > 999) this.minNum = 999
      if (newValue > this.maxNum) {
        this.maxNum = newValue
      }
      if (newValue < -999) this.minNum = -999
    },
    maxNum(newValue) {
      if (newValue > 999) this.maxNum = 999
      if (newValue < this.minNum) {
        this.minNum = newValue
      }
      if (newValue < -999) this.maxNum = -999
    },
    tipNum(newValue) {
      if (newValue > 1000) this.tipNum = 1000
      if (newValue < 1) this.tipNum = 1
    },
    initialMinute(newValue) {
      if (newValue > 9999) this.initialMinute = 9999
      if (newValue < 0) this.initialMinute = 0
    },
    initialSecond(newValue) {
      if (newValue > 59) this.initialSecond = 59
      if (newValue < 0) this.initialSecond = 0
    },
    addMinute(newValue) {
      if (newValue > 9999) this.addMinute = 9999
      if (newValue < 0) this.addMinute = 0
    },
    addSecond(newValue) {
      if (newValue > 59) this.addSecond = 59
      if (newValue < 0) this.addSecond = 0
    },
  },
}
</script>

<style scoped>
div.wrapper {
  z-index: 9999;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  align-items: center;
}

div.container,
div.container_dark {
  flex-direction: column;
  background-color: aliceblue;
  width: 400px;
  border: 1.5px solid rgba(197, 60, 60, 0.6);
  padding-left: 50px;
  padding-right: 50px;
  margin: 20px;
}

button,
div.buttonLabel,
div.container_dark,
div.container {
  display: flex;
  justify-content: center;
  border-radius: 10px;
  color: rgb(179, 111, 28);
  font-size: 22px;
}

div.container_dark {
  background-color: rgb(193, 193, 193);
}

div.buttonLabel {
  justify-content: space-evenly;
  width: 400px;
}

input.LimitTip {
  width: 18px;
}

input:disabled {
  background-color: rgb(173, 173, 173);
  color: rgb(222, 222, 222);
}

div.lineDiv {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  color: rgb(179, 111, 28);
  font-size: 20px;
  height: 40px;
}

button {
  height: 50px;
  width: 100px;
  cursor: pointer;
  border: 1.5px solid rgba(197, 60, 60, 0.6);
  line-height: 42px;
}

label {
  line-height: 40px;
}

label.note,
input {
  font-size: inherit;
  border-radius: inherit;
  color: inherit;
  background-color: inherit;
  height: 40px;
  text-align: center;
}

input {
  border: 1.5px solid rgba(197, 60, 60, 0.6);
  width: 80px;
  height: 30px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: white;
}
</style>
