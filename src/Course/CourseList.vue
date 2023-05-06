<template>
  <el-row v-if="active">
    <el-row :gutter="12" v-if="active">
      <el-button class="create-course-btn" @click="modalOpened = true">
        <span>Створити курс</span>
        <span>+</span>
      </el-button>
    </el-row>
    <div class="list">
      <div
        v-for="(course, index) in courses"
        @click="redirectToCourse(course.id)"
        :key="index">
        <el-card
          class="course-card"
        >
          <div
            slot="header"
            class="header"
            :style="{backgroundColor: colors[index % 5]}"
          >
            <span>{{course.name}}</span>
            <div class="details" @click.stop="courseActive = course"><i class="el-icon-more"></i></div>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog
      :visible.sync="modalOpened"
      title="Створити"
      top="30vh">
      <el-form ref="form" :model="form" class="input-section">
        <h3>Назва курсу</h3>
        <el-form-item>
          <el-input placeholder="Введіть назву..." v-model="form.name"></el-input>
        </el-form-item>
        <h3>Обрати предмет</h3>
        <el-form-item>
          <el-radio-group v-model="form.subject" class="subject-choice">
            <el-radio
              v-for="(subject, index) in subjects"
              :key="index"
              :label="subject.id"
            >{{subject.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="action" @click="onSubmit">Створити</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      v-if="createdCourse"
      :visible="!!createdCourse"
      top="30vh"
      @close="createdCourse = null">
      <invitation-link-card :invitationLink="createdCourse.invitation_token">
      </invitation-link-card>
    </el-dialog>
    <el-dialog
      :visible="!!courseActive"
      title="Детальна інформація"
      @close="handleCloseInfoCard"
      width="60%"
      top="30vh"
    >
      <course-info-card
        v-if="courseActive"
        :course="courseActive"
        @edit-course-name="editCourseName"
        @delete-course="deleteCourse"
      >
      </course-info-card>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest
} from '../api.js';
import CourseInfoCard from '../comps/CourseInfoCard.vue';
import InvitationLinkCard from '../comps/InvitationLinkCard.vue';

export default {
  data: () => ({
    active: false,
    needToRefresh: false,
    modalOpened: false,
    createdCourse: null,
    courseActive: null,
    subjects: [],
    courses: [],
    form: {
      name: '',
      subject: null
    },
    colors: [
      '#FF595E',
      '#FFCA3A',
      '#8AC926',
      '#1982C4',
      '#6A4C93'
    ]
  }),
  methods: {
    redirectToCourse (id) {
      location.hash = `#/courses/${id}`;
    },

    async editCourseName ({ id, name }) {
      try {
        const { data: courseActive } = await patchRequest(`/api/courses/${id}/`, {
          name
        });
        this.courseActive = courseActive;
        this.needToRefresh = true;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async deleteCourse (id) {
      try {
        await deleteRequest(`/api/courses/${id}/`);
        this.courseActive = null;
        this.needToRefresh = true;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    handleCloseInfoCard () {
      this.courseActive = null;
      if (this.needToRefresh) this.fetchCourses();
      this.needToRefresh = false;
    },

    hashHandler () {
      this.active = !!location.hash.match('courses$');
    },

    async fetchCourses () {
      try {
        const { data: courses } = await getRequest('/api/courses');
        this.courses = courses;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async fetchSubjects () {
      try {
        const { data: subjects } = await getRequest('/api/subjects');
        this.subjects = subjects;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async onSubmit () {
      try {
        const { data: createdCourse } = await postRequest('/api/courses/', {
          name: this.form.name,
          subject: this.form.subject
        });
        this.fetchCourses();
        this.modalOpened = false;
        this.createdCourse = createdCourse;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
      this.form.name = '';
    }
  },
  watch: {
    active (value) {
      if (!value) return;
      this.fetchCourses();
      this.fetchSubjects();
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
    CourseInfoCard,
    InvitationLinkCard
  }
};
</script>

<style lang="scss">
  .create-course-btn > span {
    display: flex;
    justify-content: space-between;
  }

  .course-card {
    cursor: pointer;

    > .el-card__header {
      padding: 0;
    }
  }

  .subject-choice {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
<style lang="scss" scoped>
  span {
    font-size: 18px;
    font-weight: 500;
  }
  .create-course-btn span:last-of-type {
    font-size: 22px;
  }

  .list {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .header {
    padding: 20px;
    font-size: 18px;
    line-height: 22px;
    color: #fff;
    display: flex;
    justify-content: space-between;

    .details {
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
