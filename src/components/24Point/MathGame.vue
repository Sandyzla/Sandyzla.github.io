<template>
  <div class="wrapper">
    <div class="root_container">
      <CoreGame ref="coreRef" @handle-ans="handleAns"></CoreGame>

      <CreateNums ref="createNumsRef" @newTimer="create_newTimer" @continueTimer="create_continue"
        @quickStatus="setQuickStatus"></CreateNums>
      <!-- tip和new按钮 -->
      <div v-show="!showInitialButton" class="flex_div">
        <button v-if="isEndGame" class="tip_button" @click="getTip">tip</button>
        <button v-if="isEndGame" class="next_button" @click="clickNewGame">new</button>
      </div>
      <div v-show="showInitialButton" class="flex_div">
        <button v-if="isEndGame" class="next_button" @click="clickBeginGame">start!</button>
      </div>
    </div>
    <!-- 设置 -->
    <Transition name="fade">
      <div v-show="!showSetUp" class="setUpDiv" @click="openSetUp">
        <!-- 此处删除了!showLoading，后续版本在重构完项目将修复这个bug -->
        <img style="width: 40px" src="../../assets/24Point/setup.svg" />
      </div>
    </Transition>
    <!-- 时间和分数 -->
    <div class="timeAndScore">
      <div class="flexGroup">
        <img style="width: 40px" src="../../assets/24Point/correct.png" />
        <label class="score">{{ score }}/10</label>
      </div>
      <TheTimer @timeout="endGame" ref="timerRef"></TheTimer>
    </div>

    <!-- 快速结束 -->
    <div @click="quickEnd" class="quickEnd">
      <img style="width: 40px" src="../../assets/24Point/quickEnd.png" />
    </div>
    <!-- 提示页 -->
    <Transition name="fade">
      <TipPage @closeTip="showTip = false" v-show="showTip" ref="tipPageRef"></TipPage>
    </Transition>
    <!-- 设置页 -->
    <Transition name="fade">
      <SetUp v-show="showSetUp" @set-up="updateSetUp" @close-set="setClose" ref="setUpRef"></SetUp>
    </Transition>
  </div>
</template>
<script>
import CoreGame from './CoreGame.vue'
import CreateNums from './CreateNums.vue'
import TheTimer from './TheTimer.vue'
import SetUp from './SetUp.vue'
import TipPage from './TipPage.vue'

