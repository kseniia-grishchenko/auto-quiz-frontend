<template>
  <el-container v-if="active">
    <el-header>
      <nav-header :title="subject.name" :navItems="navItems" :hash="hash"></nav-header>
    </el-header>
    <el-main>
      <subject-info :subject="subject" v-if="subjectInfoActive"></subject-info>
      <subject-quiz-list
        v-else
        :subjectId="id">
      </subject-quiz-list>
    </el-main>
  </el-container>
</template>

<script>
import {
  getRequest
} from '../../api.js';
import NavHeader from '../../comps/NavHeader.vue';
import SubjectInfo from './SubjectInfo.vue';
import SubjectQuizList from './SubjectQuizList.vue';

export default {
  data: () => ({
    hash: '',
    id: null,
    subject: {},
    active: false
  }),
  computed: {
    navItems () {
      return [
        {
          title: 'Квізи',
          link: `#/subjects?id=${this.id}`
        },
        {
          title: 'Інформація',
          link: `#/subjects?id=${this.id}&info=true`
        }
      ];
    },
    subjectInfoActive () {
      return this.hash.match(/info=true/);
    }
  },
  methods: {
    hashHandler () {
      this.hash = location.hash;
      const match = location.hash.match(/#\/subjects\?id=(\d+)/);
      if (!match) return;
      this.active = !!match[0];
      this.id = Number(match[1]);
    }
  },
  watch: {
    async id (id) {
      const { data: subject } = await getRequest(`/api/subjects/${id}`);
      this.subject = subject;
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
    SubjectInfo,
    SubjectQuizList
  }
};
</script>

<style>

</style>
