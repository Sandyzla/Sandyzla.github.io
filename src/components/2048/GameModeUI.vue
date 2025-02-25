<template>
  <div v-if="gameMode === 'custom' || gameMode === 'doubly'" class="baseInf">
    <!-- <label v-if="gameMode === 'timer'" :class="{ label_dark: darkMode }">mode: {{ gameMode }} {{ interval + 'ms'
      }}</label> -->
    <div class="img_round">
      <img v-if="gameMode === 'custom'" src="../../assets/2048/custom.png" alt="custom">
      <img v-if="gameMode === 'doubly'" src="../../assets/2048/double.png" alt="doubly">
    </div>
  </div>
  <div v-if="gameMode === 'timer'" :class="{ timerInf: !darkMode, timerInf_dark: darkMode }">
    <!-- <label v-if="gameMode === 'timer'" :class="{ label_dark: darkMode }">mode: {{ gameMode }} {{ interval + 'ms'
      }}</label> -->
    <div class="img_round">
      <img src="../../assets/2048/clock.png" alt="timer">
    </div>
    {{ interval * 100 }} ms
  </div>
</template>
<script>
export default {
  inject: ['darkMode', 'gameMode', 'interval'],

}
</script>

<style scoped>
.img_round {
  background-color: rgb(143, 255, 218);
  width: 45px;
  height: 45px;
  border-radius: 50%/50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  width: 40px;
}

.baseInf,
.timerInf,
.timerInf_dark {
  position: fixed;
  /* top与max-width=800px时适配 */
  top: 88%;
  height: 50px;
  transition: all 200ms;
}

.baseInf {
  text-align: center;
  left: calc(50% - 22.5px);
  justify-content: center;
}

.timerInf,
.timerInf_dark {
  left: calc(50% - 70px);
  width: 140px;
  font-size: 20px;
  font-weight: 700;
  font-family: Impact;
  font-family: Tahoma;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgb(2, 52, 79);
  /* background-color: #53a8b6;
  border-radius: 5px; */
}

.timerInf_dark {
  color: rgb(230, 246, 255);
}


/* 在TheInformation.vue也有适配 */
@media screen and (max-width: 1100px) {

  .baseInf,
  .timerInf,
  .timerInf_dark {
    top: calc(50% - 25px);
    left: calc(75% + 40px);
    height: 50px;
    transition: all 200ms;
  }

  .baseInf {
    left: calc(75% + 85px);
  }
}

/* 在MoveGame.vue, TheInf中也有适配 */
@media screen and (max-width: 800px) {

  .baseInf,
  .timerInf,
  .timerInf_dark {
    top: 89%;
    left: calc(50% + 62px);
    height: 50px;
    transition: all 200ms;
  }
}
</style>