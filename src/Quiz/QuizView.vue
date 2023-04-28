<template>
  <el-container v-if="active">
    <el-header>
      <nav-header :title="quiz.name" :navItems="navItems" :hash="hash"></nav-header>
    </el-header>
    <el-main>
    </el-main>
  </el-container>
</template>

<script>
import { getRequest } from '../api.js';
import NavHeader from '../comps/NavHeader.vue';

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
      console.log(match);
      this.subjectId = Number(match[1]);
      this.quizId = Number(match[2]);
    }
  },
  watch: {
    async quizId (id) {
      try {
        const { data: quiz } = await getRequest(`/api/subjects/${this.subjectId}/quizzes/${this.quizId}`);
        this.quiz = quiz;
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
    NavHeader
  }
};
</script>

<style lang="scss" scoped>

</style>
