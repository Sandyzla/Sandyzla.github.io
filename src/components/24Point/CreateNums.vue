<template>
  <!-- 加载进度 -->
  <Transition name="fade">
    <TheLoading ref="loadRef" v-show="showLoading"></TheLoading>
  </Transition>
</template>
<script>
import TheLoading from './TheLoading.vue'
// import tipWorker from '../../workers/tip.worker.js'
export default {
  components: {
    TheLoading,
  },
  data() {
    return {
      setUpData: {},
      tipCount: 0,
      showLoading: false,
      worker: null,
    }
  },
  methods: {
    nextQuestion(size, isNewGame) {
      let nums = this.generateNums()
      this.$refs.loadRef.tipCount = 0
      this.$refs.loadRef.verifyCount = 0
      this.$refs.loadRef.nums = nums.map((num) => num.up)
      this.$refs.loadRef.getAll()
      this.courier(size, nums, isNewGame)
    },
    updateSetUp(setUpData) {
      this.setUpData = setUpData
      this.$refs.loadRef.size = setUpData.size
      this.$refs.loadRef.tipNum = setUpData.tipNum
      this.$refs.loadRef.isLimitTip = setUpData.isLimitTip
    },
    generateNums() {
      let nums = []
      for (let i = 0; i < this.setUpData.size; i++) {
        nums.push({
          up: Math.floor(
            Math.random() * (this.setUpData.maxNum - this.setUpData.minNum + 1) +
            this.setUpData.minNum,
          ),
          down: 1,
        })
      }
      //仅调试使用
      // nums = [{ up: 1, down: 1 }, { up: 1, down: 1 }, { up: 4, down: 1 }, { up: 6, down: 1 }];
      nums.sort((a, b) => a.up - b.up) // 按分子升序
      return nums
    },
    courier(size, nums, isNewGame) {
      let solutions = []
      this.$refs.loadRef.verifyCount = 0
      this.worker = new Worker(new URL('../../workers/tip.worker.js', import.meta.url), {
        type: 'module', // worker 文件采用 ES 模块方式编写?
      })
      // 将原nums对象数组转换为仅包含整数元素的数组(用map函数)
      this.worker.postMessage({
        nums: nums.map((num) => num.up),
        isLimitTip: this.setUpData.isLimitTip,
        tipNum: this.setUpData.tipNum,
        size: this.setUpData.size,
        reachNum: this.setUpData.reachNum,
      })
      const v = this
      this.worker.onmessage = (e) => {
        // status 1:枚举完未发现解法, 2:有解(可能还未找全), 3:已经找到tipNum指定的解数量, 4:已经找到全部解
        switch (e.data.status) {
          case 1:
            { // status 1:枚举完未发现解法,重新生成nums并递归重试，
              // 注意此处必须使用{}分隔，否则重新定义的nums会对case 4中的nums形成暂时性死区(定义的nums作用域会提升到整个switch)
              v.worker.terminate()
              let nums = v.generateNums()
              v.$refs.loadRef.verifyCount = 0
              v.$refs.loadRef.nums = nums.map((num) => num.up)
              v.$refs.loadRef.getAll()
              v.courier(size, nums, isNewGame)
              // console.log('主线程(无解)')
              break
            }
          case 2:
            { //2:有解(可能还未找全)
              v.showLoading = true
              // console.log("主线程(tip++)");
              v.tipCount = e.data.tipCount
              v.$refs.loadRef.tipCount = e.data.tipCount
              solutions.push(e.data.post_s)
              v.$refs.loadRef.verifyCount++
              break
            }
          case 3:
            { //3:已经找到tipNum指定的解数量
              v.$refs.loadRef.allCount = v.tipNum
              // console.log('主线程(完成tipNum)')
              v.worker.terminate()

              setTimeout(() => {
                v.showLoading = false
                if (isNewGame) {
                  v.$emit('newTimer', nums, solutions) //新游戏（十道题）
                } else {
                  v.$emit('continueTimer', nums, solutions) //一局游戏中的下一道题
                }
              }, 1000)
              break
            }
          case 4:
            { //4:已经找到全部解
              v.$refs.loadRef.allCount = v.$refs.loadRef.verifyCount
              v.worker.terminate()
              // console.log('主线程(已找到所有解)')
              setTimeout(() => {
                v.showLoading = false
                if (isNewGame) {
                  v.$emit('newTimer', nums, solutions)
                } else {
                  v.$emit('continueTimer', nums, solutions)
                }
              }, 700)
              break
            }
          case 5:
            {
              if (v.tipCount > 0) {
                //在有解的前提下遇到不是解的情况,记录搜索题解的完整进度
                v.$refs.loadRef.verifyCount += 100
              }
              break
            }
          case 6:
          case 8:
          case 12:
            v.$emit('quickStatus', e.data.status)
            break
        }
      }
    },
  },
}
</script>
