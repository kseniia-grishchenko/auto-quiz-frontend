<template>
  <el-popover
    placement="bottom"
    width="200"
    trigger="manual"
    v-model="popoverVisible"
    class="action-container">
    <div class="user-actions">
      <el-link type="primary" href="#/profile" class="link-redirect">
        <el-button>Профіль</el-button>
      </el-link>
      <el-button @click="$emit('sign-out')">Вийти</el-button>
    </div>
    <svg slot="reference" @click="popoverVisible = !popoverVisible" class="avatar" width="26" height="26" viewbox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <use href="/assets/icons/avatar.svg#avatar"></use>
    </svg>
  </el-popover>
</template>

<script>
export default {
  data: () => ({
    popoverVisible: false
  })
};
</script>

<style lang="scss">
@import '../assets/variables.scss';

.link-redirect {
  width: 100%;
  border-bottom: none;
  > span {
    width: 100%;
  }
}

.link-redirect.el-link--primary.is-underline:hover:after {
  border-color: transparent
}
</style>
<style lang="scss" scoped>
@import '../assets/variables.scss';

.action-container {
  .avatar {
    color: $main-font;
    cursor: pointer;
  }
}
</style>
