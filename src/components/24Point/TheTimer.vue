<template>
  <div>
    <div class="progressContainer">
      <div :class="{
        progress: timer > 400,
        progressWarn: timer > 100 && timer <= 400,
        progressDanger: timer <= 100,
      }" :style="`width: ${(timer * 100) / maxTimer}%;`"></div>
    </div>
    <div class="flexGroup">
      <img v-if="timer > 400" style="width: 32px" src="../../assets/24Point/timerFine.png" />
      <img v-if="timer <= 400 && timer > 100" style="width: 32px" src="../../assets/24Point/timerWarn.png" />
      <img v-if="timer <= 100" style="width: 32px" src="../../assets/24Point/timerDanger.png" />
      <label :class="{ WarnTimer: timer <= 400 && timer > 100, DangerTimer: timer <= 100 }">{{
        formatTime(timer)
      }}</label>
    </div>
    <Transition name="fade">
      <div v-if="showChange && changeStatus" class="showAdd">+{{ changeSecond.toFixed(0) }}s</div>
    </Transition>
    <Transition name="fade">
      <div v-if="showChange && !changeStatus" class="showDecrease">
        -{{ changeSecond.toFixed(0) }}s
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showChangeScore" class="showAward">+{{ awardRate }}s</div>
    </Transition>
    <svg width="60" height="60" viewBox="0 0 60 60" class="awardRing">
      <circle cx="30" cy="30" r="24" fill="none" stroke="#FFFFFF" stroke-width="8"></circle>
      <circle id="progressRing" cx="30" cy="30" r="24" fill="none" stroke="#FFE5B8" stroke-width="8"
        :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"></circle>
      <circle cx="30" cy="30" r="20" fill="none" stroke="#A3232399" stroke-width="1"></circle>
      <circle cx="30" cy="30" r="28" fill="none" stroke="#A3232399" stroke-width="1"></circle>
      <circle id="progressMarker" :cx="markerPosition.x" :cy="markerPosition.y" r="2" fill="#808080"></circle>
      <!-- 进度标记 -->
      <text id="multiplierText" x="30" y="37" font-size="20" text-anchor="middle" font-weight="bold" fill="#A3232399">
        ×{{ awardRate }}
      </text>
    </svg>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  emit: ['timeout'],
  data() {
    return {
      initialSecond: 60, //初始秒数[SetUp.vue中有重复定义]
      maxTimer: 600, //指示进度条满格时的timer,值设为中途的最大值
      addSecond: 0,
      timer: 0, //单位:十分秒
      awardTimer: 0, //用于连击的奖励机制
      awardInitialSecond: 18,
      awardRate: 0,
      punishBase: 0, //惩罚力度,错误越多则惩罚力度越大
      intervalId: null, //剩余时间的id
      intervalAwardId: null, //连击奖励时间id
      showChange: false, //显示时间变化量
      changeSecond: 0,
      changeStatus: true, //true:增加, false:减少
      changeScore: 0,
      showChangeScore: false,
    }
  },
  computed: {
    dashArray() {
      const circumference = 2 * Math.PI * 24
      return `${circumference} ${circumference}`
    },
    dashOffset() {
      const circumference = 2 * Math.PI * 24
      return circumference * (1 - this.awardTimer / this.awardInitialSecond / 10)
    },
    markerPosition() {
      const angle = 2 * Math.PI * (this.awardTimer / this.awardInitialSecond / 10)
      const x = 30 + 24 * Math.cos(angle)
      const y = 30 + 24 * Math.sin(angle)
      return { x, y }
    },
  },

  methods: {
    // 由MathGame组件调用
    setTimer(initialTotalSecond, awardTotalSecond) {
      this.stopTimer();
      this.initialSecond = initialTotalSecond
      this.addSecond = awardTotalSecond

    },
    stopTimer() {
      clearInterval(this.intervalId)
      clearInterval(this.intervalAwardId)
    },
    pauseTimer() {
      this.stopTimer()
    },
    continueTimer() {
      clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
        if (this.timer <= 0) {
          this.$emit('timeout')
          clearInterval(this.intervalId)
          return
        }
        this.timer -= 0.5
      }, 50)

      clearInterval(this.intervalAwardId)
      this.intervalAwardId = setInterval(() => {
        // this.updateRing(this.awardTimer / this.awardInitialSecond * 10);
        this.awardTimer -= 0.5
        if (this.awardTimer <= 0 || this.timer <= 0) {
          this.awardRate = 0
          clearInterval(this.intervalAwardId)
        }
      }, 50)
    },
    handleAns(status, checkAnsTime) {
      if (status == 1) { //成功解题或选择正确(解题模式只可能正确，因此无需判错)
        this.addAwardTimer()
        this.pauseTimer()
        setTimeout(() => {
          this.addTimer();
        }, checkAnsTime)
      } else if (status == -1) { //选择错误
        this.pauseTimer()
        setTimeout(() => {
          this.decreseTimer()
        }, checkAnsTime)
      }
    },
    addAwardTimer() {
      //该方法一旦验证正确就执行
      gsap.to(this.$data, {
        duration: 0.3,
        awardTimer: this.awardInitialSecond * 10,
        onUpdate: () => {
          this.awardTimer = Math.ceil(this.awardTimer)
        },
      })
      this.awardRate++
      // if (this.awardTimer > 1) {
      //   gsap.to(this.$data, {
      //     duration: 0.4,
      //     timer: '+= ' + this.awardRate * 10,
      //     onUpdate: () => {
      //       this.timer = Math.ceil(this.timer)
      //     },
      //   })
      // }

      this.pauseAwardTimer = true
      if (this.awardTimer > 0) {
        this.showChangeScore = true
        setTimeout(() => {
          this.showChangeScore = false
        }, 2200)
      }
    },
    addTimer() {
      //该方法在验证以后延时执行
      this.changeSecond = Math.max(this.addSecond, this.addSecond / 3)
      let finalChangeSecond = this.changeSecond * 10 + this.awardRate * 10;
      // this.maxTimer = Math.max(this.maxTimer, this.timer + finalChangeSecond)

      gsap.to(this.$data, {
        duration: 0.4,
        maxTimer: Math.max(this.maxTimer, this.timer + finalChangeSecond),
        onUpdate: () => {
          this.maxTimer = Math.ceil(this.maxTimer)
        },
      })

      this.changeStatus = true
      this.showChange = true
      setTimeout(() => {
        this.showChange = false
      }, 1500)

      gsap.to(this.$data, {
        duration: 0.4,
        timer: '+= ' + finalChangeSecond,
        onUpdate: () => {
          this.timer = Math.ceil(this.timer)
        },
      })
    },
    decreseTimer() {
      let punishNum = 14 + 2 * this.punishBase + Math.random() * (4 + this.punishBase)
      this.punishBase++
      this.changeSecond = (this.addSecond * punishNum) / 10
      this.changeStatus = false
      this.showChange = true
      setTimeout(() => {
        this.showChange = false
      }, 1500)

      gsap.to(this.$data, {
        duration: 0.4,
        timer: '-= ' + this.addSecond * punishNum,
        onUpdate: () => {
          if (this.timer < 0) this.timer = 0
          else this.timer = Math.ceil(this.timer)
        },
      })

      gsap.to(this.$data, {
        duration: 0.3,
        awardRate: 0,
        onUpdate: () => {
          this.awardRate = Math.ceil(this.awardRate)
        },
      })

      gsap.to(this.$data, {
        duration: 0.3,
        awardTimer: 0,
        onUpdate: () => {
          this.awardTimertimer = Math.ceil(this.awardTimertimer)
        },
      })
    },
    newTimer() {
      clearInterval(this.intervalId)
      this.punishBase = 0
      this.maxTimer = this.initialSecond * 10
      gsap.to(this.$data, {
        duration: 0.4,
        timer: this.initialSecond * 10,
        onUpdate: () => {
          this.timer = Math.ceil(this.timer)
        },
      })
      this.intervalId = setInterval(() => {
        if (this.timer <= 0) {
          this.$emit('timeout')
          clearInterval(this.intervalId)
          return
        }
        this.timer -= 0.5
      }, 50)
      this.awardRate = 0
      this.awardTimer = 0
      this.intervalAwardId = setInterval(() => {
        // this.updateRing(this.awardTimer / this.awardInitialSecond * 10);
        this.awardTimer -= 0.5
        if (this.awardTimer <= 0 || this.timer <= 0) {
          this.awardRate = 0
          clearInterval(this.intervalAwardId)
        }
      }, 50)
    },
    setAllTimerZero() {
      gsap.to(this.$data, {
        duration: 0.4,
        timer: 0,
        onUpdate: () => {
          this.timer = Math.ceil(this.timer)
        },
      })
      clearInterval(this.intervalAwardId)
    },
    formatTime(timer) {
      // 将时间格式化为 hh:mm:ss 的形式
      let minute = Math.floor(timer / 600)
      let second = Math.floor(timer / 10 - minute * 60)
      let millisec = Math.floor(timer - minute * 600 - second * 10)
      if (timer <= 100) {
        return `${second.toString().padStart(2, '0')}"${millisec.toString().padStart(1, '0')}`
      } else {
        return `${minute.toString()}'${second.toString().padStart(2, '0')}"`
      }
    },
  },
}
</script>

