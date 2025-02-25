<template>
  <svg width="70" height="30" xmlns="http://www.w3.org/2000/svg">
    <g>
      <title>Layer 1</title>
      <circle cx="20" cy="8" r="1.5" />
      <circle cx="50" cy="8" r="1.5" />22
      <rect v-if="data" x="24" y="10" width="22" height="22" rx="4" fill="#000000" />
      <rect v-if="!data" x="24" y="10" width="22" height="22" rx="4" fill="#ffff00" />
    </g>
  </svg>
</template>

<script>
export default {
  data() {
    return {
      data: true
    }
  }
}
</script>