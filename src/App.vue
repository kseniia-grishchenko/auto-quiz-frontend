<template>
  <div id="app">
    <el-container>
      <el-header>
        <header-comp></header-comp>
      </el-header>
      <el-main>
        <sign-up></sign-up>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import HeaderComp from './comps/HeaderComp.vue';
import SignUp from './views/SignUp.vue';

export default {
  components: {
    SignUp,
    HeaderComp
  }
};
</script>

<style scoped>

</style>