<style scoped>
label {
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
  color: rgb(82, 179, 96);
}

div.flexGroup {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 90px;
}

.WarnTimer {
  color: rgb(216, 216, 94);
}

.DangerTimer {
  color: rgb(250, 38, 56);
}

.progressDanger,
.progressWarn,
.progress {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: rgb(0, 193, 48);
  border-bottom: 0.2px dotted rgba(121, 121, 121, 0.486);
}

.progressWarn {
  background-color: rgb(239, 200, 27);
}

.progressDanger {
  background-color: rgb(250, 79, 79);
}

.progressContainer {
  position: fixed;
  top: 0%;
  height: 0.7%;
  width: 100%;
  left: 0%;
  background-color: rgb(247, 255, 253);
}

div.showAdd,
div.showDecrease,
div.showAward {
  position: fixed;
  left: calc(50% - 15px);
  font-weight: 600;
  top: 4%;
  font-size: 21px;
  color: rgb(82, 179, 96);
}

div.showDecrease {
  color: rgb(250, 79, 79);
}

div.showAward {
  top: 2%;
  color: rgb(219, 175, 18);
}

.awardRing {
  position: fixed;
  left: calc(50% + 80px);
  font-weight: 600;
  top: 4%;
  font-size: 21px;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(40px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

.fade-enter-active {
  transition: all 0.25s ease;
}

.fade-leave-active {
  transition: all 0.4s ease;
}
</style>
