<template>
  <el-dialog :visible="visible" top="30vh" v-if="visible" @close="$emit('close')">
    <h3>Ви впевнені що хочете видалити це завдання?</h3>
    <el-row>
      <el-button class="task-action" @click="$emit('delete-task')" type="danger">Так</el-button>
      <el-button class="task-action" @click="$emit('close')">Ні</el-button>
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
.task-action {
  width: auto;
}
</style>
