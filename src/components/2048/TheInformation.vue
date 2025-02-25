<template>
  <div>
    <div class="show_grid">
      <div class="score">
        <label class="inFont">SCORE</label>
        <label class="inNum">
          {{ showScore.toFixed(0) }}</label>
      </div>
      <div class="best">
        <label class="inFont">BEST</label>
        <label class="inNum">
          {{ best.toFixed(0) }}</label>
      </div>
      <div class="delete">
        <label class="inFont">DELETE</label>
        <label class="inNum">
          {{ deleteTime }}</label>
      </div>
    </div>
    <div class="control_grid">
      <game-mode @set-mode="setGameMode"></game-mode>
      <label @click="undoOnce" :class="{ gameButton: canUndo, lockUndo: !canUndo }" style="grid-area:undo;">UNDO</label>
    </div>

    <audio :src="recordMusicSrc" hidden preload="auto" ref="recordMus"></audio>
    <Transition name="fade">
      <div v-if="showRecord" class="successLayer">
        <img class="succeddImg" src="../../assets/2048/medal.png" />
      </div>
    </Transition>
    <TransitionGroup name="quickShow">
      <div v-for="qs in showQuickScore" :key="qs.id"
        :class="{ quickScoreLayer_dark: darkMode, quickScoreLayer_light: !darkMode }">
        {{ qs.score }}
      </div>
    </TransitionGroup>
    <game-modeUI></game-modeUI>
  </div>
</template>

<script>
import gsap from 'gsap';
import GameMode from './GameMode.vue';
import GameModeUI from './GameModeUI.vue';
export default {
  emits: ['newGame', 'undoGame', 'changeGameMode', 'notGameOver'],
  inject: ['darkMode', 'gameMode'],
  components: {
    GameMode,
    GameModeUI,
  },
  data() {
    return {

      showScore: 0, //当前总分数
      value: 0, //接收加分参数
      best: 0, //历史最佳
      showRecord: false,

      hasShowed: false,
      recordMusicSrc: require("../../assets/2048/record.mp3"),
      canUndo: false,

      isAdd: false, //触发watch
      reachScore: 0, //真实分数
      showQuickScore: [], //即时加分数
      QSID: 0,
      deleteTime: 0,
    }
  },
  methods: {
    setNewGame() {
      this.showScore = 0;
      this.reachScore = 0;
      this.hasShowed = false;
      this.undoTime = 0;
      this.toQS = 0;
      this.deleteTime = 0;
      this.showQuickScore = [];
      this.canUndo = false;
      this.$emit('newGame');
    },
    undoOnce() {
      if (this.canUndo) {
        if (this.gameMode === 'custom') {
          this.$emit('notGameOver');
        }
        this.$emit('undoGame');
        this.canUndo = false;
      }

    },
    setGameMode(mode, interval) {
      this.setNewGame();
      this.$emit('changeGameMode', mode, interval);
    },
  },
  watch: {
    isAdd() {
      this.QSID++;
      let addScore = this.value;
      let tmp = { score: addScore, id: this.QSID };
      this.showQuickScore.push(tmp);
      this.reachScore += addScore;
      setTimeout(() => {
        let index = this.showQuickScore.indexOf(tmp);
        this.showQuickScore.splice(index, 1);
      }, 500);

      gsap.to(this, { duration: 0.5, showScore: Number(this.reachScore) });
      if (this.reachScore > this.best) {
        gsap.to(this, { duration: 0.5, best: Number(this.reachScore) });
        localStorage.setItem('best', this.reachScore);
        if (!this.hasShowed) {
          this.showRecord = true;
          this.hasShowed = true;
          this.$refs.recordMus.currentTime = 0;//从头开始播放
          this.$refs.recordMus.play(); //播放
          setTimeout(() => {
            this.showRecord = false;
          }, 2000)
        }
      }
    },
  },
  created() {
    let bestScore = localStorage.getItem('best');
    if (bestScore === null) {
      this.best = 0;
    } else {
      this.best = parseInt(bestScore);
    }
  },
  // mounted() {
  //   localStorage.setItem('best', 0);
  // }
}
</script>
<style scoped>
div {
  text-align: center;
  font-size: 19px;
  font-weight: 800;
}

