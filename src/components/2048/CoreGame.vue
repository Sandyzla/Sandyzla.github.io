<template>
  <TransitionGroup name="appear">
    <div v-for="cell in cells" :key="cell.id" class="cell" ref="cellsRef"
      :style="
        // calc(50% - 210px)
        `top: calc(50% + ${cell.y * 102 - 198}px); left: calc(50% + ${cell.x * 102 - 198}px); z-index: ${cell.num}; background-color: ${backgroundColor[cell.num]};color:${color[cell.num]}; font-size:${size[cell.num]}px`">
      {{
        cell.num
      }}
    </div>
  </TransitionGroup>

  <audio v-for="(mergeSrc, index) in mergeSrcs" :key="index" :src="mergeSrc" hidden preload="auto" ref="mergeMus"></audio>
  <audio v-for="(moveSrc, index) in moveSrcs" :key="index" :src="moveSrc" hidden preload="auto" ref="moveMus"></audio>
</template>

<script>
export default {
  emits: ['addScore', 'canUndo', 'gameOver'],
  inject: ['gameMode', 'interval'],
  methods: {
    checkExist(x, y) {
      return this.cells.find((cell) => cell.x === x && cell.y === y);
    },
    generateOneCell() { //生成
      let x = getRandom(4);
      let y = getRandom(4);
      if (this.checkExist(x, y)) { //已占用
        this.generateOneCell();
      }
      else { //未占用
        let num = (Math.random() > this.rate2 ? 4 : 2);
        this.cells.push({ x: x, y: y, num: num, id: this.id++ });
      }
    },
    delayHandle() { //快速键入时强制先执行之前设置延时的代码
      let isDelay = false;
      while (this.delayStorey.length > 0) {
        isDelay = true;
        let tmp = this.delayStorey.pop();
        clearTimeout(tmp.timerId);
        tmp.cell_b.num *= 2;
        this.$emit('addScore', tmp.cell_b.num); //将加分消息传递给父组件
        this.undoScore += tmp.cell_b.num;
        this.animateMerge(tmp.dom);
        this.cells.splice(this.cells.indexOf(tmp.cell_a), 1);
      }
      return isDelay;
    },
    //----------四个判断能否移动 开始----------start
    CanMoveUp() {
      let canMove = false;
      for (let i = 0; i < 4; i++) {
        let tmp = this.cells.filter((cell) => cell.x == i);
        tmp.sort((a, b) => a.y - b.y);
        if (tmp.length >= 1 && tmp[0].y != 0) { //若该列第一个元素可移动
          canMove = true;
          break;
        }
        let j;
        for (j = 0; j < tmp.length - 1; j++) { //否则,遍历该列每两个相邻元素
          //若可以合并,则说明可移动; 若不可合并,但相邻元素间有空的方格,也能说明可移动
          if (tmp[j].num === tmp[j + 1].num || tmp[j].y != tmp[j + 1].y - 1) {
            canMove = true;
            break;
          }
        }
      }
      return canMove;
    },
    CanMoveDown() {
      let canMove = false;
      for (let i = 0; i < 4; i++) {
        let tmp = this.cells.filter((cell) => cell.x == i);
        tmp.sort((a, b) => b.y - a.y);
        if (tmp.length >= 1 && tmp[0].y != 3) { //若该列第一个元素可移动
          canMove = true;
          break;
        }
        let j;
        for (j = 0; j < tmp.length - 1; j++) { //否则,遍历该列每两个相邻元素
          //若可以合并,则说明可移动; 若不可合并,但相邻元素间有空的方格,也能说明可移动
          if (tmp[j].num === tmp[j + 1].num || tmp[j].y != tmp[j + 1].y + 1) {
            canMove = true;
            break;
          }
        }
      }
      return canMove;
    },
    CanMoveLeft() {
      let canMove = false;
      for (let i = 0; i < 4; i++) {
        let tmp = this.cells.filter((cell) => cell.y == i);
        tmp.sort((a, b) => a.x - b.x);
        if (tmp.length >= 1 && tmp[0].x != 0) { //若该列第一个元素可移动
          canMove = true;
          break;
        }
        let j;
        for (j = 0; j < tmp.length - 1; j++) { //否则,遍历该列每两个相邻元素
          //若可以合并,则说明可移动; 若不可合并,但相邻元素间有空的方格,也能说明可移动
          if (tmp[j].num === tmp[j + 1].num || tmp[j].x != tmp[j + 1].x - 1) {
            canMove = true;
            break;
          }
        }
      }
      return canMove;
    },
    CanMoveRight() {
      let canMove = false;
      for (let i = 0; i < 4; i++) {
        let tmp = this.cells.filter((cell) => cell.y == i);
        tmp.sort((a, b) => b.x - a.x);
        if (tmp.length >= 1 && tmp[0].x != 3) { //若该列第一个元素可移动
          canMove = true;
          break;
        }
        let j;
        for (j = 0; j < tmp.length - 1; j++) { //否则,遍历该列每两个相邻元素
          //若可以合并,则说明可移动; 若不可合并,但相邻元素间有空的方格,也能说明可移动
          if (tmp[j].num === tmp[j + 1].num || tmp[j].x != tmp[j + 1].x + 1) {
            canMove = true;
            break;
          }
        }
      }
      return canMove;
    },
    //完成合并相关事项：
    doMergeStuff(disCell, toCell) {//disCell = disappear(合并后消失的元素), toCell(合并成的元素)
      //1.记录加分/待撤销分数
      this.addScore += toCell.num * 2;
      this.undoScore += toCell.num * 2;
      //2.执行移动动画播完后的合并动画和操作：
      let id = setTimeout(() => {
        this.delayStorey.pop(); //
        toCell.num *= 2; //翻倍数字
        let dom = this.$refs.cellsRef[this.cells.indexOf(toCell)];
        this.animateMerge(dom); //播放合并动画
        this.cells.splice(this.cells.indexOf(disCell), 1); //删除disCell
        this.canPlayMergeMusic = true; //允许播放合并音乐
      }, this.delayTime);
      this.delayStorey.unshift({ timerId: id, cell_a: disCell, cell_b: toCell, dom: this.$refs.cellsRef[this.cells.indexOf(toCell)] });
    },
    //----------四个判断能否移动 结束----------end
    //----------四个方向移动 开始----------start
    moveUp() {
      for (let i = 0; i < 4; i++) {
        //找到第i列的元素,并按y的升序排列
        let tmp = this.cells.filter((cell) => cell.x == i);
        tmp.sort((a, b) => a.y - b.y);

        if (tmp.length == 1) {
          if (tmp[0].y != 0) tmp[0].y = 0;
          continue;
        }
        let j;
        for (j = 0; j < tmp.length - 1; j++) {
          if (tmp[j].num === tmp[j + 1].num) { //若能够合并
            if (j == 0) tmp[0].y = tmp[1].y = 0;
            else tmp[j].y = tmp[j + 1].y = tmp[j - 1].y + 1;

            this.doMergeStuff(tmp[j], tmp[j + 1]);
            j++;
          } else { //不能合并,只移动
            if (j == 0 && tmp[0].y != 0) tmp[0].y = 0;
            if (j > 0 && tmp[j].y != tmp[j - 1].y + 1) tmp[j].y = tmp[j - 1].y + 1;
          }
        }
        if (j == tmp.length - 1 && tmp[j].y != tmp[j - 1].y + 1)
          tmp[j].y = tmp[j - 1].y + 1;
      }
    },
    moveDown() {
      for (let i = 0; i < 4; i++) {
        //找到第i列的元素,并按y的升序排列
        let tmp = this.cells.filter((cell) => cell.x == i);
        tmp.sort((a, b) => b.y - a.y);

        if (tmp.length == 1) {
          if (tmp[0].y != 3) tmp[0].y = 3;
          continue;
        }
        let j;
        for (j = 0; j < tmp.length - 1; j++) {
          if (tmp[j].num === tmp[j + 1].num) { //若能够合并
            if (j == 0) tmp[0].y = tmp[1].y = 3;
            else tmp[j].y = tmp[j + 1].y = tmp[j - 1].y - 1;
            this.doMergeStuff(tmp[j], tmp[j + 1]);
            j++;
          } else { //不能合并,只移动
            if (j == 0 && tmp[0].y != 3) tmp[0].y = 3;
            if (j > 0 && tmp[j].y != tmp[j - 1].y - 1) tmp[j].y = tmp[j - 1].y - 1;
          }
        }
        if (j == tmp.length - 1 && tmp[j].y != tmp[j - 1].y - 1)
          tmp[j].y = tmp[j - 1].y - 1;
      }
    },
    moveLeft() {
      for (let i = 0; i < 4; i++) {
        //找到第i列的元素,并按y的升序排列
        let tmp = this.cells.filter((cell) => cell.y == i);
        tmp.sort((a, b) => a.x - b.x);

        if (tmp.length == 1) {
          if (tmp[0].x != 0) tmp[0].x = 0;
          continue;
        }
        let j;
        for (j = 0; j < tmp.length - 1; j++) {
          if (tmp[j].num === tmp[j + 1].num) { //若能够合并
            if (j == 0) tmp[0].x = tmp[1].x = 0;
            else tmp[j].x = tmp[j + 1].x = tmp[j - 1].x + 1;
            this.doMergeStuff(tmp[j], tmp[j + 1]);
            j++;
          } else { //不能合并,只移动
            if (j == 0 && tmp[0].x != 0) tmp[0].x = 0;
            if (j > 0 && tmp[j].x != tmp[j - 1].x + 1) tmp[j].x = tmp[j - 1].x + 1;
          }
        }
        if (j == tmp.length - 1 && tmp[j].x != tmp[j - 1].x + 1)
          tmp[j].x = tmp[j - 1].x + 1;
      }
    },
    moveRight() {
      for (let i = 0; i < 4; i++) {
        //找到第i列的元素,并按y的升序排列
        let tmp = this.cells.filter((cell) => cell.y == i);
        tmp.sort((a, b) => b.x - a.x);

        if (tmp.length == 1) {
          if (tmp[0].x != 3) tmp[0].x = 3;
          continue;
        }
        let j;
        for (j = 0; j < tmp.length - 1; j++) {
          if (tmp[j].num === tmp[j + 1].num) { //若能够合并
            if (j == 0) tmp[0].x = tmp[1].x = 3;
            else tmp[j].x = tmp[j + 1].x = tmp[j - 1].x - 1;
            this.doMergeStuff(tmp[j], tmp[j + 1]);
            j++;
          } else { //不能合并,只移动
            if (j == 0 && tmp[0].x != 3) tmp[0].x = 3;
            if (j > 0 && tmp[j].x != tmp[j - 1].x - 1) tmp[j].x = tmp[j - 1].x - 1;
          }
        }
        if (j == tmp.length - 1 && tmp[j].x != tmp[j - 1].x - 1)
          tmp[j].x = tmp[j - 1].x - 1;
      }
    },
    //----------四个方向移动 结束----------end
    animateMerge(dom) { //合并动画
      dom.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.3)' },
          { transform: 'scale(1)' },
        ],
        {
          duration: this.mergeDuration,
        }
      );
    },
    undoGame() { //撤销操作
      this.cells = this.undoCells;
      if (this.undoScore != 0)
        this.$emit('addScore', -this.undoScore);
    },
    afterMove() { //移动执行后的处理
      this.$emit('canUndo', true);
      if (this.addScore != 0) {
        this.$emit('addScore', this.addScore); //将加分消息传递给父组件
        this.addScore = 0;
      }
      // cunstom模式下的gameOver判定
      if (this.gameMode === 'custom') {
        this.addAndCheck();
      } else if (this.gameMode === 'doubly') {
        this.addAndCheck();
        this.addAndCheck();
      } else if (this.gameMode === 'timer' && !this.startTimer) {
        this.startTimer = true;
      }
    },
    playMoveMusic() {
      let index = getRandom(this.moveSrcs.length);
      this.$refs.moveMus[index].currentTime = 0.1;//从头开始播放
      this.$refs.moveMus[index].play(); //播放
    },
    playMergeMusic() {
      // let index = 1;
      let index = Math.random(this.mergeSrcs.length) > 0.5 ? 1 : 0;
      this.$refs.mergeMus[index].currentTime = 0;//从头开始播放
      this.$refs.mergeMus[index].play(); //播放
    },
    addAndCheck() {
      this.generateOneCell();
      // gameOver判断: 在移动->合并完成后
      setTimeout(() => {
        if (this.cells.length >= 16 && !this.CanMoveUp() && !this.CanMoveDown()
          && !this.CanMoveLeft() && !this.CanMoveRight()) {
          this.$emit('gameOver');
          this.gameOver = true;
        }
      }, this.delayTime + 1);
    }
  },
  mounted() {
    //取消注释下列代码 以查看所有数字的颜色设置
    // this.cells.push({ x: 1, y: 0, num: 2, id: this.id++ })
    // this.cells.push({ x: 2, y: 0, num: 4, id: this.id++ })
    // this.cells.push({ x: 3, y: 0, num: 8, id: this.id++ })
    // this.cells.push({ x: 0, y: 0, num: 16, id: this.id++ })
    // this.cells.push({ x: 1, y: 1, num: 32, id: this.id++ })
    // this.cells.push({ x: 2, y: 1, num: 64, id: this.id++ })
    // this.cells.push({ x: 3, y: 1, num: 128, id: this.id++ })
    // this.cells.push({ x: 0, y: 1, num: 256, id: this.id++ })
    // this.cells.push({ x: 0, y: 2, num: 512, id: this.id++ })
    // this.cells.push({ x: 1, y: 2, num: 1024, id: this.id++ })
    // this.cells.push({ x: 2, y: 2, num: 2048, id: this.id++ })
    // this.cells.push({ x: 3, y: 2, num: 4096, id: this.id++ })
    // this.cells.push({ x: 0, y: 3, num: 8192, id: this.id++ })
    this.generateOneCell();
    this.generateOneCell();
    document.addEventListener('keydown', (event) => {
      if (this.delayHandle() || this.gameOver) { //处理残余步骤
        return;
      }
      switch (event.key.toLocaleUpperCase()) {
        case 'ARROWUP':
        case 'W':
          if (this.CanMoveUp()) {
            this.undoCells = structuredClone(this.cells); //深拷贝,储存上一步结果,用于撤销操作
            this.undoScore = 0;
            this.playMoveMusic();
            this.moveUp();
            this.afterMove();
          }
          break;
        case 'ARROWDOWN':
        case 'S':
          if (this.CanMoveDown()) {
            this.undoCells = structuredClone(this.cells); //深拷贝,储存上一步结果,用于撤销操作
            this.undoScore = 0;
            this.playMoveMusic();
            this.moveDown();
            this.afterMove();
          }
          break;
        case 'ARROWLEFT':
        case 'A':
          if (this.CanMoveLeft()) {
            this.undoCells = structuredClone(this.cells); //深拷贝,储存上一步结果,用于撤销操作
            this.undoScore = 0;
            this.playMoveMusic();
            this.moveLeft();
            this.afterMove();
          }
          break;
        case 'ARROWRIGHT':
        case 'D':
          if (this.CanMoveRight()) {
            this.undoCells = structuredClone(this.cells); //深拷贝,储存上一步结果,用于撤销操作
            this.undoScore = 0;
            this.playMoveMusic();
            this.moveRight();
            this.afterMove();
          }
          break;
      }
    });
  },

  data() {
    return {
      cells: [], //定义为[{ x, y, num, id}, ...], x,y:在4×4方格中定位,取{0,1,2,3}; num:表示数字; id:标识
      id: 0, //每个cell具有唯一id,用来设置:key
      rate2: 0.9, //生成2的概率
      isSetNewGame: false, //由父组件修改这个值,在watch中监听它
      canPlayMergeMusic: false,
      moveSrcs: [require("../../assets/2048/move1.mp3"), require("../../assets/2048/move2.mp3"),],
      mergeSrcs: [require("../../assets/2048/conbine1.mp3"), require("../../assets/2048/conbine2.mp3")],
      //延迟
      delayTime: 200, //对合并部分的代码延时, 使得合并动画在移动动画之后执行
      delayStorey: [], //当玩家快速输入时强制处理该数组中数据
      //动画时间
      mergeDuration: 300, //合并动画时间
      //加分
      addScore: 0,
      //撤销
      canUndo: false,
      undoCells: [], //撤销时覆盖this.cells[]
      undoScore: 0, //撤销操作时还要将分数回溯

      //timer游戏模式的相关设置
      startTimer: false,
      intervalId: 0,
      gameOver: false,
      //颜色
      backgroundColor: {
        2: '#F3F6F6',
        4: '#FAD3C6',
        8: '#FFAF60',
        16: '#B2E5E5',
        32: '#14A4A4',
        64: '#12626b',
        128: '#F3d6F6',
        256: '#C255E5',
        512: '#B27340',
        1024: '#F87CBA',
        2048: '#f81876',
        4096: '#183b21',
        8192: '#181d04',
      },
      color: {
        2: '#06101A',
        4: '#06101A',
        8: '#06101A',
        16: '#06101A',
        32: '#ffffff',
        64: '#ffffff',
        128: '#06101A',
        256: '#ffffff',
        512: '#ffffff',
        1024: '#F1D6F4',
        2048: '#F2CFF6',
        4096: '#C6FAD3',
        8192: '#C6FAD3',
      },
      size: {
        2: '44',
        4: '44',
        8: '44',
        16: '40',
        32: '40',
        64: '40',
        128: '32',
        256: '32',
        512: '32',
        1024: '24',
        2048: '24',
        4096: '24',
        8192: '24',
      }
    }
  },
  watch: {
    isSetNewGame() { //开始新游戏
      this.isSetNewGame = false;
      this.cells = [];
      this.undoCells = [];
      this.gameOver = false;
      if (this.startTimer) {
        this.startTimer = false;
        clearInterval(this.intervalId);
      }
      this.generateOneCell();
      this.generateOneCell();
    },
    canPlayMergeMusic(value) {
      if (value) {
        setTimeout(() => this.playMergeMusic(), 20)

        setTimeout(() => this.canPlayMergeMusic = false, 100); //限制播放频率
      }
    },
    startTimer(value) {
      if (value) {
        this.intervalId = setInterval(() => {
          this.generateOneCell();

          if (this.cells.length >= 16) {
            this.delayHandle();
            if (this.cells.length >= 16) {
              this.gameOver = true;
              this.$emit('gameOver');
              clearInterval(this.intervalId);
              return;
            }

          }
        }, this.interval * 100);
      }
    }
  },

}
function getRandom(max) {
  return Math.floor(Math.random() * max);
}

</script>

<style scoped>
.cell {
  position: fixed;
  width: 90px;
  height: 90px;
  border-radius: 5px;
  font-weight: 700;
  line-height: 88px;
  letter-spacing: 1px;
  transition: 0.16s top ease-in-out, 0.16s left ease-in-out, 0.3s scale;
  font-family: Impact;
  font-family: Tahoma;
}


.appear-enter-active {
  animation: appear 550ms ease;
}

.appear-leave-to {
  opacity: 0;
}

.appear-leave-active {
  transition: opacity 200ms ease;
}

@keyframes appear {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  25% {
    opacity: 0;
    transform: scale(0);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>