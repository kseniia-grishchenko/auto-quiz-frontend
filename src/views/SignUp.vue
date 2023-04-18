<template>
  <el-row class="content">
    <el-col :span="10">
      <el-form ref="form" :model="form" class="input-section" :rules="rules">
        <h3>Зареєструйтесь, щоб продовжити</h3>
        <el-form-item prop="email">
          <span>Email</span>
          <el-input placeholder="Введіть Email" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item prop="firstName">
          <span>Ім'я</span>
          <el-input placeholder="Введіть імʼя" v-model="form.firstName"></el-input>
        </el-form-item>
        <el-form-item prop="lastName">
          <span>Прізвище</span>
          <el-input placeholder="Введіть прізвище" v-model="form.lastName"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span>Пароль</span>
          <el-input placeholder="Введіть пароль" v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <span>Оберіть вашу роль</span>
          <div class="role-btns">
            <el-button
              :class="{'active': form.isTeacher === false}"
              @click="form.isTeacher = false"
            >Учень</el-button>
            <el-button
              :class="{'active': form.isTeacher === true}"
              @click="form.isTeacher = true"
            >Вчитель</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="action" @click="onSubmit">Зареєструватись</el-button>
        </el-form-item>
      </el-form>
      <div>Вже зареєстровані? Увійти</div>
    </el-col>
    <el-col :span="12" :offset="2">
      <img src="/assets/icons/registration.png">
    </el-col>
  </el-row>
</template>

<script>
import { postUnauthorized } from '../api.js';

export default {
  data () {
    return {
      form: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        isTeacher: null
      },
      rules: {
        email: [
          { required: true, message: 'Це поле не може бути пустим', trigger: 'blur' },
          { type: 'email', message: 'Email має бути валідним', trigger: ['blur', 'change'] }
        ],
        firstName: [
          { required: true, message: 'Це поле не може бути пустим', trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: 'Це поле не може бути пустим', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Це поле не може бути пустим', trigger: 'blur' },
          { min: 5, message: 'Мінімальна довжина паролю - 5 символів', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    async onSubmit () {
      try {
        await postUnauthorized('/api/account/register/', {
          email: this.form.email,
          password: this.form.password,
          first_name: this.form.firstName,
          last_name: this.form.lastName,
          is_teacher: this.form.isTeacher || false
        });
        this.$notify({
          title: 'Успіх',
          message: 'Акаунт успішно створено',
          type: 'success',
          showClose: false
        });
        location.hash = '/login';
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
@import '../assets/variables.scss';
.action {
  span {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
  }
}
.role-btns {
  display: flex;
  span {
    font-size: 14px;
    line-height: 17px;
  }

  .active {
    background-color: #CE3E7A;
    span {
      color: $main-bg;
    }
  }
}
</style>
<style scoped lang="scss">
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
    text-align: center;
    margin-top: 24px
  }

  span {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: $main-font;
    display: inline-block;
    margin-bottom: 8px;
  }
}
</style>
