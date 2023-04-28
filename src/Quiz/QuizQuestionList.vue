<template>
  <div class="content">
    <el-row>
      <create-btn
        title="питання"
        @click="$emit('open-create-modal')"></create-btn>
    </el-row>
    <el-table
      v-if="questions.length"
      :data="questions"
      :style="{
        width: '100%',
        fontSize: '20px',
        marginTop: '20px'
      }">
      <el-table-column
        prop="title"
        label="Назва">
      </el-table-column>
      <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          class="quiz-action"
          size="mini"
          @click="handleQuestionRedirect(scope.row)">Редагувати</el-button>
      </template>
    </el-table-column>
    </el-table>
    <div v-else class="no-questions">
      В цьому квізі ще немає питань
    </div>
    <el-dialog :visible="createModalOpened" top="20vh" @close="$emit('close-create-modal')">
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
        <el-button type="primary" class="action" @click="$emit('create-question', form)">Створити</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import CreateBtn from '../comps/CreateBtn.vue';

export default {
  props: {
    subjectId: {
      type: Number
    },
    quizId: {
      type: Number
    },
    questions: {
      type: Array,
      default: () => []
    },
    createModalOpened: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    form: {
      title: '',
      expectedAnswer: '',
      value: 0
    }
  }),
  methods: {
    handleQuestionRedirect (question) {
      location.hash = `#/subjects/${this.subjectId}/quiz/${this.quizId}/question/${question.id}`;
    }
  },
  components: {
    CreateBtn
  }
};
</script>

<style lang="scss" scoped>
.action {
  margin-top: 20px;
}
.content {
  width: 100%;
}

.no-quizzes {
  padding: 12px 0;
  font-size: 20px;
}

h3 {
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 8px;
}

.quiz-action {
  width: auto;
}
</style>
