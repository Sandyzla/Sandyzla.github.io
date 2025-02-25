<template>
  <!-- <div class="svgDIV"> -->
  <svg width="70" height="30" xmlns="http://www.w3.org/2000/svg">
    <g>
      <title>Layer 1</title>
      <circle cx="20" cy="8" r="1.5" />
      <circle cx="50" cy="8" r="1.5" />
      <rect x="24" y="10" width="22" height="0.1" rx="4" stroke="#000000" ref="rect3Ref" />
    </g>
  </svg>
  <!-- </div> -->
</template>

<script>
import gsap from 'gsap';
export default {
  methods: {
    blink() {
      var dom = this.$refs.rect3Ref
      var tl = gsap.timeline({ repeat: -1, repeatDelay: 12 });
      tl.to(dom, { scaleX: 0, duration: 0.2, transformOrigin: "center" });
      tl.to(dom, { scaleX: 0.4, duration: 0.15, transformOrigin: "center" });
      tl.to(dom, { scaleX: 0.2, duration: 0.2, transformOrigin: "center" });
      tl.to(dom, { scaleX: 1, duration: 0.15, transformOrigin: "center" });
    }
  },
  mounted() {
    this.blink();
    // setInterval(() => this.blink(), 3000);
  }

}
</script>

<style scoped></style>