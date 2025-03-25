<template>
  <div class="container">
    <TransitionGroup name="list" tag="label" class="num_cards">
      <div v-for="(item, index) in nums" :key="index" @click="selectNum(index)" class="num_card" :class="{
        num_correct:
          this.numsExist.filter((value) => value === true).length == 1 &&
          nums[index].up / nums[index].down == setUpData.reachNum,
        num_selected: index == selectNumId,
        num_deleted: !numsExist[index],
      }">
        <div v-if="nums[index].down == 1" class="num_card_integer">
          <span class="integer">
            {{ nums[index].up }}
          </span>
        </div>
        <div v-if="nums[index].down != 1" class="num_card_fraction">
          <span class="numerator">{{ nums[index].up }}</span>
          <hr class="divider" />
          <span class="denominator">{{ nums[index].down }}</span>
        </div>
      </div>

    </TransitionGroup>
    <div v-show="nums.length == 0" class="no_card"></div>
    <!-- </div> -->
    <TransitionGroup name="slide">
      <div :key="2" v-show="showBaseAns" class="num_cards">
        <label class="sign_card" :class="checkSelectSign('+')" @click="selectSign('+')">+</label>
        <label class="sign_card" :class="checkSelectSign('-')" @click="selectSign('-')">-</label>
        <label class="sign_card" :class="checkSelectSign('×')" @click="selectSign('×')">×</label>
        <label class="sign_card" :class="checkSelectSign('÷')" @click="selectSign('÷')">÷</label>
      </div>

      <QuickAns :key="3" @quickAns="handleAns" v-show="showQuickAns" ref="quickAnsRef"></QuickAns>
    </TransitionGroup>
    <!-- 切换选择模式和解题模式 -->
    <Transition name="slide">
      <div @click="toggleQuickAns" :class="{ ansMode: canToggleQA, lockAnsMode: !canToggleQA }">
        <label v-show="showQuickAns" class="quickAns"> 选择模式 </label>
        <label v-show="!showQuickAns" class="normalAns"> 解题模式 </label>
        <img style="width: 24px; cursor: inherit" src="../../assets/24Point/switch.png" />
      </div>
    </Transition>
    <!-- 重做 -->
    <div @click="redo" class="redo">
      <img style="width: 32px" src="../../assets/24Point/redo.svg" />
    </div>
  </div>
</template>

<script>
import * as NumHelp from './fraction.js'
import QuickAns from './QuickAns.vue'
export default {
  components: {
    QuickAns,
  },
  data() {
    return {
      setUpData: {},
      selectNumId: -1,
      selectSignChar: '',
      nums: [],
      numsExist: [],
      copy_nums: [], //重置时使用
      showBaseAns: true,
      showQuickAns: false,
      canToggleQA: true,
    }
  },
  methods: {
    updateSetUp(setUpData) {
      this.setUpData = setUpData
    },
    initialData() {
      this.nums = []
      this.solutions = []
      this.selectNumId = -1
      this.selectSignChar = ''
      this.tipCount = 0
      this.$refs.quickAnsRef.initialData()
      for (let i = 0; i < this.setUpData.size; i++) {
        this.numsExist[i] = true
      }
    },
    checkSelectSign(sign) {
      return sign == this.selectSignChar ? 'sign_selected' : 'sign_card'
    },
    setNums(nums) {
      this.nums = nums
      this.copy_nums = JSON.parse(JSON.stringify(nums))
    },
    setQAChoice(status) {
      this.$refs.quickAnsRef.setChoice(status)
    },
    selectNum(index) {
      if (!this.numsExist[index]) return
      if (this.selectNumId == index) {
        //取消选择
        this.selectNumId = -1
      } else if (this.selectNumId == -1 || this.selectSignChar == '') {
        //未选数字或未选运算符
        this.selectNumId = index
      } else {
        //选了数字也选了运算符, 计算结果
        switch (this.selectSignChar) {
          case '+':
            // this.nums[index] += this.nums[this.selectNumId]
            this.nums[index] = NumHelp.add(this.nums[index], this.nums[this.selectNumId])
            break
          case '-':
            // this.nums[index] = this.nums[this.selectNumId] - this.nums[index]
            this.nums[index] = NumHelp.subtract(this.nums[index], this.nums[this.selectNumId])
            break
          case '×':
            // this.nums[index] *= this.nums[this.selectNumId]
            this.nums[index] = NumHelp.multiply(this.nums[index], this.nums[this.selectNumId])
            break
          case '÷':
            // this.nums[index] = this.nums[this.selectNumId] / this.nums[index]
            this.nums[index] = NumHelp.divide(this.nums[index], this.nums[this.selectNumId])
            break
        }
        //删除原来选择的数
        this.numsExist[this.selectNumId] = false
        this.selectSignChar = ''
        let existCount = this.numsExist.filter((value) => value === true).length
        if (existCount == 1) {
          if (this.nums[index].up / this.nums[index].down == this.setUpData.reachNum) {
            this.handleAns(1)
          } else this.handleAns(0)
        } else {
          this.selectNumId = index
        }
      }
    },
    selectSign(sign) {
      if (this.selectSignChar == sign) {
        //点击了已选的,则删除
        this.selectSignChar = ''
      } else {
        this.selectSignChar = sign
      }
    },
    redo() {
      this.nums = JSON.parse(JSON.stringify(this.copy_nums))
      for (let i = 0; i < this.setUpData.size; i++) {
        this.numsExist[i] = true
      }
      this.selectNumId = -1
      this.selectSignChar = ''
    },
    handleAns(status) {
      this.$emit('handle-ans', status)
    },
    setCanToggleQA() {
      this.canToggleQA = true
    },
    setCanNotToggleQA() {
      this.canToggleQA = false
    },
    toggleQuickAns() {
      if (!this.canToggleQA) return
      if (this.showBaseAns) {
        this.showBaseAns = false
        setTimeout(() => {
          this.showQuickAns = true
        }, 200)
      } else {
        this.showQuickAns = false
        setTimeout(() => {
          this.showBaseAns = true
        }, 180)
      }
      this.canToggleQA = false
      setTimeout(() => {
        this.canToggleQA = true
      }, 500)
    },
  },
}
</script>

