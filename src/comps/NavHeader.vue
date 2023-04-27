<template>
  <div class="nav-header" mode="horizontal">
    <div class="title">{{title}}</div>
    <div
      v-for="(item, index) in navItems"
      :key="index"
      :active="hash === item.link"
      class="menu-item"
    >
      <a :href="item.link">{{item.title}}</a>
    </div>
  </div>
</template>

<script>
export default {
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
    }
  }
};
</script>

<style lang="scss">
@import '../assets/variables.scss';
</style>
<style lang="scss" scoped>
@import '../assets/variables.scss';

.nav-header {
  border-bottom: solid 1px #e6e6e6;
  position: relative;
  display: flex;
  align-items: center;
  padding: 20px 40px 0;

  > * {
    padding-bottom: 20px;
  }

  > div:first-of-type {
    margin-right: 36vw;
    position: relative;
  }

  .title {
    font-weight: 700;
    font-size: 22px;
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

}
</style>
