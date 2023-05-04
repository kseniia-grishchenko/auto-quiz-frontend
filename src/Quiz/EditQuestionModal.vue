<template>
  <el-dialog top="20vh" v-if="visible" :visible="visible" @close="$emit('close')">
    <el-form ref="form" :model="editedQuestion" class="input-section">
      <h3>Назва</h3>
      <el-form-item>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3}"
          placeholder="Введіть назву..."
          maxlength="511"
          v-model="editedQuestion.title">
        </el-input>
      </el-form-item>
      <h3>Очікувана відповідь</h3>
      <el-form-item>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3}"
          placeholder="Введіть відповідь..."
          v-model="editedQuestion.expected_answer">
        </el-input>
      </el-form-item>
      <h3>Оцінка</h3>
      <el-form-item>
        <el-input-number v-model="editedQuestion.value" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item>
      <el-button type="primary" class="action" @click="$emit('edit-question', editedQuestion)">Зберегти</el-button>
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
    question: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    editedQuestion: {}
  }),
  watch: {
    question: {
      handler (question) {
        this.editedQuestion = question;
      },
      immediate: true
    }
  }
};
</script>

<style>

</style>
