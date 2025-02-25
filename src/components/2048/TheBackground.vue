<template>
  <div class=back_wrapper>
    <div :class="{ back_container_dark: darkMode, back_container_light: !darkMode }">

      <div v-for="i of 16" :key="i" :class="{ darkcell: darkMode, lightcell: !darkMode }"></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  inject: ['darkMode'],
  // created() {
  //   console.log("in Background local: " + localStorage.getItem('darkMode'));
  //   console.log("in Background get: " + this.darkMode);
  // }
}
</script>

<style scoped>
.back_wrapper {
  position: fixed;
  left: calc(50% - 210px);
  top: calc(50% - 210px);
}

.back_container_dark,
.back_container_light {
  z-index: 2;
  display: grid;
  grid-template-rows: repeat(4, 90px);
  grid-template-columns: repeat(4, 90px);
  border-radius: 5px;
  grid-row-gap: 12px;
  grid-column-gap: 12px;
  padding: 12px;

}

.back_container_light {
  background-color: #a28c97b5;
}

.back_container_dark {
  background-color: #393939b5;
}

.lightcell,
.darkcell {
  width: 90px;
  height: 90px;
  border-radius: 5px;
}

.lightcell {
  transition: background-color 500ms;
  background-color: rgba(201, 204, 205, 0.737);
}

.darkcell {
  transition: background-color 500ms;
  background-color: rgba(71, 71, 71, 0.737);
}
</style>