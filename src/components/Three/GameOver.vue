<template>
  <Transition name="fade">
    <div class="container" v-if="showNote">
      <div class="gameOverTip">Can't Move! Click Anywhere To Check </div>
    </div>
  </Transition>
</template>

<script>
export default {
  inject: ['darkMode'],
  data() {
    return {
      gameOver: false,
      showNote: false,
    }
  },
  watch: {
    gameOver(value) {
      if (value == true) {
        this.showNote = true;
        // this.disappear();
        // setTimeout(() => {
        //   this.note2 = true;
        // }, 2001)
        // setTimeout(() => {
        //   this.note2 = false;
        // }, 4000)
      } else {
        this.showNote = false;
      }
    }
  },
  methods: {
    disappear() {
      setTimeout(() => {
        this.note1 = false;
      }, 2000)
    }
  }
}
</script>

<style scoped>
.gameOverTip {
  font-family: Cascadia Code, Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 32px;
  color: rgb(255, 255, 255);
  line-height: 60px;
}

.container {
  position: fixed;
  z-index: 200;
  left: 24%;
  top: 45%;
  width: 53%;
  height: 60px;
  padding: 10px 0px;
  border-radius: 20px;
  background-color: rgba(41, 41, 41, 0.285);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-50px);
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-from {
  opacity: 1;
  transform: translateY(0px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.fade-enter-active,
.fade-leave-avtive {
  transition: all 600ms ease;
}
</style>