label {
  display: block;
}

.show_grid,
.control_grid {
  position: fixed;
  display: grid;
  row-gap: 12px;
  column-gap: 12px;
  margin-bottom: 12px;
  justify-content: center;
  transition: 200ms left ease-out, 200ms top ease-out;
}

.show_grid {
  left: calc(75% - 57px);
  top: calc(50% - 66px);
  grid-template: "score best delete" 60px/100px 100px 100px;
}

.control_grid {
  left: calc(75% - 1px);
  top: calc(50% + 6px);
  grid-template: "new undo" 62px/100px 100px;
  /* 设置成62px而不是50px 是因为要给gameMode添加间隙 */
}

.quickScoreLayer_dark,
.quickScoreLayer_light {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: calc(75% - 14px);
  top: 33.5%;
  font-size: 24px;
}

/* 该项在TheBackground.vue也有修改 */
@media screen and (max-width: 1100px) {
  .show_grid {
    position: fixed;
    left: calc(50% - 162px);
    top: 2%;
  }

  .control_grid {
    position: fixed;
    left: calc(50% - 106px);
    top: 89%;
  }

  .quickScoreLayer_dark,
  .quickScoreLayer_light {
    left: calc(50% - 121px);
    top: 0%;
  }
}

@media screen and (max-width: 800px) {
  .control_grid {
    position: fixed;
    left: calc(50% - 162px);
    top: 89%;
  }
}

.score,
.best,
.delete {
  background-color: #53a8b6;
  border-radius: 5px;
}

.score {
  grid-area: score;
}

.best {
  grid-area: best;
}

.delete {
  grid-area: delete;
}

.inFont {
  font-size: 14px;
  color: #ede0c8;
  line-height: 40px;
}

.inNum {
  font-size: 20px;
  color: white;
  line-height: 5px;
}

.gameButton,
.lockUndo {
  border-radius: 5px;
  line-height: 50px;
  height: 50px;
  display: inline-block;
  color: white;
  position: relative;
  overflow: hidden;
}

.gameButton {
  background-color: rgb(251, 88, 88);
  /* -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0); */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
}

.gameButton:before {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 100%;
  -webkit-transform: scale(0);
  transform: scale(0);
  background: linear-gradient(90deg, rgba(250, 156, 112, 0.7737219887955182) 0%, rgba(99, 176, 250, 0.8661589635854342) 91%);
  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  -webkit-transition-timing-function: ease-out;
  transition-timing-function: ease-out;
}

.gameButton:hover,
.gameButton:active {
  scale: 1.18;
  cursor: pointer;
}

.gameButton:hover:before,
.gameButton:active:before {
  -webkit-transform: scale(2);
  transform: scale(2);
}

.lockUndo {
  background-color: rgb(251, 207, 207);
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  -webkit-transition-duration: 0.2s;
  transition-duration: 0.2s;
}

.successLayer {
  z-index: 888;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 45%;
  top: 40%;
  width: 10%;
  height: 20%;
}

.succeddImg {
  width: 120px;
}



.quickScoreLayer_dark {
  color: white;
}

.quickScoreLayer_light {
  color: black;
}

.quickShow-enter-active {
  transition: all 0.5s ease-in-out;
}

.quickShow-leave-active {
  transition: all 0.7s cubic-bezier(.82, .13, .77, .62);
  /* transition: opacity 0.3s ease-in-out; */

}

.quickShow-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.quickShow-enter-from {
  opacity: 0;
  transform: translateY(-60px);
}

.fade-leave-to,
.fade-enter-from {
  opacity: 0;
  transform: translateX(100px);
}


.fade-leave-from,
.fade-enter-to {
  opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
  transition: all 0.6s ease-in-out;
}
</style>