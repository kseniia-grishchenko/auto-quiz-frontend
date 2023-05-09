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
      <el-header height="auto">
        <task-timer
          :duration="duration"
          :startedAt="startedAt"
          :lastQuestion="nextDisabled"
          :taskFinished="finished"
          @finish-task="finishTask">
        </task-timer>
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
          :taskFinished="finished"
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
import { getRequest, postRequest } from '../api.js';
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
    finished: false,
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
      const sessionAnswers = JSON.parse(localStorage.getItem(`session-id-${this.sessionId}`)) || [];
      if (!sessionAnswers.length) return '';
      const questionAnswer = sessionAnswers.find(item => item.questionId === this.activeQuestion.id) || '';
      return questionAnswer.answer;
    },
    prevDisabled () {
      return this.activeQuestionIdx === 0;
    },

    nextDisabled () {
      return this.activeQuestionIdx === this.questions.length - 1;
    }
  },
  methods: {
    async fetchTaskInfo () {
      try {
        const { data: session } =
        await getRequest(`/api/courses/${this.courseId}/tasks/${this.taskId}/sessions/${this.sessionId}`);
        this.questions = session.task.quiz.questions;
        this.startedAt = session.started_at;
        this.duration = session.task.quiz.max_duration;
        this.finished = !!session.finished_at;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    selectPreviousQuestion () {
      this.speech.result = '';
      this.activeQuestionIdx = this.activeQuestionIdx - 1;
    },

    selectNextQuestion () {
      this.speech.result = '';
      this.activeQuestionIdx = this.activeQuestionIdx + 1;
    },

    recordResponse () {
      this.speech.result = '';
      this.speech.start();
    },

    stopRecording () {
      this.speech.stop();
      const sessionAnswers = JSON.parse(localStorage.getItem(`session-id-${this.sessionId}`)) || [];
      const questionToEdit = sessionAnswers.find(({ questionId }) => questionId === this.activeQuestion.id);
      if (questionToEdit) {
        questionToEdit.answer = this.speech.result;
      } else {
        sessionAnswers.push({
          questionId: this.activeQuestion.id,
          answer: this.speech.result
        });
      }
      localStorage.setItem(`session-id-${this.sessionId}`, JSON.stringify(sessionAnswers));
    },

    editResponse (editedResult) {
      this.speech.result = editedResult;
      const sessionAnswers = JSON.parse(localStorage.getItem(`session-id-${this.sessionId}`)) || [];
      const questionToEdit = sessionAnswers.find(({ questionId }) => questionId === this.activeQuestion.id);
      questionToEdit.answer = editedResult;
      localStorage.setItem(`session-id-${this.sessionId}`, JSON.stringify(sessionAnswers));
    },

    async finishTask () {
      try {
        const sessionAnswers = JSON.parse(localStorage.getItem(`session-id-${this.sessionId}`)) || [];
        await postRequest(`/api/courses/${this.courseId}/tasks/${this.taskId}/finish/`, {
          answers: sessionAnswers.map(({
            questionId,
            answer
          }) => ({
            question_id: questionId,
            answer
          }))
        });
        this.finished = true;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    setup () {
      this.fetchTaskInfo();

      this.speech = useSpeechRecognition({
        lang: 'uk-UA',
        continuous: true
      });
    }
  },
  watch: {
    sessionId: {
      handler (id) {
        if (!id) return;
        this.setup();
      }
    }
  },
  mounted () {
    this.setup();
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
