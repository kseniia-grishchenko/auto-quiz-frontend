<template>
  <el-dialog :visible="visible" top="30vh" v-if="visible" @close="$emit('close')">
    <el-form ref="form" :model="editedQuiz" class="input-section">
      <h3>Назва</h3>
      <el-form-item>
        <el-input placeholder="Введіть назву..." v-model="editedQuiz.name"></el-input>
      </el-form-item>
      <h3>Тривалість</h3>
      <el-input-number v-model="editedQuiz.max_duration" :min="1"></el-input-number>
      <el-form-item>
        <el-button type="primary" class="action" @click="$emit('edit-quiz', editedQuiz)">Зберегти</el-button>
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
    quiz: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    editedQuiz: {}
  }),
  watch: {
    quiz: {
      handler (quiz) {
        this.editedQuiz = quiz;
      },
      immediate: true
    }
  }
};
</script>

<style>
h3 {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 8px;
}

.action {
  margin-top: 20px;
}
</style>
