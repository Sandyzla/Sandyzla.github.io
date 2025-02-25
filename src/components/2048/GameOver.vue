<template>
  <Transition name="fade">

    <div v-if="gameOver" class="over_wrapper">
    </div>
  </Transition>
  <Transition name="slide">
    <h1 v-if="gameOver" :class="{ h1_dark: darkMode }">Game Over !</h1>
  </Transition>
</template>

<script>
export default {
  inject: ['darkMode'],
  data() {
    return {
      gameOver: false,
    }
  },
}
</script>

<style scoped>
h1 {
  position: fixed;
  top: 10px;
  z-index: 99999;
  font-family: Impact;
  font-family: Tahoma;
  letter-spacing: 3px;
  color: rgb(72, 72, 72);
}

.h1_dark {
  color: aliceblue;
}

.over_wrapper {
  position: fixed;
  left: calc(50% - 210px);
  top: calc(50% - 210px);
  width: 420px;
  height: 420px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.509);
}

@media screen and (max-width: 1100px) {
  h1 {
    top: calc(50% - 19.3px);
  }
}

.fade-enter-from {
  opacity: 0;
  width: 0px;
  height: 0px;
  transform: rotate(90deg);
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-to {
  width: 420px;
  height: 420px;
  opacity: 1;
  transform: rotate(0deg);
}

.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-avtive {
  transition: all 800ms ease-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-400px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.slide-enter-active {
  transition: all 800ms ease-out;
}

.slide-leave-active {
  transition: all 400ms ease-in;
}
</style>