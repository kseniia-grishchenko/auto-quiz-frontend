<template>
  <div id="app">
    <el-container>
      <el-header>
        <header-comp></header-comp>
      </el-header>
      <el-main>
        <sign-up v-if="!user"></sign-up>
        <sign-in v-if="!user" @log-in="handleLogIn"></sign-in>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode';
import { get, post } from './api.js';

import HeaderComp from './comps/HeaderComp.vue';
import SignUp from './views/SignUp.vue';
import SignIn from './views/SignIn.vue';

export default {
  data: () => ({
    expiresAt: null,
    user: null,
    type: 'password'
  }),
  methods: {
    async logIn () {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) return;

      const { exp } = jwtDecode(accessToken);
      this.expiresAt = exp;

      if (this.expiresAt * 1e3 > Date.now()) {
        await this.fetchUser();
        return;
      }

      this.refreshToken();
    },

    async handleLogIn () {
      await this.logIn();
      location.hash = '#/';
    },

    logOut () {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');

      this.user = null;
    },

    async fetchUser () {
      try {
        const { data: user } = await get('/api/account/me/');

        this.user = user;
      } catch (err) {
        console.log(err);
        console.error(err.response.data);
      }
    },

    async refreshToken () {
      try {
        const { data } = await post('/api/account/token/refresh/', {
          refresh: localStorage.getItem('refresh')
        });

        const { access, refresh } = data;

        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        this.logIn();
      } catch (err) {
        console.error(err.response.data);
      }
    }
  },
  created () {
    this.logIn();

    setInterval(() => {
      if (this.expiresAt && this.expiresAt * 1e3 > Date.now()) return;
      this.refreshToken();
    }, 60 * 1e3);
  },
  components: {
    HeaderComp,
    SignUp,
    SignIn
  }
};
</script>

<style scoped>

</style>
