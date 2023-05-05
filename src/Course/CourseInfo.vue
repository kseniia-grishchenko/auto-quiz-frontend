<template>
  <el-row class="content">
    <div>
      <span>Назва:</span>
      <span>{{course.name}}</span>
    </div>
    <div>
      <span>Предмет:</span>
      <span>{{course.subject?.name}}</span>
    </div>
    <div>
      <span>Запрошувальне посилання:</span>
      <span @click="copyLink">{{invitationLink}}</span>
    </div>
    <div>
      <span>Користувачі:</span>
      <el-table
        v-if="userList?.length"
        :data="userList"
        :style="{
          width: '100%',
          fontSize: '20px',
          marginTop: '20px'
        }">
        <el-table-column
          prop="name"
          label="Імʼя">
        </el-table-column>
        <el-table-column
          prop="email"
          label="Електронна пошта">
        </el-table-column>
        <el-table-column
          prop="role"
          label="Роль">
        </el-table-column>
        <el-table-column
          v-if="userRole === 'owner' "
          align="right">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.permission !== 'owner'"
              class="course-action"
              size="mini"
              type="danger"
              @click.stop="changeUserPermission(scope.row)">
              Зробити {{scope.row.permission === 'student' ? 'вчителем' : 'студентом' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-row>
</template>

<script>
import { postRequest } from '../api.js';

export default {
  data: () => ({
    roles: {
      owner: 'Власник',
      student: 'Студент',
      teacher: 'Вчитель'
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
    userList () {
      return this.course.users?.map(({ permission, user }) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        permission,
        role: this.roles[permission]
      }));
    },
    invitationLink () {
      return `${import.meta.env.VITE_APP_URL}/#/join-subject/${this.course.invitation_token}`;
    },
    userRole () {
      const currentUser = this.course.users.find(({ user }) => user.id === this.user.id);
      return currentUser.permission;
    }
  },
  methods: {
    async copyLink () {
      await navigator.clipboard.writeText(this.invitationLink);
      this.$notify({
        title: 'Успіх',
        message: 'Посилання успішно скопійовано',
        type: 'success',
        showClose: false
      });
    },

    async changeUserPermission (user) {
      try {
        await postRequest(`/api/courses/${this.course.id}/change_user_permission/`, {
          user: user.id,
          permission: user.permission === 'student' ? 'teacher' : 'student'
        });
        this.$emit('refresh-course-info');
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    }
  }
};
</script>

<style lang="scss">
.course-action {
  span {
    font-size: 18px;
    font-weight: 500;
  }
}
</style>
<style lang="scss" scoped>
.content {
  padding: 12px 0;

  div {
    margin-bottom: 20px;
    gap: 20px;

    span {
      font-size: 20px;
    }

    span:first-of-type {
      font-weight: 600;
    }
  }

  div:not(:last-of-type) {
    display: flex;
  }
}
</style>
