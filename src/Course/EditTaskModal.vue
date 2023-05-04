<template>
  <el-dialog :visible="visible" top="30vh" v-if="visible" @close="$emit('close')">
    <el-form ref="form" :model="editedTask" class="input-section">
      <h3>Назва</h3>
      <el-form-item>
        <el-input placeholder="Введіть назву..." v-model="editedTask.name"></el-input>
      </el-form-item>
      <h3>Тривалість</h3>
      <el-input-number v-model="editedTask.max_duration" :min="1"></el-input-number>
      <el-form-item>
        <el-button type="primary" class="action" @click="$emit('edit-task', editedTask)">Зберегти</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    editedTask: {}
  }),
  watch: {
    task: {
      handler (task) {
        this.editedTask = task;
      },
      immediate: true
    }
  }
};
</script>

<style>
.action {
  margin-top: 20px;
}
</style>
