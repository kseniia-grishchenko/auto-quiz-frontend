<template>
  <div class="content">
    <el-row>
      <create-btn
        title="тест"
        @click="createModalOpened = true"></create-btn>
    </el-row>
    <el-table
      v-if="quizzes.length"
      :data="quizzes"
      @cell-click="handleQuizRedirect"
      :style="{
        width: '100%',
        fontSize: '20px',
        marginTop: '20px'
      }">
      <el-table-column
        prop="name"
        label="Назва">
      </el-table-column>
      <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          class="quiz-action"
          size="mini"
          @click.stop="quizToEdit = scope.row">Редагувати</el-button>
        <el-button
          class="quiz-action"
          size="mini"
          type="danger"
          @click.stop="quizToDelete = scope.row">Видалити</el-button>
      </template>
    </el-table-column>
    </el-table>
    <div v-else class="no-quizzes">
      В цьому курсі ще немає тестів
    </div>
    <el-dialog :visible.sync="createModalOpened" top="30vh">
      <el-form ref="form" :model="form" class="input-section">
        <h3>Назва</h3>
        <el-form-item>
          <el-input placeholder="Введіть назву..." v-model="form.name"></el-input>
        </el-form-item>
        <h3>Тривалість</h3>
        <el-input-number v-model="form.maxDuration" :min="1"></el-input-number>
        <el-form-item>
        <el-button type="primary" class="action" @click="createQuiz">Створити</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <edit-quiz-modal
      :visible="!!quizToEdit"
      :quiz="quizToEdit"
      @close="quizToEdit = null"
      @edit-quiz="editQuiz"
    >
    </edit-quiz-modal>
    <delete-quiz-modal
      :visible="!!quizToDelete"
      @close="quizToDelete = null"
      @delete-quiz="deleteQuiz"
    ></delete-quiz-modal>
  </div>
</template>

<script>
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest
} from '../api.js';
import CreateBtn from '../comps/CreateBtn.vue';
import EditQuizModal from './EditQuizModal.vue';
import DeleteQuizModal from './DeleteQuizModal.vue';

export default {
  data: () => ({
    createModalOpened: false,
    quizToEdit: null,
    quizToDelete: null,
    quizzes: [],
    subjectId: null,
    form: {
      name: '',
      maxDuration: 0
    }
  }),
  methods: {
    handleQuizRedirect (quiz) {
      location.hash = `#/subjects/${this.subjectId}/quiz/${quiz.id}`;
    },

    async createQuiz () {
      try {
        await postRequest(`/api/subjects/${this.subjectId}/quizzes/`, {
          name: this.form.name,
          max_duration: this.form.maxDuration
        });
        this.fetchQuizzes();
        this.createModalOpened = false;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async  editQuiz (editedQuiz) {
      this.quizToEdit = editedQuiz;
      try {
        await patchRequest(`/api/subjects/${this.subjectId}/quizzes/${this.quizToEdit.id}/`, {
          name: this.quizToEdit.name,
          max_duration: this.quizToEdit.max_duration
        });
        this.fetchQuizzes();
        this.quizToEdit = null;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async  deleteQuiz () {
      try {
        await deleteRequest(`/api/subjects/${this.subjectId}/quizzes/${this.quizToDelete.id}/`);
        this.fetchQuizzes();
        this.quizToDelete = null;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async fetchQuizzes () {
      try {
        const { data: quizzes } = await getRequest(`/api/subjects/${this.subjectId}/quizzes`);
        this.quizzes = quizzes;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    hashHandler () {
      const match = location.hash.match(/#\/subjects\/(\d+)/);
      if (!match) return;
      this.subjectId = Number(match[1]);
    }
  },
  watch: {
    async subjectId () {
      this.fetchQuizzes();
    }
  },
  mounted () {
    window.addEventListener('hashchange', this.hashHandler);
    this.hashHandler();
  },
  beforeDestroy () {
    window.removeEventListener('hashchange', this.hashHandler);
  },
  components: {
    CreateBtn,
    EditQuizModal,
    DeleteQuizModal
  }
};
</script>

<style lang="scss">
.quiz-action {
  span {
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
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

.quiz-action {
  width: auto;
}
</style>
