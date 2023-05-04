<template>
  <el-container v-if="active">
    <el-header>
      <nav-header :title="quiz.name" :navItems="navItems" :hash="hash"></nav-header>
    </el-header>
    <el-main>
      <quiz-question-list
        :subjectId="subjectId"
        :quizId="quizId"
      ></quiz-question-list>
    </el-main>
  </el-container>
</template>

<script>
import NavHeader from '../comps/NavHeader.vue';
import QuizQuestionList from './QuizQuestionList.vue';

export default {
  data: () => ({
    hash: '',
    subjectId: null,
    quizId: null,
    quiz: {},
    active: false
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
