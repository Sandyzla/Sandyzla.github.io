<template>
  <!-- <div class="svgDIV"> -->
  <svg width="70" height="30" xmlns="http://www.w3.org/2000/svg">
    <g>
      <title>Layer 1</title>
      <rect transform="rotate(45,25,10)" height="5" width="1" x="25" y="10" stroke="#000000" fill="#000000" rx="6" />
      <rect transform="rotate(135,30,14)" height="5" width="1" x="29.5" y="14.4" stroke="#000000" rx="6" fill="#000000" />
      <rect transform="rotate(45,45,10)" height="5" width="1" x="45" y="10" stroke="#000000" fill="#000000" rx="6" />
      <rect transform="rotate(135,50,14)" height="5" width="1" x="49.5" y="14.4" stroke="#000000" fill="#000000" rx="6" />
      <ellipse ry="2.7" rx="3.5" cy="19" cx="35" ref="elli24Ref" />
    </g>
  </svg>
  <!-- </div> -->
</template>

<script>
import gsap from 'gsap';
export default {
  methods: {
    blink() {
      var dom = this.$refs.elli24Ref;
      var tl = gsap.timeline({ repeat: -1, repeatDelay: 12 });
      tl.to(dom, { scaleY: 0, scaleX: 0.6, duration: 0.15, transformOrigin: "center" });
      tl.to(dom, { scaleY: 0.1, scaleX: 0.4, duration: 0.1, transformOrigin: "center" });
      tl.to(dom, { scaleY: 0.8, scaleX: 0.4, duration: 0.1, transformOrigin: "center" });
      tl.to(dom, { scaleY: 0.3, scaleX: 0.4, duration: 0.1, transformOrigin: "center" });
      tl.to(dom, { scaleY: 1, scaleX: 1, duration: 0.3, transformOrigin: "center" });
    }
  },
  mounted() {
    this.blink();
    // setInterval(() => this.blink(), 15000);
  }

}
</script>

<style scoped></style>