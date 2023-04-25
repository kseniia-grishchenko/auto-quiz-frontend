<template>
  <div id="app">
    <el-container>
      <el-aside v-if="showAside" width="auto">
        <nav-menu :hash="hash"></nav-menu>
      </el-aside>
      <el-container>
        <el-header>
          <header-comp></header-comp>
        </el-header>
        <el-main>
          <sign-up v-if="!user"></sign-up>
          <sign-in v-if="!user" @log-in="handleLogIn"></sign-in>
          <subject-list v-if="user"></subject-list>
          <course-list v-if="user"></course-list>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode';
import {
  getRequest,
  postRequest
} from './api.js';

import NavMenu from './comps/NavMenu.vue';
import HeaderComp from './comps/HeaderComp.vue';
import SignUp from './views/SignUp.vue';
import SignIn from './views/SignIn.vue';
import SubjectList from './views/SubjectList.vue';
import CourseList from './views/CourseList.vue';

export default {
  data: () => ({
    hash: '',
    expiresAt: null,
    user: null
  }),
  computed: {
    showAside () {
      return !this.hash.match(/sign-up|sign-in/);
    }
  },
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
        const { data: user } = await getRequest('/api/account/me/');

        this.user = user;
      } catch (err) {
        console.log(err);
        console.error(err.response.data);
      }
    },

    async refreshToken () {
      try {
        const { data } = await postRequest('/api/account/token/refresh/', {
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

    this.refresher = setInterval(() => {
      if (this.expiresAt && this.expiresAt * 1e3 > Date.now()) return;
      this.refreshToken();
    }, 60 * 1e3);

    const hashChangeHandler = () => {
      this.hash = location.hash;
    };
    window.addEventListener('hashchange', hashChangeHandler);
    hashChangeHandler();
  },
  beforeDestroy () {
    clearInterval(this.refresher);
  },
  components: {
    NavMenu,
    HeaderComp,
    SignUp,
    SignIn,
    SubjectList,
    CourseList
  }
};
</script>

<style scoped>

</style>
