<template>
  <div :class="{ back_container_dark: darkMode, back_container_light: !darkMode }">
    <div v-for="i of 16" :key="i" :class="{ darkcell: darkMode, lightcell: !darkMode }"></div>
  </div>
</template>

<script>
export default {
  inject: ['darkMode'],
}
</script>

<style scoped>
.back_container_dark,
.back_container_light {
  z-index: 0;
  position: fixed;
  left: calc(50% - 170px);
  top: calc(50% - 230px);
  display: grid;
  grid-template-rows: repeat(4, 100px);
  grid-template-columns: repeat(4, 70px);
  border-radius: 8px;
  grid-row-gap: 12px;
  grid-column-gap: 12px;
  padding: 12px;

}

.back_container_light {
  /* background-color: #d2e0d2; */
  background-color: rgb(168, 168, 168);
  /* background-color: rgba(189, 189, 189); */

}

.back_container_dark {
  /* background-color: #393939; */
  background-color: rgba(100, 100, 100, 0.285);
}

.lightcell,
.darkcell {
  width: 70px;
  height: 100px;
  border-radius: 6px;
}

.lightcell {
  /* transition: background-color 500ms; */
  background-color: rgba(255, 255, 255, 0.288);
}

.darkcell {
  /* transition: background-color 500ms; */
  background-color: rgba(70, 70, 70);
}
</style>