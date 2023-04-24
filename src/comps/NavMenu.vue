<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    @open="handleOpen"
  >
    <div class="title">Головне меню</div>
    <el-menu-item index="1">
      <el-link href="#/subjects" slot="title">
        <i class="el-icon-folder"></i>
        <span>Предмети</span>
      </el-link>
    </el-menu-item>
    <el-menu-item index="2">
      <el-link href="#/courses" slot="title">
        <i class="el-icon-notebook-1"></i>
        <span>Курси</span>
      </el-link>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss">
@import '../assets/variables.scss';

.el-menu-vertical-demo {
  width: 300px;
  height: 100%;
  background-color: $main-font;
  padding: 30px 20px;
}

.el-menu-item {
  border-radius: 10px;
  margin-bottom: 10px;
}

.el-menu-item > * {
  color: #fff !important;
  font-weight: 500;
  font-size: 18px;
  line-height: 20px;
  height: 100%;
  width: 100%;
  justify-content: start;
}

.el-menu-item.is-active,
.el-menu-item:hover {
  background-color: #404454;
}

.title {
  color: #404454;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 25px;
  padding: 0 20px;
  text-transform: uppercase;
}
</style>
