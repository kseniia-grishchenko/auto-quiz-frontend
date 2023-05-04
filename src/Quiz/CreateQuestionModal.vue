<template>
  <el-form ref="form" :model="form" class="input-section">
    <h3>Назва</h3>
    <el-form-item>
      <el-input
        type="textarea"
        :autosize="{ minRows: 3}"
        placeholder="Введіть назву..."
        maxlength="511"
        v-model="form.title">
      </el-input>
    </el-form-item>
    <h3>Очікувана відповідь</h3>
    <el-form-item>
      <el-input
        type="textarea"
        :autosize="{ minRows: 3}"
        placeholder="Введіть відповідь..."
        v-model="form.expectedAnswer">
      </el-input>
    </el-form-item>
    <h3>Оцінка</h3>
    <el-form-item>
      <el-input-number v-model="form.value" :min="1"></el-input-number>
    </el-form-item>
    <el-form-item>
    <el-button type="primary" class="action" @click="handleCreateQuestion">Створити</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data: () => ({
    form: {
      title: '',
      expectedAnswer: '',
      value: 0
    }
  }),
  methods: {
    clearForm () {
      this.form = {
        title: '',
        expectedAnswer: '',
        value: 0
      };
    },

    handleCreateQuestion () {
      this.$emit('create-question', this.form);
      this.clearForm();
    }

  }
};
</script>

<style>

</style>
