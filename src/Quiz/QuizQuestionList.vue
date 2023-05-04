<template>
  <div class="content">
    <el-row>
      <create-btn
        title="питання"
        @click="$emit('open-create-modal')"></create-btn>
    </el-row>
    <el-table
      v-if="questions.length"
      :data="questions"
      :style="{
        width: '100%',
        fontSize: '20px',
        marginTop: '20px'
      }">
      <el-table-column
        prop="title"
        label="Назва">
      </el-table-column>
      <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          class="quiz-action"
          size="mini"
          @click="handleQuestionRedirect(scope.row)">Редагувати</el-button>
      </template>
    </el-table-column>
    </el-table>
    <div v-else class="no-questions">
      В цьому квізі ще немає питань
    </div>
    <el-dialog :visible="createModalOpened" top="20vh" @close="$emit('close-create-modal')">
      <create-question-modal v-on="$listeners"></create-question-modal>
    </el-dialog>
  </div>
</template>

<script>
import CreateBtn from '../comps/CreateBtn.vue';
import CreateQuestionModal from './CreateQuestionModal.vue';

export default {
  props: {
    subjectId: {
      type: Number
    },
    quizId: {
      type: Number
    },
    questions: {
      type: Array,
      default: () => []
    },
    createModalOpened: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleQuestionRedirect (question) {
      location.hash = `#/subjects/${this.subjectId}/quiz/${this.quizId}/question/${question.id}`;
    }
  },
  components: {
    CreateBtn,
    CreateQuestionModal
  }
};
</script>

<style lang="scss" scoped>
.action {
  margin-top: 20px;
}
.content {
  width: 100%;
}

.no-questions {
  padding: 12px 0;
  font-size: 20px;
}

.quiz-action {
  width: auto;
}
</style>
