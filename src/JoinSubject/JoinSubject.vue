<template>
  <el-row v-if="active" class="content">
    <div v-if="loggedIn">
      <el-button type="primary" class="action" @click="joinCourse">
        Приєднатись до курсу
      </el-button>
    </div>
    <div v-if="!loggedIn">
      <h3>Щоб продовжити, увійдіть або зареєструйтесь</h3>
      <div class="btn-container">
        <el-button type="primary" class="action" @click="handleSignInRedirect">
          Увійти
        </el-button>
        <el-button type="primary" class="action" @click="handleSignUpRedirect">
          Зареєструватись
        </el-button>
      </div>
    </div>
  </el-row>
</template>

<script>
import { postRequest } from '../api.js';

export default {
  data: () => ({
    active: false,
    invitationToken: ''
  }),
  computed: {
    loggedIn () {
      return !!localStorage.getItem('access');
    }
  },
  methods: {
    hashHandler () {
      const match = location.hash.match(/#\/join-subject\/(.+)/);
      this.active = !!match;
      if (!match) return;
      this.invitationToken = match[1];
    },

    handleSignInRedirect () {
      location.hash = '#/sign-in';
    },

    handleSignUpRedirect () {
      location.hash = '#/sign-up';
    },

    async joinCourse () {
      try {
        await postRequest('/api/subjects/join/', {
          invitation_token: this.invitationToken
        });
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data[0]),
          showClose: false
        });
      }
      location.hash = '#/subjects';
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

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action {
  width: auto;
}

.btn-container {
  display: flex;
  justify-content: center;
}
</style>
