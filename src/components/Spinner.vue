<template>
  <div>
    <div class="spinner-border text-warning spinner-data absolute" />
  </div>
</template>

<script>
export default {
  name: "Spinner",
};
</script>
<style scoped>
.text-warning {
  position: fixed;
  height: 80px;
  width: 80px;
}
.absolute {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
