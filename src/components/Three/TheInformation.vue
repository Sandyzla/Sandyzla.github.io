<template>
  <div>
    <div class="control_grid">
      <div>
        <div @click="setNewGame" class="newGameButton">NEW</div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  emits: ['newGame'],
  inject: ['darkMode'],
  data() {
    return {
      showRecord: false,
      hasShowed: false,
    }
  },
  methods: {
    setNewGame() {
      this.hasShowed = false;
      this.showQuickScore = [];
      this.$emit('newGame');
    },
  },
  created() {
    let bestScore = localStorage.getItem('best');
    if (bestScore === null) {
      this.best = 0;
    } else {
      this.best = parseInt(bestScore);
    }
  },
}
</script>
<style scoped>
div {
  text-align: center;
  font-size: 19px;
  font-weight: 800;
}

label {
  display: block;
}

.show_grid,
.control_grid {
  position: fixed;
  display: grid;
  row-gap: 12px;
  column-gap: 12px;
  margin-bottom: 12px;
  justify-content: center;
  transition: 200ms left ease-out, 200ms top ease-out;
}

.control_grid {
  left: calc(75% + 30px);
  top: calc(50% + 6px);
  grid-template: "new" 62px/100px;
  /* 设置成62px而不是50px 是因为要给gameMode添加间隙 */
}

.newGameButton {
  border-radius: 5px;
  color: white;
  line-height: 50px;
  background-color: rgb(72, 178, 244);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  width: 100%;
  transition-duration: 0.3s;
  cursor: pointer;
}

.newGameButton:hover {
  background-color: rgb(133, 208, 255);
  transition: background-color 200ms;
}
</style>