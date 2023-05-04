<template>
  <el-container v-if="active">
    <el-header>
      <nav-header :title="course.name" :navItems="navItems" :hash="hash"></nav-header>
    </el-header>
    <el-main>
      <course-task-list :course="course" :user="user"></course-task-list>
    </el-main>
  </el-container>
</template>

<script>
import { getRequest } from '../api.js';

import NavHeader from '../comps/NavHeader.vue';
import CourseTaskList from './CourseTaskList.vue';

export default {
  data: () => ({
    hash: '',
    id: null,
    course: {},
    active: false
  }),
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    navItems () {
      return [
        {
          title: 'Завдання',
          link: `#/courses/${this.id}`
        },
        {
          title: 'Інформація',
          link: `#/courses/${this.id}?info=true`
        }
      ];
    },
    courseInfoActive () {
      return !!this.hash.match(/#\/courses\/(\d+)?info=true/);
    }
  },
  methods: {
    hashHandler () {
      this.hash = location.hash;
      const match = location.hash.match(/#\/courses\/(\d+)/);
      this.active = !!match;
      if (!match) return;
      this.id = Number(match[1]);
    }
  },
  watch: {
    async id (id) {
      try {
        const { data: course } = await getRequest(`/api/courses/${id}`);
        this.course = course;
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
    CourseTaskList
  }
};
</script>

<style lang="sass" scoped>

</style>
