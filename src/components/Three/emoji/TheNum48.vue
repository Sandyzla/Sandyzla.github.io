<template>
  <!-- <div class="svgDIV"> -->
  <svg width="70" height="30" xmlns="http://www.w3.org/2000/svg">
    <g>
      <title>Layer 1</title>
      <rect transform="rotate(45,12,10)" height="3" width="0.4" x="12" y="10" stroke="#000000" fill="#000000" rx="2" />
      <rect transform="rotate(135,15,12)" height="3" width="0.4" x="15" y="12" stroke="#000000" fill="#000000" rx="2" />
      <rect transform="rotate(45,55,10)" height="3" width="0.4" x="55" y="10" stroke="#000000" fill="#000000" rx="2" />
      <rect transform="rotate(135,58,12)" height="3" width="0.4" x="58" y="12" stroke="#000000" fill="#000000" rx="2" />
      <rect height="1.7" width="50" x="10" y="15" stroke="#000000" fill="#000000" rx="0.3"></rect>
      <rect height="5" width="12" x="20" y="15" stroke="#ffffff" fill="#ffffff" rx="0"></rect>
      <!-- <ellipse ry="2.7" rx="3.5" cy="19" cx="35" ref="elli24Ref" /> -->
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
    // this.blink();
    // setInterval(() => this.blink(), 15000);
  }

}
</script>

<style scoped></style>