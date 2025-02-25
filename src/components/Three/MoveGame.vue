<template>
  <div class="wrapper">
    <div class="game">
      <the-background></the-background>
      <the-three @game-over="setGameOver" @trigger-show="clearNote" ref="coreRef"></the-three>

    </div>
    <div class="inf">
      <TheInformation ref="infRef" @new-game="setNewGame">
      </TheInformation>
    </div>
    <game-over ref="gameOverRef"></game-over>
  </div>
</template>
<script>
import TheThree from './TheThree.vue';
import TheInformation from './TheInformation.vue';
import TheBackground from './TheBackground.vue';
import GameOver from './GameOver.vue';
import { computed } from 'vue'
export default {
  inject: ['darkMode'],
  components: {
    TheInformation,
    TheThree,
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
      gameOver: false,
    }
  },
  methods: {
    setNewGame(mode) {
      this.gameMode = mode;
      this.gameOver = false;
      this.$refs.gameOverRef.gameOver = false;
      this.$refs.coreRef.isSetNewGame = true;
    },
    setGameOver() {
      this.gameOver = true;
      this.$refs.gameOverRef.gameOver = true;
    },
    clearNote() {
      this.$refs.gameOverRef.showNote = false;
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
.wrapper {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  display: flex;
}

/* 三列中:每一列width = 420px,其中game部分为 4*90 + 5*12 = 420px */

.game {
  grid-area: game;
}

.inf {
  z-index: 40;
  grid-area: inf;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>