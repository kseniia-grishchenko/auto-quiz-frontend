<template>
  <el-container v-if="active">
    <el-header>
      <nav-header :title="quiz.name" :navItems="navItems" :hash="hash"></nav-header>
    </el-header>
    <el-main>
      <quiz-question-list
        :questions="questions"
        :subjectId="subjectId"
        :quizId="quizId"
        @create-question="createQuestion"
        :createModalOpened="createModalOpened"
        @open-create-modal="createModalOpened = true"
        @close-create-modal="createModalOpened = false"
      ></quiz-question-list>
    </el-main>
  </el-container>
</template>

<script>
import { getRequest, postRequest } from '../api.js';
import NavHeader from '../comps/NavHeader.vue';
import QuizQuestionList from './QuizQuestionList.vue';

export default {
  data: () => ({
    hash: '',
    subjectId: null,
    quizId: null,
    quiz: {},
    questions: [],
    active: false,
    createModalOpened: false
  }),
  computed: {
    navItems () {
      return [
        {
          title: 'Питання',
          link: `#/subjects/${this.subjectId}/quiz/${this.quizId}`
        }
      ];
    }
  },
  methods: {
    hashHandler () {
      this.hash = location.hash;
      const match = location.hash.match(/#\/subjects\/(\d+)\/quiz\/(\d+)/);
      this.active = !!match;
      if (!match) return;
      this.subjectId = Number(match[1]);
      this.quizId = Number(match[2]);
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
    }
  },
  watch: {
    async quizId () {
      this.quiz = {};
      try {
        const { data: quiz } = await getRequest(`/api/subjects/${this.subjectId}/quizzes/${this.quizId}`);
        this.quiz = quiz;
        this.fetchQuestions();
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
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
    NavHeader,
    QuizQuestionList
  }
};
</script>

<style lang="scss" scoped>

</style>
