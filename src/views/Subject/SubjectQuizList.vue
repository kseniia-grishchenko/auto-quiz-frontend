<template>
  <el-table
    :data="quizzes"
    :style="{
      width: '100%',
      fontSize: '20px',
    }">
  <el-table-column
    prop="name"
    label="Назва">
  </el-table-column>
</el-table>
</template>

<script>
export default {
  props: {
    quizzes: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style>

</style>
