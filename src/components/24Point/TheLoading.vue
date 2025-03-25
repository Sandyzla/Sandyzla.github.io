<template>
  <div class="wrapper">
    <div v-if="!isLimitTip" class="container">
      <div class="inf">find {{ tipCount }} solutions</div>
      <progress :max="allCount" :value="verifyCount"></progress>
    </div>
    <div v-if="isLimitTip" class="container">
      <div>find {{ tipCount }}/{{ tipNum }} solutions</div>
      <progress :max="tipNum" :value="tipCount"></progress>
    </div>
  </div>
</template>

<script>
export default {
  computed: {},
  data() {
    return {
      tipCount: 0, //正确解的数量
      verifyCount: 0, //尝试验算的数量
      allCount: 0, //最多验算数量
      size: 4,
      nums: [],
      isLimitTip: false,
      tipNum: -1,
    }
  },
  methods: {
    getAll() {
      this.allCount =
        this.countPermutations(this.nums) * this.catalan(this.size) * Math.pow(4, this.size - 1)
    },
    factorial(n) {
      let result = 1
      for (let i = 1; i <= n; i++) {
        result *= i
      }
      return result
    },
    catalan(n) {
      return this.factorial(2 * n - 2) / this.factorial(n) / this.factorial(n - 1)
    },
    countPermutations(nums) {
      let counts = {}
      for (let num of nums) {
        if (counts[num]) {
          counts[num]++
        } else {
          counts[num] = 1
        }
      }
      let result = this.factorial(nums.length)
      for (let count of Object.values(counts)) {
        result /= this.factorial(count)
      }
      return result
    },
  },
}
</script>
<style scoped>
div.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  align-items: center;
}

div.container {
  flex-direction: column;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: inherit;
  width: 460px;
  height: 100px;
  border-radius: 12px;
  color: rgb(179, 111, 28);
  font-size: 22px;
  background-color: aliceblue;
  border: 2px solid rgba(197, 60, 60, 0.6);
  transition: all 0.5s;
}
</style>
