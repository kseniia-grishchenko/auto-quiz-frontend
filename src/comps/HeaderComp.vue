<template>
  <div class="header">
    <div class="right">
      <img src="/assets/icons/logo.png">
      <span>SIGMA SCHOOL</span>
    </div>
    <action-popover v-on="$listeners"></action-popover>
  </div>
</template>

<script>
import ActionPopover from './ActionPopover.vue';
export default {
  data: () => ({
    popoverVisible: false
  }),
  components: { ActionPopover }

};
</script>

<style lang="scss" scoped>
@import '../assets/variables.scss';

.header {
  background-color: $secondary-bg;
  padding: 10px 60px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);

  .right {
    display: flex;
    align-items: center;
  }

  span {
    display: inline-block;
    max-width: 100px;
    font-weight: 700;
  }

  .action-container {
    position: absolute;
    right: 40px;
    top: 20px;
  }
}

</style>
