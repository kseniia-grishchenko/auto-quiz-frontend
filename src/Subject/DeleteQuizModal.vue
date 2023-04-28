<template>
  <el-dialog :visible="visible" top="30vh" v-if="visible" @close="$emit('close')">
    <h3>Ви впевнені що хочете видалити цей квіз?</h3>
    <el-row>
      <el-button class="quiz-action" @click="$emit('delete-quiz')" type="danger">Так</el-button>
      <el-button class="quiz-action" @click="$emit('close')">Ні</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.quiz-action {
  width: auto;
}
</style>
