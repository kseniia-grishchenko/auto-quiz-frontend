<template>
  <div class="nav-header" mode="horizontal">
    <div class="title">{{title}}</div>
    <div class="menu-items">
      <div
        v-for="(item, index) in navItems"
        :key="index"
        :active="hash === item.link"
        class="menu-item"
      >
        <a :href="item.link">{{item.title}}</a>
      </div>
    </div>
    <div></div>
    <action-popover v-on="$listeners" :user="user"></action-popover>
  </div>
</template>

<script>
import ActionPopover from './ActionPopover.vue';
export default {
  components: { ActionPopover },
  props: {
    hash: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    navItems: {
      type: Array,
      default: () => []
    },
    user: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/variables.scss';

.nav-header {
  border-bottom: solid 1px #e6e6e6;
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 20px 40px 0;

  .menu-items {
    display: flex;

    > * {
      padding-bottom: 20px;
    }
  }

  > div:first-of-type {
    position: relative;
  }

  .title {
    font-weight: 700;
    font-size: 22px;
    padding-bottom: 20px;
  }

  .menu-item > * {
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    text-decoration: none;
    color: $main-font;
  }

  .menu-item {
    border-bottom: 3px solid transparent;
  }

  .menu-item:not(:last-of-type) {
    margin-right: 60px;
  }

  .menu-item[active=true] {
    border-color: $main-font;

    > * {
      font-weight: 600;
    }
  }

  .action-container {
    position: absolute;
    right: 40px;
    top: 14px;
    cursor: pointer;
  }
}
</style>
