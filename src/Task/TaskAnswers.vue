<template>
  <el-row v-if="active">
    <el-table
      v-if="sessions.length"
      :data="sessions"
      :style="{
        width: '100%',
        fontSize: '20px',
        marginTop: '20px'
      }">
      <el-table-column
        prop="user_full_name"
        label="Імʼя студента">
      </el-table-column>
      <el-table-column
        prop="total_mark"
        label="Результат">
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
import { getRequest } from '../api.js';

export default {
  data: () => ({
    active: false,
    courseId: null,
    taskId: null,
    sessions: []
  }),
  methods: {
    hashHandler () {
      const match = location.hash.match(/#\/courses\/(\d+)\/task\/(\d+)\/answers$/);
      this.active = !!match;
      if (!match) return;
      this.courseId = Number(match[1]);
      this.taskId = Number(match[2]);
    },

    async fetchSessions () {
      try {
        const { data: sessions } = await getRequest(`/api/courses/${this.courseId}/tasks/${this.taskId}/sessions`);
        this.sessions = sessions;
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
    active (active) {
      if (!active) return;
      this.fetchSessions();
    }
  },
  mounted () {
    window.addEventListener('hashchange', this.hashHandler);
    this.hashHandler();
  },
  beforeDestroy () {
    window.removeEventListener('hashchange', this.hashHandler);
  }
};
</script>

<style>
</style>
