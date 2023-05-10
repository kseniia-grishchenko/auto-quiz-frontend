<template>
  <div class="content">
    <el-row v-if="!isStudent">
      <create-btn
        title="завдання"
        @click="createModalOpened = true"></create-btn>
    </el-row>
    <el-table
      v-if="tasks.length"
      :data="tasks"
      @cell-click="handleTaskRedirect"
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
      <template slot-scope="scope" v-if="!isStudent">
        <el-button
          class="task-action"
          size="mini"
          type="primary"
          @click.stop="redirectToAnswersPage(scope.row)">Переглянути відповіді</el-button>
        <el-button
          class="task-action"
          size="mini"
          @click.stop="taskToEdit = {...scope.row}">Редагувати</el-button>
        <el-button
          class="task-action"
          size="mini"
          type="danger"
          @click.stop="taskToDelete = {...scope.row}">Видалити</el-button>
      </template>
    </el-table-column>
    </el-table>
    <div v-else class="no-tasks">
      В цьому курсі ще немає завдань
    </div>
    <el-dialog :visible.sync="createModalOpened" top="30vh">
      <el-form ref="form" :model="form" class="input-section">
        <h3>Назва</h3>
        <el-form-item>
          <el-input placeholder="Введіть назву..." v-model="form.title"></el-input>
        </el-form-item>
        <h3>Дедлайн</h3>
        <el-form-item>
          <el-date-picker
            v-model="form.deadline"
            type="datetime"
            placeholder="Оберіть дату і час">
          </el-date-picker>
        </el-form-item>
        <h3>Квіз</h3>
        <el-form-item>
          <el-radio-group v-model="form.quiz" class="subject-choice">
            <el-radio
              v-for="(quiz, index) in quizzes"
              :key="index"
              :label="quiz.id"
            >{{quiz.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="action" @click="createTask">Створити</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <edit-task-modal
      :visible="!!taskToEdit"
      :task="taskToEdit"
      @close="taskToEdit = null"
      @edit-task="editTask"
    >
    </edit-task-modal>
    <delete-task-modal
      :visible="!!taskToDelete"
      @close="taskToDelete = null"
      @delete-task="deleteTask"
    ></delete-task-modal>
  </div>
</template>

<script>
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest
} from '../api.js';
import CreateBtn from '../comps/CreateBtn.vue';
import EditTaskModal from './EditTaskModal.vue';
import DeleteTaskModal from './DeleteTaskModal.vue';

export default {
  data: () => ({
    createModalOpened: false,
    taskToEdit: null,
    taskToDelete: null,
    tasks: [],
    quizzes: [],
    form: {
      title: '',
      deadline: '',
      quiz: null
    }
  }),
  props: {
    course: {
      type: Object,
      default: () => {}
    },
    user: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isStudent () {
      if (!this.course.id) return;
      const currentUser = this.course.users.find(({ user }) => user.id === this.user.id);
      return currentUser.permission === 'student';
    }
  },
  methods: {
    handleTaskRedirect (task) {
      location.hash = `#/courses/${this.course.id}/task/${task.id}`;
    },

    redirectToAnswersPage (task) {
      location.hash = `#/courses/${this.course.id}/task/${task.id}/answers`;
    },

    async createTask () {
      try {
        await postRequest(`/api/courses/${this.course.id}/tasks/`, {
          title: this.form.title,
          deadline: this.form.deadline,
          quiz: this.form.quiz
        });
        this.fetchTasks();
        this.createModalOpened = false;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async  editTask (editedTask) {
      this.taskToEdit = editedTask;
      try {
        await patchRequest(`/api/courses/${this.course.id}/tasks/${this.taskToEdit.id}/`, {
          title: this.taskToEdit.title,
          deadline: this.taskToEdit.deadline
        });
        this.fetchTasks();
        this.taskToEdit = null;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async deleteTask () {
      try {
        await deleteRequest(`/api/courses/${this.course.id}/tasks/${this.taskToDelete.id}/`);
        this.fetchTasks();
        this.taskToDelete = null;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async fetchTasks () {
      try {
        const { data: tasks } = await getRequest(`/api/courses/${this.course.id}/tasks`);
        this.tasks = tasks;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async fetchQuizzes () {
      try {
        const { data: quizzes } = await getRequest(`/api/subjects/${this.course.subject.id}/quizzes`);
        this.quizzes = quizzes;
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
    course: {
      handler (course) {
        if (!course.id) return;
        this.fetchTasks();
        if (!this.isStudent) this.fetchQuizzes();
      },
      immediate: true
    }
  },
  components: {
    CreateBtn,
    EditTaskModal,
    DeleteTaskModal
  }
};
</script>

<style lang="scss">
  .el-picker-panel__footer > .el-button {
    margin-left: 0;
    margin-bottom: 10px;
  }
</style>
<style lang="scss">
.task-action {
  span {
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
<style lang="scss" scoped>
.action {
  margin-top: 20px;
}
.content {
  width: 100%;
}

.no-tasks {
  padding: 12px 0;
  font-size: 20px;
}

.task-action {
  width: auto;
}
</style>
