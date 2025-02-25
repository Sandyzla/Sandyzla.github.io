<template>
  <div class="hotArea" @mousedown="dragStart($event)" @mousemove="dragOver($event)" @mouseup="drop($event)"></div>
  <!-- shadow -->
  <TransitionGroup name="appearCard">
    <div v-for="cell in cells" :key="cell.id + 10000" :class="{ shadow: !darkMode, shadow_dark: darkMode }"
      ref="shadowsRef"
      :style="`top: calc(50% + ${cell.y * 112 - 220 + cell.moveY}px); left: calc(50% + ${cell.x * 82 - 158 + cell.moveX}px); transform:${scale(cell)};`">
    </div>

  </TransitionGroup>
  <!-- card, num -->
  <TransitionGroup name="appearCard">
    <div v-for="cell in cells" :key="cell.id" class="card" ref="cellsRef"
      :style="`z-index:${zIndex(cell)}; top: calc(50% + ${cell.y * 112 - 223 + cell.moveY}px); left: calc(50% + ${cell.x * 82 - 158 + cell.moveX}px);  font-size:${size(cell.num)}px; transform:${scale(cell)}; background-color: ${bgCardColor(cell.num)}`">
      <div class="num"
        :style="`background-color: ${bgCellColor(cell.num)};color:${(cell.num == maxNum) ? '#f83866' : color(cell.num)}; height:${height(cell.num)}px; `">
        {{ cell.num }}
      </div>
      <the-emoji class="emoji" ref="emojisRef" :initialNum="cell.num"></the-emoji>
    </div>
  </TransitionGroup>

  <div :class="{ debug: !darkMode, debug_dark: darkMode }">
    <svg width="164" height="109" xmlns="http://www.w3.org/2000/svg">
      <g>
        <title>Layer 1</title>
        <TransitionGroup name="dirTip">

          <rect v-if="this.debugUp" x="57" y="2" width="50" height="50" rx="16" fill="#00c560" />
          <rect v-if="!this.debugUp" x="57" y="2" width="50" height="50" rx="16" fill="#ff5050" />
          <rect v-if="this.debugDown" x="57" y="57" width="50" height="50" rx="16" fill="#00c560" />
          <rect v-if="!this.debugDown" x="57" y="57" width="50" height="50" rx="16" fill="#ff5050" />
          <rect v-if="this.debugLeft" x="2" y="57" width="50" height="50" rx="16" fill="#00c560" />
          <rect v-if="!this.debugLeft" x="2" y="57" width="50" height="50" rx="16" fill="#ff5050" />
          <rect v-if="this.debugRight" x="112" y="57" width="50" height="50" rx="16" fill="#00c560" />
          <rect v-if="!this.debugRight" x="112" y="57" width="50" height="50" rx="16" fill="#ff5050" />
          <image v-if="!this.debugUp" width="40" x="63" y="9" href="@/assets/Threes/slideUpOK.png" />
          <image v-if="this.debugUp" width="40" x="63" y="9" href="@/assets/Threes/slideUpOK.png" />
          <image v-if="!this.debugDown" width="40" x="63" y="60" href="@/assets/Threes/slideDownOK.png" />
          <image v-if="this.debugDown" width="40" x="63" y="60" href="@/assets/Threes/slideDownOK.png" />
          <image v-if="!this.debugLeft" width="40" x="11" y="62" href="@/assets/Threes/slideLeftOK.png" />
          <image v-if="this.debugLeft" width="40" x="11" y="62" href="@/assets/Threes/slideLeftOK.png" />
          <image v-if="!this.debugRight" width="40" x="115" y="62" href="@/assets/Threes/slideRightOK.png" />
          <image v-if="this.debugRight" width="40" x="115" y="62" href="@/assets/Threes/slideRightOK.png" />
        </TransitionGroup>
      </g>
    </svg>
  </div>

  <!-- next_cell -->
  <div :class="{ next_wrapper: !darkMode, next_dark_wrapper: darkMode }">
    NEXT
    <div class="next_cell" ref="nextRef" :style="`background-color: ${bgCellColor(next.num)}`">
      <div class="next_num" v-if="next.num >= 6" :style="`font-size:${nextSize(next.num)}px; color:${color(next.num)};`">
        {{ next.num }}</div>
    </div>
  </div>

  <!-- 结算显示的分数 -->
  <div v-if="gameOver">
    <div :class="{ totalScore: !darkMode, totalScore_dark: darkMode }">
      <label v-if="triggerScore" class="totalLabel">总分 </label>
      <label v-if="triggerScore" class="scoreLabel">{{ totalScore.toFixed(0) }}</label>

    </div>
    <div v-for="cell in cells" :key="cell.id + 30000"
      :class="{ scoreCard: cell.num != maxNum, scoreMaxCard: cell.num == maxNum }" ref="scoreCardsRef"
      :style="`top: calc(50% + ${cell.y * 112 - 203}px); left: calc(50% + ${cell.x * 82 - 173}px);`">
      +{{ score(cell.num) }}
    </div>
  </div>

  <!-- <audio v-for="(mergeSrc, index) in mergeSrcs" :key="index" :src="mergeSrc" hidden preload="auto" ref="mergeMus"></audio>
  <audio v-for="(moveSrc, index) in moveSrcs" :key="index" :src="moveSrc" hidden preload="auto" ref="moveMus"></audio> -->
