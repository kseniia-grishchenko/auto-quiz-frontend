<template>
    <el-menu
      :default-active="hash"
      class="nav-menu"
      :collapse="collapse"
    >
      <el-menu-item class="sidebar-title" disabled>
        <i class="el-icon-house"></i>
        <span slot="title">Головне меню</span>
      </el-menu-item>
      <el-menu-item index="#/" @click="redirectTo('#/')">
        <i class="el-icon-folder"></i>
        <span slot="title">Предмети</span>
      </el-menu-item>
      <el-menu-item index="#/courses" @click="redirectTo('#/courses')">
        <i class="el-icon-notebook-1"></i>
        <span slot="title">Курси</span>
      </el-menu-item>
      <div class="bottom">
        <el-popover
          placement="right"
          width="200"
          trigger="manual"
          v-model="popoverVisible"
          class="action-container">
          <div class="user-actions">
            <el-button>Профіль</el-button>
            <el-button @click="$emit('sign-out')">Вийти</el-button>
          </div>
          <svg slot="reference" @click="popoverVisible = !popoverVisible" class="avatar" width="26" height="26" viewbox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <use href="/assets/icons/avatar.svg#avatar"></use>
          </svg>
        </el-popover>
        <div class="collapse-btn" @click="collapse = !collapse">
          <i v-if="!collapse" class="el-icon-d-arrow-left"></i>
          <i v-else class="el-icon-d-arrow-right"></i>
        </div>
      </div>
    </el-menu>
</template>

<script>
export default {
  data: () => ({
    collapse: true,
    popoverVisible: false
  }),
  props: {
    hash: {
      type: String,
      default: ''
    }
  },
  methods: {
    redirectTo (hash) {
      location.hash = hash;
    }
  }
};
</script>

<style lang="scss">
@import '../assets/variables.scss';

.nav-menu:not(.el-menu--collapse) {
  width: 300px;
}

.el-menu--collapse {
  width: 80px;
}

.nav-menu {
  height: 100%;
  background-color: $main-font;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
}

.nav-menu .el-menu-item {
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: start;
}

.nav-menu .el-menu-item > * {
  color: #fff !important;
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
}

.el-menu-item.is-active,
.el-menu-item:hover {
  background-color: #404454;
}

.sidebar-title > * {
  color: #404454 !important;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  text-transform: uppercase;
  width: auto;
}

.sidebar-title > i {
  margin-top: -2px;
}

.collapse-btn {
  color: #fff;
  width: 100%;
  height: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-menu-item.is-disabled.sidebar-title {
  cursor: auto;
  opacity: 1;
}

.el-tooltip {
  display: flex !important;
  align-items: center;
  justify-content: center;
}

.bottom {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;

  > * {
    margin-bottom: 10px;
  }
}

.avatar {
  color: #fff;
  cursor: pointer;
}

.action-container {
  display: flex;
  width: 100%;
  justify-content: center;
}
.user-actions {
  button {
    margin-bottom: 10px;
    margin-left: 0 !important;
  }
}
</style>
