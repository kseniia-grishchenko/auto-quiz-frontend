<template>
  <el-row class="content" v-if="active">
    <el-col :span="10">
      <el-form ref="form" :model="form" class="input-section">
        <h3>Увійдіть, щоб продовжити</h3>
        <el-form-item>
          <span>Email</span>
          <el-input placeholder="Введіть Email" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item>
          <span>Пароль</span>
          <el-input placeholder="Введіть пароль" v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="action" @click="onSubmit">Увійти</el-button>
        </el-form-item>
      </el-form>
      <div>
        <span>Вперше на сайті?</span>
        <el-link type="primary" href="#/sign-up">Зареєструватись</el-link>
      </div>
    </el-col>
    <el-col :span="12" :offset="2">
      <img src="/assets/icons/registration.png">
    </el-col>
  </el-row>
</template>

<script>
import { postRequest } from '../api.js';

export default {
  data () {
    return {
      active: false,
      form: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    hashHandler () {
      this.active = !!location.hash.match('sign-in$');
    },

    async onSubmit () {
      try {
        const {
          data: {
            access,
            refresh
          }
        } = await postRequest('/api/account/token/', {
          email: this.form.email,
          password: this.form.password
        });

        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);

        this.$emit('log-in');
      } catch (err) {
        this.$notify.error({
          title: 'Помилка',
          message: JSON.stringify(err.response.data),
          showClose: false
        });
      }
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
@import '../assets/variables.scss';
.content {
  display: flex;
  align-items: center;
  padding: 60px 80px;
}
img {
  max-width: 100%;
  max-height: 100%;
}

h3 {
  font-weight: 700;
  font-size: 40px;
  line-height: 49px;
  margin-bottom: 40px;
}

.input-section {
  > div {
    margin-bottom: 24px;
  }

  ~ div {
    display: flex;
    gap: 6px;
    justify-content: center;
    margin-top: 24px
  }

  span {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    display: inline-block;
    margin-bottom: 8px;
  }
}
</style>
