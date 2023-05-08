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
          :result="speech.result"
          @record-response="recordResponse"
          @stop-recording="stopRecording"
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

export default {
  data: () => ({
    activeQuestionIdx: 0,
    questions: [],
    isListening: false,
    speech: null
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
    QuestionPagination
  }
};
</script>

<style lang="scss" scoped>
.question-list {
  height: 100%;
}
</style>