<style scoped>
div.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.num_cards {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.num_card {
  width: 110px;
  height: 110px;
  background-color: rgb(172, 219, 223);
  border-radius: 10px;
  transition: all 0.04s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
}

.no_card {
  color: rgba(255, 255, 255, 0);
  height: 110px;
  margin: 10px;
}

.num_card_integer,
.num_card_fraction {
  width: 100%;
}

.integer,
.numerator,
.denominator {
  color: black;
  font-weight: 1000;
}

.integer {
  font-size: 48px;
}

.numerator,
.denominator {
  font-weight: 900;
  font-size: 32px;
}

.divider {
  width: 50%;
  border: none;
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 10px;
  border-top: 4px solid black;
}

div.num_correct {
  background-color: rgb(248, 101, 22);
}

div.num_selected {
  background-color: rgb(31, 186, 233);
}

div.num_deleted {
  opacity: 0;
}

.sign_card {
  font-size: 36px;
  border-radius: 10px;
  color: rgb(230, 77, 46);
  font-weight: 1000;
  background-color: rgb(247, 207, 196);
  margin: 10px;
  line-height: 70px;
  width: 70px;
  height: 70px;
  display: inline-block;
  transition: all 0.04s ease-out;
}

.sign_selected {
  color: rgb(255, 255, 255);
  background-color: rgb(230, 77, 46);
}

div.ansMode,
div.lockAnsMode {
  cursor: pointer;
  display: flex;
  background-color: rgb(249, 249, 249);
  justify-content: center;
  align-items: center;
  border: 1.5px dashed rgb(179, 111, 28);
  border-radius: 10px;
  z-index: 9998;
  position: fixed;
  left: calc(100% - 390px);
  top: calc(2% + 5px);
  transition: all 0.1s;
  color: rgb(179, 111, 28);
}

div.lockAnsMode {
  cursor: default;
  background-color: rgb(199, 147, 92);
  color: rgb(250, 215, 149);
}

label.quickAns {
  cursor: inherit;
  margin-right: 15px;
  font-size: 18px;
  transition: all 0.2s;
  height: 30px;
  line-height: 30px;
  color: inherit;
}

label.normalAns {
  cursor: inherit;
  margin-right: 15px;
  font-size: 18px;
  transition: all 0.2s;
  height: 30px;
  line-height: 30px;
  color: inherit;
}

div.redo {
  cursor: pointer;
  z-index: 9999;
  position: fixed;
  left: calc(100% - 190px);
  top: calc(2% + 5px);
  transition: all 0.2s;
}

.slide-enter-from {
  transform: translateX(200px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}

.slide-enter-active {
  transition: all 0.18s ease-in-out;
}

.slide-leave-active {
  transition: all 0.18s ease-in-out;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-leave-active {
  position: absolute;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
