<template>
  <div class="wrapper">
    <Transition name="fade">
      <div v-if="!gameOver" class="icop[pnarea">
        <label :class="{ icon_dark: darkMode, icon_light: !darkMode }">2048</label>
      </div>
    </Transition>
    <div class="game">
      <the-background>
        <core-game @add-score="addScore" @can-undo="setCanUndo" @game-over="getGameOver" ref="coreRef"></core-game>
      </the-background>
    </div>
    <div class="inf">
      <TheInformation ref="infRef" @undo-game="setUndo" @change-game-mode="setNewGame" @not-game-over="setNotGameOver">
      </TheInformation>
    </div>
    <game-over ref="gameOverRef"></game-over>
  </div>
</template>
<script>
import CoreGame from './CoreGame.vue'
import TheInformation from './TheInformation.vue';
import TheBackground from './TheBackground.vue';
import GameOver from './GameOver.vue';
import { computed } from 'vue'
export default {
  inject: ['darkMode'],
  components: {
    TheInformation,
    CoreGame,
    TheBackground,
    GameOver,
  },
  provide() {
    return {
      gameMode: computed(() => this.gameMode),
      interval: computed(() => this.interval),
      gameOver: computed(() => this.gameOver),
    }
  },
  data() {
    return {
      gameMode: 'custom', //custom or doubly or timer
      interval: 100,
      gameOver: false,
    }
  },
  methods: {
    addScore(score) {
      this.$refs.infRef.value = score;
      this.$refs.infRef.isAdd = !this.$refs.infRef.isAdd;
    },
    setNewGame(mode, interval) {
      this.gameMode = mode;
      this.interval = interval;
      this.gameOver = false;
      this.$refs.gameOverRef.gameOver = false;
      this.$refs.coreRef.isSetNewGame = true;
    },
    setUndo() { //告诉CoreGame子组件用户点击了撤销按钮,是否能撤销由子组件判断
      this.$refs.coreRef.undoGame();
    },
    setCanUndo(value) {
      this.$refs.infRef.canUndo = value;
      //custom模式 gameOver时undo
      //...
    },
    addDeleteTime() {
      this.$refs.infRef.deleteTime++;
    },
    getGameOver() {
      this.gameOver = true;
      setTimeout(() => {
        this.$refs.gameOverRef.gameOver = true;
      }, 1000);

    },
    setNotGameOver() {
      this.gameOver = false;
      this.$refs.gameOverRef.gameOver = false;
      this.$refs.coreRef.gameOver = false;
    }
  },
  created() {
    let gameMode = localStorage.getItem('gameMode');
    let interval = localStorage.getItem('interval');
    if (gameMode === null) {
      this.gameMode = 'custom';
    } else {
      this.gameMode = gameMode;
    }
    if (interval === null) {
      this.interval = 1000;
    } else {
      this.interval = parseInt(interval);
    }
  },
}
</script>

<style scoped>
.iconarea>label {
  font-weight: 700;
}

.wrapper {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 三列中:每一列width = 420px,其中game部分为 4*90 + 5*12 = 420px */

.iconarea {
  grid-area: icon;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 200ms opacity ease-out;
}

/* 这一项在TheBackground.vue也有相应适配 */
@media screen and (max-width: 800px) {
  .iconarea {
    opacity: 0;
  }
}

.icon_light,
.icon_dark {
  position: fixed;
  left: calc(25% - 170px);
  width: 130px;
  height: 130px;
  color: white;
  font-size: 40px;
  line-height: 130px;
  border-radius: 20px;
  font-family: Cascadia Code;
}

.icon_light {
  background: linear-gradient(-45deg, #00eeff 0%, #ff007b 100%);
  background-size: 400% 100%;
  color: #c9fbff;
  animation: gradient 7s infinite;
}

.icon_dark {
  background: linear-gradient(-45deg, #00ff91, #ff6302);
  background-size: 400% 100%;
  color: #bdfce2;
  animation: gradient 7s infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 30%;
    color: #ffc3ed;
  }

  33% {
    background-position: 100% 50%;
    color: #acffee;
  }

  66% {
    background-position: 50% 100%;
    color: #a0eaff;
  }

  100% {
    background-position: 0% 30%;
    color: #ffc3ed;
  }
}

.game {
  grid-area: game;
}

.inf {
  grid-area: inf;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 1.5s;
}
</style>