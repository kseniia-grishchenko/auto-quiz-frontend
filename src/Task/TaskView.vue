<template>
  <el-row v-if="active" :class="['content', isAvailable && 'is-available']">
    <el-button
      type="primary"
      v-if="isAvailable"
      class="start-btn"
      @click="startSession"
    >Розпочати тест</el-button>
    <task-question-list
      v-else
      :courseId="courseId"
      :sessionId="sessionId"
      :taskId="taskId">
    </task-question-list>
  </el-row>
</template>

<script>
import { getRequest, postRequest } from '../api.js';
import TaskQuestionList from './TaskQuestionList.vue';

export default {
  data: () => ({
    isAvailable: true,
    active: false,
    courseId: null,
    taskId: null,
    sessions: [],
    sessionId: null,
    questions: []
  }),
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    hashHandler () {
      const match = location.hash.match(/#\/courses\/(\d+)\/task\/(\d+)$/);
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
    },

    async startSession () {
      try {
        const { data: session } = await postRequest(`/api/courses/${this.courseId}/tasks/${this.taskId}/start/`);
        this.sessionId = session.id;
        this.isAvailable = false;
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
    },
    sessions (sessions) {
      const userSession = sessions.find(({ user }) => user === this.user.id);
      if (!userSession) {
        this.isAvailable = true;
        return;
      };
      this.isAvailable = false;
      this.sessionId = userSession.id;
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
    TaskQuestionList
  }
};
</script>

<style lang="scss" scoped>
.content.is-available {
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-btn {
  width: auto;
  font-size: 22px;
  font-weight: 600;
}
</style>
