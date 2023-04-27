<template>
  <el-row v-if="active">
    <el-row :gutter="12" v-if="active">
      <el-button class="create-subject-btn" @click="modalOpened = true">
        <span>Створити предмет</span>
        <span>+</span>
      </el-button>
    </el-row>
    <div class="list">
      <div
        v-for="(subject, index) in subjects"
        @click="redirectToSubject(subject.id)"
        :key="index">
        <el-card
          class="subject-card"
        >
          <div
            slot="header"
            class="header"
            :style="{backgroundColor: colors[index % 5]}"
          >
            <span>{{subject.name}}</span>
            <div class="details" @click.stop="handleCardClick(subject)"><i class="el-icon-more"></i></div>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog :visible.sync="modalOpened" title="Назва предмету" top="30vh">
      <el-form ref="form" :model="form" class="input-section">
        <el-form-item>
          <el-input placeholder="Введіть назву..." v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="action" @click="onSubmit">Створити</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      v-if="createdSubject"
      :visible="!!createdSubject"
      top="30vh"
      @close="createdSubject = null">
      <invitation-token-card :invitationToken="createdSubject.invitation_token">
      </invitation-token-card>
    </el-dialog>
    <el-dialog
      :visible="!!subjectActive"
      title="Детальна інформація"
      @close="handleCloseInfoCard"
      width="60%"
      top="30vh"
    >
      <subject-info-card
        v-if="subjectActive"
        :subject="subjectActive"
        @edit-subject-name="editSubjectName"
        @delete-subject="deleteSubject"
      ></subject-info-card>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
} from '../api.js';
import SubjectInfoCard from '../comps/SubjectInfoCard.vue';
import InvitationTokenCard from '../comps/InvitationTokenCard.vue';

export default {
  data: () => ({
    active: false,
    needToRefresh: false,
    modalOpened: false,
    createdSubject: null,
    subjectActive: null,
    subjects: [],
    form: {
      name: ''
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
    redirectToSubject (id) {
      location.hash = `subjects?id=${id}`;
    },

    handleCardClick (subject) {
      this.subjectActive = subject;
    },

    async editSubjectName ({ id, name }) {
      try {
        const { data: subjectActive } = await putRequest(`/api/subjects/${id}/`, {
          name
        });
        this.subjectActive = subjectActive;
        this.needToRefresh = true;
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    async deleteSubject (id) {
      try {
        await deleteRequest(`/api/subjects/${id}/`);
        this.subjectActive = null;
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
      this.subjectActive = null;
      if (this.needToRefresh) this.fetchSubjects();
      this.needToRefresh = false;
    },

    hashHandler () {
      this.active = !!location.hash.match('subjects$');
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
        const { data: createdSubject } = await postRequest('/api/subjects/', {
          name: this.form.name
        });
        this.fetchSubjects();
        this.modalOpened = false;
        this.createdSubject = createdSubject;
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
    SubjectInfoCard,
    InvitationTokenCard
  }
};
</script>

<style lang="scss">
  .create-subject-btn > span {
    display: flex;
    justify-content: space-between;
  }

  .subject-card > .el-card__header {
    padding: 0;
  }
</style>
<style lang="scss" scoped>
  h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 8px;
  }

  span {
    font-size: 18px;
    font-weight: 500;
  }
  .create-subject-btn span:last-of-type {
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
