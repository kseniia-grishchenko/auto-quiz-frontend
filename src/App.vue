<template>
  <div id="app">
    <el-container>
      <el-header>
        <header-comp></header-comp>
      </el-header>
      <el-main>
        <registration-view></registration-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import HeaderComp from './comps/HeaderComp.vue';
import RegistrationView from './views/RegistrationView.vue';

export default {
  components: {
    RegistrationView,
    HeaderComp
  }
};
</script>

<style scoped>

</style>
