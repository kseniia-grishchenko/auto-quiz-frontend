<template>
  <el-container>
    <el-aside width="300px">
      <el-menu :default-active="String(activeQuestionIdx)" class="question-list">
        <el-menu-item
          v-for="(_, index) in questions"
          :key="index"
          :index="String(index)"
          @click="activeQuestionIdx = index">
            <span>Питання {{index + 1}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
          <task-timer
            :duration="duration"
            :startedAt="startedAt"
            :lastQuestion="nextDisabled"
            @finish-task="finishTask"></task-timer>
          <question-pagination
            v-if="activeQuestion"
            :title="paginationTitle"
            :prevDisabled="prevDisabled"
            :nextDisabled="nextDisabled"
            @prev="selectPreviousQuestion"
            @next="selectNextQuestion"
          ></question-pagination>
      </el-header>
      <el-main>
        <question-view
          v-if="activeQuestion"
          :question="activeQuestion"
          :isListening="speech.isListening"
          :result="speech.result || savedResponse"
          @record-response="recordResponse"
          @stop-recording="stopRecording"
          @edited-response="editResponse"
        ></question-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { useSpeechRecognition } from '@vueuse/core';
import { getRequest } from '../api.js';
import QuestionView from './QuestionView.vue';
import QuestionPagination from './QuestionPagination.vue';
import TaskTimer from './TaskTimer.vue';

export default {
  data: () => ({
    activeQuestionIdx: 0,
    questions: [],
    isListening: false,
    speech: null,
    startedAt: null,
    duration: 0
  }),
  props: {
    courseId: null,
    taskId: null,
    sessionId: null
  },
  computed: {
    paginationTitle () {
      return `Питання ${this.activeQuestionIdx + 1}`;
    },
    activeQuestion () {
      return this.questions[this.activeQuestionIdx];
    },
    savedResponse () {
      return localStorage.getItem(`${this.sessionId}-${this.activeQuestion.id}`);
    },
    prevDisabled () {
      return this.activeQuestionIdx === 0;
    },

    nextDisabled () {
      return this.activeQuestionIdx === this.questions.length - 1;
    }
  },
  methods: {
    async fetchTaskQuestions () {
      try {
        const { data: session } =
        await getRequest(`/api/courses/${this.courseId}/tasks/${this.taskId}/sessions/${this.sessionId}`);
        this.questions = session.task.quiz.questions;
        this.startedAt = session.started_at;
        this.duration = session.task.quiz.max_duration;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    selectPreviousQuestion () {
      this.activeQuestionIdx = this.activeQuestionIdx - 1;
    },

    selectNextQuestion () {
      this.activeQuestionIdx = this.activeQuestionIdx + 1;
    },

    recordResponse () {
      this.speech.result = '';
      this.speech.start();
    },

    stopRecording () {
      this.speech.stop();
      localStorage.setItem(`${this.sessionId}-${this.activeQuestion.id}`, this.speech.result);
    },

    editResponse (editedResult) {
      this.speech.result = editedResult;
      localStorage.setItem(`${this.sessionId}-${this.activeQuestion.id}`, this.speech.result);
    }
  },
  watch: {
    sessionId: {
      handler (id) {
        if (!id) return;
        this.fetchTaskQuestions();

        this.speech = useSpeechRecognition({
          lang: 'uk-UA',
          continuous: true
        });
      }
    }
  },

  components: {
    QuestionView,
    QuestionPagination,
    TaskTimer
  }
};
</script>

<style lang="scss">
.question-list {
  .el-menu-item.is-active {
    background-color: #e8e9ea;
  }
}
</style>
<style lang="scss" scoped>
.question-list {
  height: 100%;
}
</style>
