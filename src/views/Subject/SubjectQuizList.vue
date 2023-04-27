<template>
  <div class="content">
    <el-row>
      <create-btn
        title="квіз"
        @click="createModalOpened = true"></create-btn>
    </el-row>
    <el-table
      v-if="quizzes.length"
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
    <div v-else class="no-quizzes">
      В цьому курсі ще немає квізів
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
  </div>
</template>

<script>
import { getRequest, postRequest } from '../../api.js';
import CreateBtn from '../../comps/CreateBtn.vue';

export default {
  data: () => ({
    createModalOpened: false,
    quizzes: [],
    subjectId: null,
    form: {
      name: '',
      maxDuration: 0
    }
  }),
  methods: {
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

    async fetchQuizzes () {
      const { data: quizzes } = await getRequest(`/api/subjects/${this.subjectId}/quizzes`);
      this.quizzes = quizzes;
    },

    hashHandler () {
      const match = location.hash.match(/#\/subjects\?id=(\d+)/);
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
  components: { CreateBtn }
};
</script>

<style scoped>
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
</style>
