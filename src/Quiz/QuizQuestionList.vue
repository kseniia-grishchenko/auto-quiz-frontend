<template>
  <div class="content">
    <el-row>
      <create-btn
        title="питання"
        @click="createModalOpened = true"></create-btn>
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
          @click.stop="questionToEdit = scope.row">Редагувати</el-button>
        <el-button
          class="quiz-action"
          size="mini"
          type="danger"
          @click.stop="questionToDelete = scope.row">Видалити</el-button>
      </template>
    </el-table-column>
    </el-table>
    <div v-else class="no-questions">
      В цьому тесті ще немає питань
    </div>
    <create-question-modal
      :visible="createModalOpened"
      @create-question="createQuestion"
      @close="$emit('close-create-modal')"
    ></create-question-modal>
    <edit-question-modal
      :visible="!!questionToEdit"
      :question="questionToEdit"
      @edit-question="editQuestion"
      @close="questionToEdit = null"
    ></edit-question-modal>
    <delete-question-modal
      :visible="!!questionToDelete"
      @close="questionToDelete = null"
      @delete-question="deleteQuestion"
    ></delete-question-modal>
  </div>
</template>

<script>
import { getRequest, postRequest, patchRequest, deleteRequest } from '../api.js';
import CreateBtn from '../comps/CreateBtn.vue';
import CreateQuestionModal from './CreateQuestionModal.vue';
import EditQuestionModal from './EditQuestionModal.vue';
import DeleteQuestionModal from './DeleteQuestionModal.vue';

export default {
  data: () => ({
    questions: [],
    questionToEdit: null,
    questionToDelete: null,
    createModalOpened: false
  }),
  props: {
    subjectId: {
      type: Number
    },
    quizId: {
      type: Number
    }
  },
  methods: {
    handleQuestionRedirect (question) {
      location.hash = `#/subjects/${this.subjectId}/quiz/${this.quizId}/question/${question.id}`;
    },

    async fetchQuestions () {
      const { data: questions } = await getRequest(`/api/subjects/${this.subjectId}/quizzes/${this.quizId}/questions`);
      this.questions = questions;
    },

    async createQuestion (form) {
      try {
        await postRequest(`/api/subjects/${this.subjectId}/quizzes/${this.quizId}/questions/`, {
          title: form.title,
          expected_answer: form.expectedAnswer,
          value: form.value
        });
        this.fetchQuestions();
        this.createModalOpened = false;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async editQuestion (form) {
      try {
        await patchRequest(`/api/subjects/${this.subjectId}/quizzes/${this.quizId}/questions/${form.id}/`, {
          title: form.title,
          expected_answer: form.expected_answer,
          value: form.value
        });
        this.fetchQuestions();
        this.questionToEdit = null;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async deleteQuestion () {
      try {
        await deleteRequest(`/api/subjects/${this.subjectId}/quizzes/${this.quizId}/questions/${this.questionToDelete.id}/`);
        this.fetchQuestions();
        this.questionToDelete = null;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    }
  },
  watch: {
    quizId: {
      handler (id) {
        if (!id) return;
        this.fetchQuestions();
      },
      immediate: true
    }
  },
  components: {
    CreateBtn,
    CreateQuestionModal,
    EditQuestionModal,
    DeleteQuestionModal
  }
};
</script>

<style lang="scss">
.question-name div {
  white-space: nowrap;
}
</style>

<style lang="scss" scoped>
.action {
  margin-top: 20px;
}
.content {
  width: 100%;
}

.no-questions {
  padding: 12px 0;
  font-size: 20px;
}

.quiz-action {
  width: auto;
}
</style>
