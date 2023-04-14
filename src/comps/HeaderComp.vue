<template>
  <div>
    <img src="/assets/icons/logo.png">
    <span>SIGMA SCHOOL</span>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
@import '../assets/variables.scss';

div {
  background-color: $secondary-bg;
  padding: 10px 60px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);

  span {
    display: inline-block;
    max-width: 100px;
    font-weight: 700;
  }
}

</style>
