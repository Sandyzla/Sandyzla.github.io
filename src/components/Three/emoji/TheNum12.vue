<template>
  <!-- <div class="svgDIV"> -->
  <svg width="70" height="30" xmlns="http://www.w3.org/2000/svg">
    <g>
      <title>Layer 1</title>
      <ellipse cx="14" cy="12" rx="3" ry="3" ref="cir1Ref" />
      <ellipse cx="56" cy="12" rx="3" ry="3" ref="cir2Ref" />
      <rect x="26" y="14" width="18" height="0.1" rx="4" stroke="#000000" />
    </g>
  </svg>
  <!-- </div> -->
</template>

<script>
import gsap from 'gsap';
export default {
  methods: {
    blink() {
      var cir1 = this.$refs.cir1Ref;
      var cir2 = this.$refs.cir2Ref;
      var tl = gsap.timeline({ repeat: -1, repeatDelay: 10 });
      tl.to([cir1, cir2], { ry: 0, duration: 0.15, transformOrigin: "center" });
      tl.to([cir1, cir2], { ry: 3, duration: 0.15, transformOrigin: "center" });
      tl.to([cir1, cir2], { ry: 3, duration: 0.1, transformOrigin: "center" });
      tl.to([cir1, cir2], { ry: 0, duration: 0.15, transformOrigin: "center" });
      tl.to([cir1, cir2], { ry: 3, duration: 0.15, transformOrigin: "center" });
    }
  },
  mounted() {
    this.blink();
    // setInterval(() => this.blink(), 20000);
  }

}
</script>

<style scoped></style>