export default {
  components: {
    CoreGame,
    CreateNums,
    SetUp,
    TheTimer,
    TipPage,
  },
  data() {
    return {
      setUpData: {},
      size: 4, //扑克牌的规模,24点游戏即4张扑克牌
      nums: [],
      tipCount: 0,
      tipId: 0,
      score: 0,
      checkAnsTime: 700, //解答后的短暂视觉停留时间,以毫秒为单位
      isEndGame: true,
      showBaseAns: true,
      showQuickAns: false,
      canToggleQA: true,
      showSetUp: false,
      showTip: false,
      showInitialButton: true,
      //一共是三种状态,一个是数字,一个是加减乘除,一个是左右括号
    }
  },
  methods: {
    nextQuestion(isNewGame) {
      this.$refs.createNumsRef.nextQuestion(this.setUpData.size, isNewGame)
      this.$refs.coreRef.initialData()
    },
    //确认设置后从SetUp子组件emit
    updateSetUp(setUpData) {
      this.setUpData = setUpData
      if (setUpData.reachNum == 24) {
        setTimeout(() => {
          this.$refs.coreRef.setCanToggleQA()
        }, 400)
      } else {
        this.showQuickAns = false
        this.showBaseAns = true
        this.$refs.coreRef.setCanNotToggleQA()
      }
      this.$refs.coreRef.updateSetUp(setUpData)
      this.$refs.createNumsRef.updateSetUp(setUpData)
      this.$refs.timerRef.setTimer(setUpData.initialMinute * 60 + setUpData.initialSecond, setUpData.addMinute * 60 + setUpData.addSecond)
      this.newGame()
      this.showSetUp = false
      this.showInitialButton = false //用tip、new按钮取代start按钮
    },
    handleAns(status) {
      if (this.isEndGame) return
      this.$refs.timerRef.handleAns(status, this.checkAnsTime); //处理倒计时逻辑以及更新时间UI
      if (status == 1) { //成功解题或选择正确(解题模式只可能正确，因此无需判错)
        this.score++
        setTimeout(() => {
          this.nextQuestion(false) //false表示不是新游戏而是一局游戏中的下一个题目
        }, this.checkAnsTime)
      } else if (status == -1) { //选择错误
        setTimeout(() => {
          this.nextQuestion(false) //false表示不是新游戏而是一局游戏中的下一个题目
        }, this.checkAnsTime)
      }
    },
    setClose() {
      this.showSetUp = false
    },
    openSetUp() {
      this.showSetUp = true
    },
    getTip() {
      this.showTip = true
      this.$refs.tipPageRef.getTip()
    },
    //status{-1:快速选择错误, 0:回答错误, 1:快速选择或回答正确}
    quickEnd() {
      this.$refs.timerRef.setAllTimerZero()
    },
    endGame() {
      this.isEndGame = true
    },

    clickNewGame() {
      if (!this.isEndGame) return
      this.newGame()
    },
    newGame() {
      this.isEndGame = false
      this.score = 0
      this.nextQuestion(true) //true表示是新游戏而不是一局游戏中的下一个题目
    },
    create_newTimer(nums, solutions) { //新游戏（十道题）
      this.$refs.coreRef.setNums(nums)
      this.$refs.timerRef.newTimer()
      this.$refs.tipPageRef.solutions = solutions
    },
    create_continue(nums, solutions) { //一局游戏的下一道题
      this.$refs.coreRef.setNums(nums)
      this.$refs.timerRef.continueTimer()
      this.$refs.tipPageRef.solutions = solutions
    },
    setQuickStatus(status) {
      this.$refs.coreRef.setQAChoice(status)
    },
    clickBeginGame() { //路径为MathGame:clickBeginGame->SetUp:confirm->MathGame:updateSetUp,相当于新游戏会默认执行确认设置的逻辑
      this.showInitialButton = false
      this.$refs.setUpRef.confirm()
    },
  },
}
</script>
<style scoped>
.wrapper {
  /* align-items: center; */
  position: fixed;
  left: 0px;
  top: 0%;
  width: 100%;
  height: 100%;
}

div.root_container {
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

button.tip_button,
button.next_button {
  font-size: 24px;
  border: 1.5px solid rgba(163, 35, 35, 0.6);
  color: rgb(179, 111, 28);
  background-color: aliceblue;
  height: 50px;
  width: 100px;
  border-radius: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.flex_div {
  display: flex;
  justify-content: center;
  /* 内容整体居中 */
  align-items: center;
  /* 垂直居中 */
  gap: 20px;
  /* 两个元素之间的间隔 */
}

.setUpDiv {
  z-index: 9999;
  position: fixed;
  left: calc(100% - 255px);
  top: 2%;
  transition: all 0.2s;
}

.setUpDiv:hover {
  cursor: pointer;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.4s ease-out;
}

.fade-leave-active {
  transition: all 0.25s ease-out;
}

div.timeAndScore {
  position: fixed;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 10px;
  display: flex;
  width: 240px;
  height: 40px;
  left: calc(50% - 160px);
  top: 6%;
}

div.quickEnd {
  cursor: pointer;
  z-index: 9999;
  position: fixed;
  left: calc(100% - 135px);
  top: 2%;
  transition: all 0.2s;
}

div.flexGroup {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 65px;
}

label.score {
  transition: all 0.2s;
  font-size: 18px;
  font-weight: 600;
  color: rgb(28, 184, 101);
}
</style>
