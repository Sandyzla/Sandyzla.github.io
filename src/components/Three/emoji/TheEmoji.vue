<template>
  <div>
    <!-- <img v-if="num == 3" src="@/svg/Three/3.svg" alt="3" /> -->
    <TheNum3 v-if="num == 3"></TheNum3>
    <TheNum6 v-if="num == 6"></TheNum6>
    <TheNum12 v-if="num == 12"></TheNum12>
    <TheNum24 v-if="num == 24"></TheNum24>
    <TheNum48 v-if="num == 48"></TheNum48>
  </div>
</template>

<script>
import TheNum3 from './TheNum3.vue';
import TheNum6 from './TheNum6.vue';
import TheNum12 from './TheNum12.vue';
import TheNum24 from './TheNum24.vue';
import TheNum48 from './TheNum48.vue';
export default {
  props: ['initialNum'],
  components: {
    TheNum3,
    TheNum6,
    TheNum12,
    TheNum24,
    TheNum48,
  },
  data() {
    return {
      num: this.initialNum,
    }
  }
}
</script>

<style scoped>
img {
  width: 70px;
}
</style>