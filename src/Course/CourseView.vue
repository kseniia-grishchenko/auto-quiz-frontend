<template>
  <el-container v-if="active">
    <el-header>
      <nav-header :title="course.name" :navItems="navItems" :hash="hash" v-on="$listeners" :user="user"></nav-header>
    </el-header>
    <el-main>
      <course-info
        v-if="courseInfoActive"
        :course="course"
        :user="user"
        @refresh-course-info="fetchCourse"
      ></course-info>
      <course-task-list
        v-else
        :course="course"
        :user="user"
      ></course-task-list>
    </el-main>
  </el-container>
</template>

<script>
import { getRequest } from '../api.js';

import NavHeader from '../comps/NavHeader.vue';
import CourseTaskList from './CourseTaskList.vue';
import CourseInfo from './CourseInfo.vue';

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
      return !!this.hash.match(/#\/courses\/(\d+)\?info=true/);
    }
  },
  methods: {
    hashHandler () {
      this.hash = location.hash;
      const match = location.hash.match(/#\/courses\/(\d+)($|\?info=true)/);
      this.active = !!match;
      if (!match) return;
      this.id = Number(match[1]);
    },

    async fetchCourse () {
      try {
        const { data: course } = await getRequest(`/api/courses/${this.id}`);
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
  watch: {
    id () {
      this.fetchCourse();
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
    CourseTaskList,
    CourseInfo
  }
};
</script>

<style lang="sass" scoped>

</style>