</template>

<script>
import gsap from 'gsap';
// import TheArrow from './emoji/TheArrow.vue';
import { mergeFromAnimate, mergeToAnimate, moveBackAnimate, moveToAnimate, moveStillAnimate, mergeMaxToAnimate, friendAnimate, appearAnimate, nextAnimate, showScore, turnOverCard } from '@/js/Three/animation';
import { generateNum, generateInitialNum } from '@/js/Three/generate.js';
import { size, borderBottom, zIndex, color, nextSize, bgCellColor, height, bgCardColor } from '@/js/Three/dynamicStyle';
import TheEmoji from './emoji/TheEmoji.vue';
// import { gsap } from 'gsap';
export default {
  emits: ['gameOver', 'triggerShow'],
  inject: ['gameMode', 'interval', 'darkMode'],
  components: { TheEmoji },
  methods: {
    dragStart(e) {
      if (this.gameOver && !this.triggerScore) {
        this.triggerScore = true;
        this.calculateScore();
        this.$emit('triggerShow');
        return;
      }
      if (this.gameOver) return;
      this.isDrag = true;
      this.mouseX = e.x; //获取起始时鼠标点击位置 
      this.mouseY = e.y; //获取起始时鼠标点击位置
      this.hasDirection = false; //初始化,允许设置方向
    },
    dragOver(e) {
      if (!this.isDrag) return; //仅鼠标悬浮,不属于拖拽,拖拽必须是点击后移动
      if (this.gameOver) return;
      this.difX = e.x - this.mouseX;
      this.difY = e.y - this.mouseY;
      if (!this.hasDirection && (Math.abs(this.difY) > 2 || Math.abs(this.difX) > 2)) { //如果没确定方向
        this.hasDirection = true; //该次拖拽确定方向则不允许更改
        this.delayHandle();
        if (Math.abs(this.difY) > Math.abs(this.difX)) {//上下
          if (this.difY > 0) { this.direction = 'down'; this.setMoveDown(); }
          else { this.direction = 'up'; this.setMoveUp(); }
        } else {//左右
          if (this.difX > 0) { this.direction = 'right'; this.setMoveRight(); }
          else { this.direction = 'left'; this.setMoveLeft(); }
        }
      }
      else if (!this.hasDirection) {
        return;
      }
      //---------dragOver 第二部分代码:卡片的鼠标拖拽效果
      if (this.direction == 'up') {
        this.difX = 0; if (this.difY > 0) return;
        for (let i = 0; i < this.cells.length; i++) {
          let moveY = Math.max(this.difY, -112);
          if (this.cells[i].canMove || this.cells[i].canMerge) {
            this.cells[i].moveY = moveY;
          }
          else if (this.cells[i].canDelete) { //向上移动时待删除元素要朝上挪一点位置
            this.cells[i].moveY = -Math.sqrt(-moveY);
          } else if (!this.cells[i].canMove && !this.cells[i].canMerge && !this.cells[i].canDelete) {
            this.cells[i].moveY = moveY / 30;
          }
        }
      } else if (this.direction == 'down') {
        this.difX = 0; if (this.difY < 0) return;
        for (let i = 0; i < this.cells.length; i++) {
          let moveY = Math.min(this.difY, 112);
          if (this.cells[i].canMove) {
            this.cells[i].moveY = moveY;
          } else if (this.cells[i].canMerge) {
            this.cells[i].moveY = Math.min(moveY, 100);
          } else if (!this.cells[i].canMove && !this.cells[i].canMerge && !this.cells[i].canDelete) {
            this.cells[i].moveY = moveY / 30;
          }
        }
      } else if (this.direction == 'left') {
        this.difY = 0; if (this.difX > 0) return;
        for (let i = 0; i < this.cells.length; i++) {
          let moveX = Math.max(this.difX, -82);
          if (this.cells[i].canMove || this.cells[i].canMerge) {
            this.cells[i].moveX = moveX;
          } else if (!this.cells[i].canMove && !this.cells[i].canMerge) {
            this.cells[i].moveX = moveX / 30;
          }
        }
      } else if (this.direction == 'right') {
        this.difY = 0; if (this.difX < 0) return;
        for (let i = 0; i < this.cells.length; i++) {
          let moveX = Math.min(this.difX, 82);
          if (this.cells[i].canMove || this.cells[i].canMerge) {
            this.cells[i].moveX = moveX;
          } else if (!this.cells[i].canMove && !this.cells[i].canMerge) {
            this.cells[i].moveX = moveX / 30;
          }
        }
      }
    },
    drop() {
      if (this.gameOver) return;
      this.isDrag = false;
      if (!this.hasDirection) return;

      if (this.direction == 'up' && this.difY > -60 || this.direction == 'down' && this.difY < 60 ||
        this.direction == 'left' && this.difX > -40 || this.direction == 'right' && this.difX < 40) {
        this.moveBack();
        return;
      }
      this.moveTo();
      this.merge();
      this.delete();
      if (this.direction == 'up' && this.CanMoveUp() || this.direction == 'down' && this.CanMoveDown() ||
        this.direction == 'left' && this.CanMoveLeft() || this.direction == 'right' && this.CanMoveRight()) {
        setTimeout(() => { this.addAndCheck() }, 10);
      }
      this.hasDirection = false;
      // this.dirTipAnimation();
    },
    moveBack() { //当拖拽距离不够时复位
      for (let i = 0; i < this.cells.length; i++) {
        moveBackAnimate(this.$refs.cellsRef[i], this.$refs.shadowsRef[i], this.cells[i]);
      }
      this.hasDirection = false;
    },
    moveTo() { //移动至下一位置
      for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i].canMove || this.cells[i].canMerge) {

          moveToAnimate(this.$refs.cellsRef[i], this.$refs.shadowsRef[i], this.cells[i], this.direction, this.mergeDelayTime);
        }
        else if (!this.cells[i].canMove && !this.cells[i].canMerge &&
          (!this.cells[i].canDelete || this.direction === 'left' || this.direction === 'right')) {
          moveStillAnimate(this.$refs.cellsRef[i], this.$refs.shadowsRef[i], this.cells[i], this.direction);
        }

      }
    },
    merge() {
      for (let i = 0; i < this.cells.length; i++) { //先更新this.maxNum
        let tmp = this.cells[i];
        if (tmp.canMerge) {
          let toNum = (tmp.num < 3) ? 3 : tmp.num * 2;
          if (toNum > this.maxNum) this.maxNum = toNum;
          if (toNum >= this.maxNum) this.canFriendAnimate = true;
        }
      }
      for (let i = 0; i < this.cells.length; i++) {
        let tmp = this.cells[i];
        if (tmp.canMerge) {
          let toNum = (tmp.num < 3) ? 3 : tmp.num * 2;
          let idFrom = 0, idTo = 0;
          idFrom = setTimeout(() => {

            mergeFromAnimate(this.$refs.cellsRef[this.cells.indexOf(tmp)], this.$refs.shadowsRef[this.cells.indexOf(tmp)], this.mergeEachTime);
          }, this.mergeDelayTime);

          if (toNum >= this.maxNum) {
            idTo = setTimeout(() => {
              this.delayStorey.pop();
              tmp.num = toNum;
              this.$refs.emojisRef[this.cells.indexOf(tmp)].num = toNum;
              mergeMaxToAnimate(this.$refs.cellsRef[this.cells.indexOf(tmp)], this.$refs.shadowsRef[this.cells.indexOf(tmp)], this.maxMergeTime, this.mergeEachTime)
            }, this.mergeEachTime + this.mergeDelayTime);
          }
          else {
            idTo = setTimeout(() => {
              this.delayStorey.pop();
              tmp.num = toNum;
              this.$refs.emojisRef[this.cells.indexOf(tmp)].num = toNum;
              mergeToAnimate(this.$refs.cellsRef[this.cells.indexOf(tmp)], this.$refs.shadowsRef[this.cells.indexOf(tmp)], this.mergeEachTime)
            }, this.mergeEachTime + this.mergeDelayTime);
          }
          this.delayStorey.unshift({ idFrom: idFrom, idTo: idTo, dom: this.$refs.cellsRef[this.cells.indexOf(tmp)], shadow: this.$refs.shadowsRef[this.cells.indexOf(tmp)], cell: tmp, toNum: toNum });
        }
      }
      if (this.canFriendAnimate) {
        setTimeout(() => { //其他friend响应动画
          for (let i = 0; i < this.cells.length; i++) {
            if (this.cells[i].num === this.maxNum) {
              friendAnimate(this.$refs.cellsRef[i], this.friendDurTime);
            }
          }
          this.canFriendAnimate = false;
        }, 110);
      }
    },
    delayHandle() {
      if (this.delayStorey.length > 0) {
        let isDelay = false;
        while (this.delayStorey.length > 0) {
          isDelay = true;
          let tmp = this.delayStorey.pop();
          // clearTimeout(tmp.idFrom);
          clearTimeout(tmp.idTo);
          tmp.cell.num = tmp.toNum;
        }
        return isDelay;
      }
    },
    delete() {
      for (let i = 0; i < this.cells.length; i++) {
        let tmp = this.cells[i];
        if (tmp.canDelete) {
          if (tmp.num === 1 || tmp.num === 2) { this.num1--; this.num2-- }
          this.cells.splice(this.cells.indexOf(tmp), 1);
          i--;
        }
      }
    },
    checkExist(x, y) {
      return this.cells.find((cell) => cell.x === x && cell.y === y);
    },
    initialCells() {
      let n = 6, posX = 0, posY = 0;
      while (n--) {
        do {
          posX = Math.floor(Math.random() * 4);
          posY = Math.floor(Math.random() * 4);
        } while (this.checkExist(posX, posY))
        let num = generateInitialNum(this.num1, this.num2);
        if (num === 1) this.num1++;
        else if (num === 2) this.num2++;
        this.cells.push({ x: posX, y: posY, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: num, id: this.id++ });
      }

    },
    generateOneCell() { //生成,总体延时5ms
      let aja = Math.random();
      let pos = Math.floor(Math.random() * 4);
      let x = 0, y = 0, dir = 'none';
      if (aja > 0.75) {//上四个
        x = pos; y = 0; dir = 'down';//上四个则说明移动方向是向下
      } else if (aja > 0.5) {//下四个
        x = pos; y = 3; dir = 'up';
      } else if (aja > 0.25) {//左四个
        x = 0; y = pos; dir = 'right';
      } else { //右四个
        x = 3; y = pos; dir = 'left';
      }
      if (this.checkExist(x, y)) { //已占用
        this.generateOneCell();
      }
      else { //未占用
        if (this.next.num === 1) this.num1++;
        else if (this.next.num === 2) this.num2++;
        // else if(this.next.num )
        this.cells.push({ x: x, y: y, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: this.next.num, id: this.id++ });
        let n = this.cells.length;
        setTimeout(() => {
          appearAnimate(this.$refs.cellsRef[n - 1], this.$refs.shadowsRef[n - 1], dir);
        }, 5);

        // 找到下一次的next.num
        // this.next.num = 1;
        nextAnimate(this.$refs.nextRef);
        this.next.num = generateNum(this.num1, this.num2, this.maxNum);
      }
    },
    setMoveUp() {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].canMove = false;
        this.cells[i].canMerge = false;
        this.cells[i].canDelete = false;
      }
      for (let i = 0; i < 4; i++) {
        //找到第i列的元素,并按y的升序排列
        let tmp = this.cells.filter((cell) => cell.x == i);
        tmp.sort((a, b) => a.y - b.y);
        let space = false;
        for (let j = 0; j < tmp.length; j++) {
          if (tmp[j].y > j || space) {
            for (let k = j; k < tmp.length; k++) {
              // tmp[k].y--;
              tmp[k].canMove = true;
            }
            break;
          }
          if (j < tmp.length - 1 && tmp[j].y == tmp[j + 1].y - 1 && (tmp[j].num + tmp[j + 1].num == 3 ||
            (tmp[j].num >= 3 && tmp[j].num == tmp[j + 1].num))) {
            tmp[j].canDelete = true;
            tmp[j + 1].canMerge = true;
            space = true;
            j++;
          }
        }
      }
    },
    setMoveDown() {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].canMove = false;
        this.cells[i].canMerge = false;
        this.cells[i].canDelete = false;
      }
      for (let i = 0; i < 4; i++) {
        //找到第i列的元素,并按y的升序排列
        let tmp = this.cells.filter((cell) => cell.x == i);
        tmp.sort((a, b) => b.y - a.y);
        let space = false;
        for (let j = 0; j < tmp.length; j++) {
          if (tmp[j].y + j < 3 || space) {
            for (let k = j; k < tmp.length; k++) {
              tmp[k].canMove = true;
            }
            break;
          }
          if (j < tmp.length - 1 && tmp[j].y == tmp[j + 1].y + 1 && (tmp[j].num + tmp[j + 1].num == 3 ||
            (tmp[j].num >= 3 && tmp[j].num == tmp[j + 1].num))) {
            tmp[j].canDelete = true;
            tmp[j + 1].canMerge = true;
            space = true;
            j++;
          }
        }
      }
    },
    setMoveLeft() {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].canMove = false;
        this.cells[i].canMerge = false;
        this.cells[i].canDelete = false;
      }
      for (let i = 0; i < 4; i++) {
        //找到第i列的元素,并按y的升序排列
        let tmp = this.cells.filter((cell) => cell.y == i);
        tmp.sort((a, b) => a.x - b.x);
        let space = false;
        for (let j = 0; j < tmp.length; j++) {
          if (tmp[j].x > j || space) {
            for (let k = j; k < tmp.length; k++) {
              // tmp[k].x--;
              tmp[k].canMove = true;
            }
            break;
          }
          if (j < tmp.length - 1 && tmp[j].x == tmp[j + 1].x - 1 && (tmp[j].num + tmp[j + 1].num == 3 ||
            (tmp[j].num >= 3 && tmp[j].num == tmp[j + 1].num))) {
            tmp[j].canDelete = true;
            tmp[j + 1].canMerge = true;
            space = true;
            j++;
          }
        }
      }
    },
    setMoveRight() {
      for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].canMove = false;
        this.cells[i].canMerge = false;
        this.cells[i].canDelete = false;
      }
      for (let i = 0; i < 4; i++) {
        //找到第i列的元素,并按y的升序排列
        let tmp = this.cells.filter((cell) => cell.y == i);
        tmp.sort((a, b) => b.x - a.x);
        let space = false;
        for (let j = 0; j < tmp.length; j++) {
          if (tmp[j].x + j < 3 || space) {
            for (let k = j; k < tmp.length; k++) {
              tmp[k].canMove = true;
            }
            break;
          }
          if (j < tmp.length - 1 && tmp[j].x == tmp[j + 1].x + 1 && (tmp[j].num + tmp[j + 1].num == 3 ||
            (tmp[j].num >= 3 && tmp[j].num == tmp[j + 1].num))) {
            tmp[j].canDelete = true;
            tmp[j + 1].canMerge = true;
            space = true;
            j++;
          }
        }
      }
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
          let num1 = tmp[j].num; let num2 = tmp[j + 1].num;
          if (tmp[j].canMerge) num1 = (num1 < 3) ? 3 : num1 * 2;
          if (tmp[j + 1].canMerge) num2 = (num2 < 3) ? 3 : num2 * 2;

          if (tmp[j].y != tmp[j + 1].y - 1 || num1 + num2 == 3 || (num1 >= 3 && num1 == num2)) {
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
          let num1 = tmp[j].num; let num2 = tmp[j + 1].num;
          if (tmp[j].canMerge) num1 = (num1 < 3) ? 3 : num1 * 2;
          if (tmp[j + 1].canMerge) num2 = (num2 < 3) ? 3 : num2 * 2;

          if (tmp[j].y != tmp[j + 1].y + 1 || num1 + num2 == 3 || (num1 >= 3 && num1 == num2)) {
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
          // console.log("Caz 1: (" + tmp[0].x + "," + tmp[0].y + ")");
          break;
        }
        let j;
        for (j = 0; j < tmp.length - 1; j++) { //否则,遍历该列每两个相邻元素
          //若可以合并,则说明可移动; 若不可合并,但相邻元素间有空的方格,也能说明可移动
          let num1 = tmp[j].num; let num2 = tmp[j + 1].num;
          if (tmp[j].canMerge) num1 = (num1 < 3) ? 3 : num1 * 2;
          if (tmp[j + 1].canMerge) num2 = (num2 < 3) ? 3 : num2 * 2;

          if (tmp[j].x != tmp[j + 1].x - 1 || num1 + num2 == 3 || (num1 >= 3 && num1 == num2)) {
            // console.log("Caz 2: (" + tmp[j].x + "," + tmp[j].y + "),(" + tmp[j + 1].x + "," + tmp[j + 1].y + ")");
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
          let num1 = tmp[j].num; let num2 = tmp[j + 1].num;
          if (tmp[j].canMerge) num1 = (num1 < 3) ? 3 : num1 * 2;
          if (tmp[j + 1].canMerge) num2 = (num2 < 3) ? 3 : num2 * 2;

          if (tmp[j].x != tmp[j + 1].x + 1 || num1 + num2 == 3 || (num1 >= 3 && num1 == num2)) {
            canMove = true;
            break;
          }
        }
      }
      return canMove;
    },
    //----------四个判断能否移动 结束----------end
    afterMove() { //移动执行后的处理
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
    dirTipAnimation() {
      var tl = gsap.timeline();

      tl.to('.debug', { skewX: '4', duration: 0.1 });
      tl.to('.debug', { skewX: '1', duration: 0.1 });
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
        // console.log("now start");
        // console.log(this.cells.length + " " + this.CanMoveUp() + " " + this.CanMoveDown() + " " + this.CanMoveLeft() + " " + this.CanMoveRight());
        this.debugUp = this.CanMoveUp();
        this.debugDown = this.CanMoveDown();
        this.debugLeft = this.CanMoveLeft();
        this.debugRight = this.CanMoveRight();
        if (this.cells.length >= 16 && !this.debugUp && !this.debugDown && !this.debugLeft && !this.debugRight) {
          this.$emit('gameOver');
          this.gameOver = true;
        }
      }, this.checkDelayTime);

    },
    calculateScore() {
      let curNum = 3; //当前统计的数字,从3开始
      let delayTime = 600; //每一次延时
      let delayCount = 1;
      do {
        let tmpCells = this.cells.filter((cell) => cell.num === curNum);
        for (let i = 0; i < tmpCells.length; i++) {
          let index = this.cells.indexOf(tmpCells[i]);
          setTimeout(() => {
            gsap.to(this, { duration: 0.2, totalScore: Number(this.totalScore + this.score(tmpCells[i].num)) });
            turnOverCard(this.$refs.cellsRef[index], this.$refs.shadowsRef[index], 400);
            showScore(this.$refs.scoreCardsRef[index]);
          }, 5 + delayCount * delayTime);
          delayCount++;
        }
        // res += tmpCells.length * this.score(curNum);
        curNum *= 2;
      }
      while (curNum <= this.maxNum)
    },
    debugColor(cell) {
      // console.log("in debug " + cells.length);
      let list = this.cells.filter((c) => c.x == cell.x && c.y == cell.y);
      if (list.length > 1) return 'rgb(255,0,0)';
      else return 'rgb(0,0,0)'
    },
    scale(cell) {
      if (!this.isDrag || !this.hasDirection) {
        return 'scale(1,1)';
      }
      if (cell.canMove || cell.canMerge || cell.canDelete) return 'scale(1,1)';
      let dir = this.direction;
      let scaleX = 1, scaleY = 1;
      if (dir == 'up') {
        if (this.difY > 0) return 'scale(1,1)';
        let moveY = Math.max(this.difY, -112);
        scaleX = 1 - moveY / -3240;
        scaleY = 1 + moveY / -3240;
        // console.log(scaleX + "  " + scaleY);
        return 'scale(' + scaleX + ',' + scaleY + ')';
      } else if (dir == 'down') {
        if (this.difY < 0) return 'scale(1,1)';
        let moveY = Math.min(this.difY, 112);
        scaleX = 1 - moveY / 3240;
        scaleY = 1 + moveY / 3240;
        // console.log(scaleX + "  " + scaleY);
        return 'scale(' + scaleX + ',' + scaleY + ')';
      } else if (dir == 'left') {
        if (this.difX > 0) return 'scale(1,1)';
        let moveX = Math.max(this.difX, -82);
        scaleX = 1 + moveX / -1640;
        scaleY = 1 - moveX / -1640;
        // console.log(scaleX + "  " + scaleY);
        return 'scale(' + scaleX + ',' + scaleY + ')';
      } else if (dir == 'right') {
        if (this.difX < 0) return 'scale(1,1)';
        let moveX = Math.min(this.difX, 82);
        scaleX = 1 + moveX / 1640;
        scaleY = 1 - moveX / 1640;
        return 'scale(' + scaleX + ',' + scaleY + ')';
      }
    },
    borderBottom(num) { return borderBottom(num) },
    zIndex(cell) { return zIndex(cell, this.direction) },
    color(num) { return color(num) },
    size(num) { return size(num) },
    nextSize(num) { return nextSize(num) },
    bgCellColor(num) { return bgCellColor(num, this.darkMode, this.triggerScore) },
    height(num) { return height(num) },
    bgCardColor(num) { return bgCardColor(num, this.triggerScore) },
    score(num) {

      switch (num) {
        case 3: return 3; case 6: return 9; case 12: return 27; case 24: return 81
        case 48: return 243; case 96: return 729; case 192: return 2187;
        case 384: return 6561; case 768: return 19683;
        default: return 0;
      }

    }
  },
  mounted() {
    //取消注释下列代码 以查看所有数字的颜色设置
    this.next.num = generateNum();
    this.initialCells();
    // this.next.num = 2;
    // this.cells.push({ x: 0, y: 0, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 1, y: 0, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 2, y: 0, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 3, y: 0, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 0, y: 1, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 3, id: this.id++ });
    // this.cells.push({ x: 1, y: 1, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 2, y: 1, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 3, y: 1, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 0, y: 2, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 1, y: 2, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 2, y: 2, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 3, y: 2, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 0, y: 3, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 1, y: 3, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 2, y: 3, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
    // this.cells.push({ x: 3, y: 3, moveX: 0, moveY: 0, canMove: false, canDelete: false, canMerge: false, num: 2, id: this.id++ });
  },

  data() {
    return {
      cells: [],
      next: {},
      id: 0, //每个cell具有唯一id,用来设置:key
      rate3: 0.333, //生成3的概率
      maxNum: 3,
      isSetNewGame: false, //由父组件修改这个值,在watch中监听它
      canPlayMergeMusic: false,
      num1: 0,
      num2: 0,
      debugUp: true,
      debugDown: true,
      debugLeft: true,
      debugRight: true,
      moveSrcs: [require("../../assets/2048/move1.mp3"), require("../../assets/2048/move2.mp3"),],
      mergeSrcs: [require("../../assets/2048/conbine1.mp3"), require("../../assets/2048/conbine2.mp3")],
      //手势
      mouseX: 0,
      mouseY: 0,
      difX: 0,
      difY: 0,
      direction: '',
      isDrag: false,
      hasDirection: false,
      canFriendAnimate: false,//必须要有合成一个maxNum时才能让其他maxNum卡片播friend动画,所以必须标识是否有合成maxNum
      //动画延时或持续时间
      mergeDelayTime: 100, //合并延时,同时也是moveTo的持续时间
      mergeEachTime: 150, //合并from和合并to的持续时间都共用这个
      maxMergeTime: 500, //合成最大数时替换mergeTo
      friendDurTime: 500, //朋友响应时长
      checkDelayTime: 5, //检查gameOver的延时
      delayStorey: [], //当玩家快速输入时强制处理该数组中数据
      //timer游戏模式的相关设置
      startTimer: false,
      intervalId: 0,
      gameOver: false,
      triggerScore: false,
      totalScore: 0,
    }
  },
  watch: {
    isSetNewGame(value) { //开始新游戏
      if (!value) return;
      this.isSetNewGame = false;
      this.maxNum = 3;
      this.cells = [];
      this.num1 = 0;
      this.num2 = 0;
      // this.id = 0;
      this.gameOver = false;
      this.debugUp = true;
      this.debugDown = true;
      this.debugLeft = true;
      this.debugRight = true;
      this.triggerScore = false; //用户点击触发结算界面
      this.totalScore = 0;
      this.delayStorey = [];
      this.canFriendAnimate = false;
      this.hasDirection = false;
      gsap.to('.debug', { y: 0, duration: 0.5 });
      if (this.startTimer) {
        this.startTimer = false;
        clearInterval(this.intervalId);
      }
      this.next.num = generateNum();
      setTimeout(() => {
        this.initialCells();
      }, 100)
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
.num {
  font-family: NumberOnly;
  line-height: 96px;
  border-radius: 8px;
  /* letter-spacing: -1px; */
  text-align: center;
}

.shadow,
.shadow_dark {
  position: fixed;
  top: 3px;
  z-index: 1;
  height: 100px;
  width: 70px;
  /* background-color: black; */
  border-radius: 12px;
  box-shadow: -6px 8px 0px -2px rgb(168, 168, 168),
    6px 8px 0px -2px rgb(168, 168, 168);
}

.shadow_dark {
  box-shadow: -6px 8px 0px -2px rgba(71, 71, 71),
    6px 8px 0px -2px rgba(71, 71, 71);
}

.debug,
.debug_dark {
  position: fixed;
  color: rgb(145, 145, 145);
  z-index: 99999;
  left: 12%;
  top: 20%;
  width: 200px;
  padding: 10px 0px;
  font-size: 18px;
  border-radius: 20px;
  background-color: rgba(41, 41, 41, 0.285);
}

.debug_dark {
  background-color: rgba(100, 100, 100, 0.285);
}

li {
  list-style-type: none;
}

b {
  font-size: 20px;
}


.shadowCell,
.card {
  font-weight: bolder;
  position: fixed;
  width: 70px;
  height: 106px;
  border-radius: 8px;
}

.hotArea {
  z-index: 30;
  position: fixed;
  left: calc(50% - 700px);
  top: calc(50% - 300px);
  width: 1400px;
  height: 600px;
  cursor: pointer;
}

.next_wrapper,
.next_dark_wrapper {
  position: fixed;
  top: -5%;
  left: calc(75% - 72px);
  width: 70px;
  height: 260px;

  border-radius: 30px;
  background-color: rgba(41, 41, 41, 0.285);
  line-height: 160px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 22px;
  font-weight: 900;
  color: aliceblue;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  /* transition: 400ms background-color linear; */
}

.next_dark_wrapper {
  background-color: rgba(100, 100, 100, 0.285);
  /* color: rgb(249, 249, 249); */
}

.next_wrapper::before,
.next_dark_wrapper::before {
  font-size: 20px;
  font-weight: 500;
  color: rgb(249, 249, 249);
  /* font-family: 'Comic Sans MS'; */
  font-family: Cascadia Code, Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.next_cell {
  margin-left: 10px;
  width: 50px;
  height: 80px;
  border-radius: 8px;
  border-bottom: 6px solid rgba(117, 117, 117, 0.317);
  transition: all 200ms;
}

div.next_num {
  line-height: 80px;
  text-align: center;
  font-family: NumberOnly;
}

.emoji {
  z-index: 3;
  position: relative;
  top: -22px;
  left: 0px
}

.scoreCard,
.scoreMaxCard {
  position: fixed;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0);
  font-size: 38px;
  color: rgb(214, 196, 0);
  text-shadow: -1px -1px black;
  /* font-family: 'Cascadia Code'; */
  font-family: 'Comic Sans MS';
  text-align: center;
  width: 100px;
  opacity: 0;
}

.scoreMaxCard {
  color: #f83866;
}

.totalScore,
.totalScore_dark {
  position: fixed;
  left: calc(50% - 120px);
  width: 240px;
  display: flex;
  justify-content: center;
  top: 1%;
  color: rgb(72, 72, 72);
  align-items: center;
}

.totalLabel {
  font-size: 36px;
  width: 90px;
  /* margin-top: -50px; */
}

.scoreLabel {
  font-size: 50px;
  font-family: NumberOnly;

}

.totalScore_dark {
  color: rgb(217, 217, 217);
}

.appearCard-enter-from,
.appearCard-enter-to,
.appearCard-leave-to {
  opacity: 0;
}

.appearCard-enter-active {
  transition: all 100ms;
}

.appearCard-leave-from {
  opacity: 1;
}

.appearCard-leave-active {
  transition: opacity 100ms linear;
}

.dirTip-enter-from {
  opacity: 0;
}

/* .dirTip-enter-to {
  opacity: 0;
} */

.dirTip-enter-active {
  transition: opacity 400ms;
}
</style>