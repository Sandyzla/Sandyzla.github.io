<template>
  <div class="hot_area" @mouseleave="toggleGameMode(false)">
    <div @click="setNewGame" @mouseover="toggleGameMode(true)" class="but">NEW</div>

    <Transition name="slide">
      <ul :class="{ ul_dark: darkMode }" v-if="showGameMode">

        <li :class="{ li_dark: darkMode }" @click="setGameMode('custom')">Custom
          <div class="img_round">
            <img src="../../assets/2048/custom.png" alt="custom">
          </div>
        </li>
        <li :class="{ li_dark: darkMode }" @click="setGameMode('doubly')">Doubly
          <div class="img_round">
            <img src="../../assets/2048/double.png" alt="double">
          </div>
        </li>
        <li :class="{ li_dark: darkMode }" @click="setGameMode('timer')">
          <div class="flex_div">
            Timer
            <div class="img_round">
              <img src="../../assets/2048/clock.png" alt="timer">
            </div>
          </div>
          <div class="flex_div">
            <label for="time" :class="{ label_dark: darkMode }">{{ interval * 100 }}ms</label>
            <input id="time" type="range" v-model="interval" @click.stop min="1" max="20">
          </div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script>
export default {
  inject: ['darkMode'],
  emits: ['setMode'],
  data() {
    return {
      showGameMode: false,
      interval: 10,
    }
  },
  methods: {
    setGameMode(mode) {
      this.showGameMode = false;
      localStorage.setItem('interval', this.interval);
      localStorage.setItem('gameMode', mode);
      this.$emit('setMode', mode, this.interval);
    },
    toggleGameMode(bool) {
      this.showGameMode = bool;
    }
  },
  created() {
    let interval = localStorage.getItem('interval');
    if (interval === null) {
      this.interval = 10; //即1000
    } else {
      this.interval = parseInt(interval);
    }
  },
}
</script>

<style scoped>
img {
  width: 30px;
}

label {
  font-size: 13px;
  /* font-weight: 700; */
  /* background-color: #dedcdc; */
  color: rgb(63, 63, 63);
}

.label_dark {
  /* background-color: #3e3e3e; */
  color: rgb(193, 193, 193);
}

.hot_area {
  padding-bottom: 12px;
}

.but {
  border-radius: 5px;
  color: white;
  line-height: 50px;
  display: inline-block;
  background-color: rgb(251, 88, 88);
  /* -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0); */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  width: 100%;
  position: relative;
  overflow: hidden;
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  cursor: pointer;
}

.but:hover {
  background-color: rgb(255, 133, 133);
  transition: background-color 200ms;
}

ul {
  /* background-color: aqua; */
  position: fixed;
  /* left: calc(75% - 1px); */
  top: calc(50% + 68px);
  border-radius: 12px;
  border: 1px solid rgb(207, 207, 207);
  width: 250px;
  margin: 0px;
  padding: 0px;
  overflow: visible;
  color: #425c76;
  background-color: rgba(253, 234, 234, 0.815);
}

.ul_dark {
  color: white;
  background-color: rgb(45, 45, 45);
  border: 1px solid rgb(84, 84, 84);
}

.img_round {
  background-color: rgb(143, 255, 218);
  width: 35px;
  height: 35px;
  border-radius: 50%/50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex_div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50%;
}

.block_div {
  display: block;
}

ul>li {
  /* border-top: 1px solid #ccc; */
  display: flex;
  padding: 10px 20px 10px 20px;
  list-style: none;
  justify-content: space-between;
  align-items: center;
  transition: 100ms background-color ease-in;
  border-bottom: 1px solid rgb(207, 207, 207);
}

ul>li:first-child {
  border-radius: 12px 12px 0px 0px;
}

/* .border_light {
  outline: solid 1.5px #ccc;
}

.border_dark {
  outline: solid 1.5px rgb(75, 75, 75);
} */

/* timer */
ul>li:nth-child(3) {
  display: block;
  height: 80px;
}

ul>li:last-child {
  border-radius: 0px 0px 12px 12px;
  /* border: none; */
}

li:hover {
  cursor: pointer;
  background-color: #c8e6eb;
}

ul>.li_dark {
  border-bottom: 1px solid rgb(84, 84, 84);
}

.li_dark:hover {
  background-color: rgb(130, 117, 117);
}


.slide-enter-from,
.slide-leave-to {
  /* opacity: 1; */
  height: 0px;
  overflow: hidden;
}

.slide-enter-to,
.slide-leave-from {
  /* 这个目前是写死的 */
  height: 213.33px;
  overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 300ms ease-in-out;
}
</style>