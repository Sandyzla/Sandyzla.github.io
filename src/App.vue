<template>
  <TheBalls></TheBalls>
  <router-view v-slot="{ Component }">
    <transition name="page">
      <component :is="Component" />
    </transition>
  </router-view>

  <div :class="{ darkBox_light: !darkMode, darkBox_dark: darkMode }" @click="toggleMode">
    <div :class="{ radio_left: !darkMode, radio_right: darkMode }">
      <TransitionGroup name="toggle">
        <img v-if="darkMode" class="app_dark_mode" src="./assets/app/dark_mode.png" alt="moon">
        <img v-if="!darkMode" class="app_light_mode" src="./assets/app/light_mode.png" alt="sun">
      </TransitionGroup>
    </div>
  </div>
  <div class="homeDiv" @click="toHome">
    <img style="width: 40px;" v-if="darkMode" src="./assets/app/home_dark.svg" />
    <img style="width: 40px;" v-if="!darkMode" src="./assets/app/home_light.svg" />
  </div>
</template>

<script>
import TheBalls from './components/background/TheBalls.vue';
import { computed } from 'vue'
export default {
  name: 'App',
  components: {
    TheBalls
  },
  provide() {
    return {
      darkMode: computed(() => this.darkMode),
    }
  },
  data() {
    return {
      darkMode: true,
    }
  },
  methods: {
    toggleMode() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
    },
    toHome() {
      this.$router.push('/');
    }
  },
  created() {
    let darkMode = localStorage.getItem('darkMode');
    if (darkMode === null) {
      this.darkMode = false;
    } else {
      this.darkMode = (darkMode === 'true') ? true : false;
    }
  },
}
</script>

<style>
div,
label,
h1 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  user-select: none;
  text-align: center;
}

#app {
  overflow: hidden;
  color: #425c76;
  margin: 0px;
}

body {
  margin: 0px;
}

img {
  width: 23px;
}

/* 整个颜色模式容器 */

.homeDiv {
  z-index: 9999;
  position: fixed;
  left: 8px;
  top: 2%;
  transition: all 0.2s;
}

.homeDiv:hover {
  cursor: pointer;
}

.darkBox_light,
.darkBox_dark {
  z-index: 9999;
  position: fixed;
  left: calc(100% - 70px);
  top: calc(2% + 8px);
  height: 25px;
  border-radius: 20%/50%;
  width: 52px;
  padding: 0px 3px 0px 3px;
  background-color: #f0d2e0;
  cursor: pointer;
  border: none;
}

.darkBox_light {
  outline: solid 2px rgb(187, 187, 187);
}

.darkBox_dark {
  outline: solid 2px rgb(75, 75, 75);
}

.darkBox_light:hover,
.darkBox_dark:hover {
  transition: 100ms outline;
}

.darkBox_light:hover {
  outline: solid 2px #383737;
}

.darkBox_dark:hover {
  outline: solid 2px #ccc;
}

/* 其余部分的填充颜色 */
.darkBox_light {
  background-color: rgb(208, 207, 207);
}

.darkBox_dark {
  background-color: #313030;
}

.toggle-enter-from {
  opacity: 0;
}

.toggle-enter-active {
  transition: opacity 500ms;
}

.toggle-enter-to {
  opacity: 1;
}

.radio_left,
.radio_right {
  z-index: 10000;
  position: fixed;

  top: calc(2.1% + 8px);
  height: 25px;
  border-radius: 20%/50%;
  width: 60px;

  width: 24px;
  height: 24px;
  border-radius: 50% / 50%;
}

/* 圆形填充 */
.radio_left {
  left: calc(100% - 70px);
  transition: left 500ms;
  background-color: #fffcfc;
}

.radio_right {
  left: calc(100% - 37px);
  transition: left 500ms;
  background-color: #585858;
}

.page-enter-from {
  transform: translate3d(100px, 50px, 50px);
  opacity: 0.3;
}

.page-leave-to {
  opacity: 0;
}

.page-enter-active {
  transition: transform 0.8s cubic-bezier(0, .75, .34, .99), opacity 1s;
}

.page-leave-active {
  transition: opacity 0.5s;
  ;
}
</style>
