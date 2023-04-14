<template>
  <el-row class="content">
    <el-col :span="10">
      <div class="input-section">
        <h3>Зареєструйтесь, щоб продовжити</h3>
        <div>
          <span>Email</span>
          <el-input placeholder="Введіть Email" v-model="email"></el-input>
        </div>
        <div>
          <span>Ім'я</span>
          <el-input placeholder="Введіть імʼя" v-model="firstName"></el-input>
        </div>
        <div>
          <span>Прізвище</span>
          <el-input placeholder="Введіть прізвище" v-model="lastName"></el-input>
        </div>
        <div>
          <span>Пароль</span>
          <el-input placeholder="Введіть пароль" v-model="password" show-password></el-input>
        </div>
        <div>
          <span>Оберіть вашу роль</span>
          <div class="role-btns">
            <el-button type="primary">Учень</el-button>
            <el-button type="primary">Вчитель</el-button>
          </div>
        </div>
        <el-button type="primary" class="action">Зареєструватись</el-button>
        <div>Вже зареєстровані? Увійти</div>
      </div>
    </el-col>
    <el-col :span="12" :offset="2">
      <img src="/assets/icons/registration.png">
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: ''
    };
  }
};
</script>

<style lang="scss">
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
  div:not(:last-of-type) {
    margin-bottom: 24px;
  }

  > div:last-of-type {
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
