<template>
  <el-row class="content user-profile" v-if="active">
    <h3>Ваша особиста інформація</h3>
    <el-form ref="form" :model="editedUser" class="info-input-section">
      <el-col :span="14">
        <el-form-item>
          <span>Імʼя</span>
          <el-input placeholder="Введіть імʼя" v-model="editedUser.first_name"></el-input>
        </el-form-item>
        <el-form-item>
          <span>Прізвище</span>
          <el-input placeholder="Введіть прізвище" v-model="editedUser.last_name"></el-input>
        </el-form-item>
        <el-form-item>
          <span>Email</span>
          <el-input placeholder="Введіть Email" v-model="editedUser.email"></el-input>
        </el-form-item>
        <el-form-item>
          <span>Пароль</span>
          <el-input placeholder="Введіть пароль" v-model="editedUser.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="action" @click="onSubmit">Зберегти</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="10" class="profile-pic">
        <el-upload
          class="avatar-uploader"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleAvatarSuccess">
          <img v-if="editedUser.profile_image" :src="editedUser.profile_image" class="pic">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
import { patchRequestWithFormData } from '../api.js';

export default {
  data: () => ({
    editedUser: null,
    active: false
  }),
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    accessToken () {
      return localStorage.getItem('access');
    }
  },
  methods: {
    hashHandler () {
      this.active = !!location.hash.match('profile$');
    },

    async onSubmit () {
      try {
        const formData = new FormData();
        if (this.editedUser.first_name) formData.append('first_name', this.editedUser.first_name);
        if (this.editedUser.last_name) formData.append('last_name', this.editedUser.last_name);
        if (this.editedUser.password) formData.append('password', this.editedUser.password);
        if (this.editedUser.email) formData.append('email', this.editedUser.email);
        if (this.editedUser.profile_image !== this.user.profile_image) formData.append('profile_image', this.editedUser.profile_image);
        await patchRequestWithFormData('/api/account/me/', formData);

        this.$emit('refresh-user');
        this.$notify({
          title: 'Успіх',
          message: 'Інформацію успішно оновлено',
          type: 'success',
          showClose: false
        });
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
    },

    handleAvatarSuccess (file, fileList) {
      this.editedUser.profile_image = file.raw;
      this.onSubmit();
    }
  },
  watch: {
    user: {
      handler (user) {
        this.editedUser = { ...user };
      },
      immediate: true
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

<style lang="scss">
@import '../assets/variables.scss';

.user-profile {
  width: 80% !important;
  margin: auto;
}

.info-input-section {
  display: flex;
}

.profile-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
}

.avatar-uploader {
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.pic {
  width: 100%;
  height: 100%;
}
</style>
