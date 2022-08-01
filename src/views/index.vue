<template>
  <div class="app-container home">
    <img src="../assets/logo/logo.png" height="512">
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.home img{
  display: block;
  margin: 0 auto;
}
</style>

